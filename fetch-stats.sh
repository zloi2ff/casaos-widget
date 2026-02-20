#!/bin/bash
# CasaOS stats fetcher - matches CasaOS dashboard values

ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes zloi2ff@192.168.31.73 '
# CPU - use mpstat if available, fallback to /proc/stat
if command -v mpstat &>/dev/null; then
  cpu_usage=$(LC_NUMERIC=C mpstat 1 1 | awk "/^Average:/ {gsub(\",\", \".\"); v=100-\$NF; if(v<1) v=1; printf \"%.0f\", v}")
else
  # Fallback: take two samples 1 second apart
  cpu1=$(head -1 /proc/stat)
  sleep 1
  cpu2=$(head -1 /proc/stat)

  set -- $cpu1; shift
  u1=$1 n1=$2 s1=$3 i1=$4 w1=$5 x1=$6 y1=$7 z1=$8

  set -- $cpu2; shift
  u2=$1 n2=$2 s2=$3 i2=$4 w2=$5 x2=$6 y2=$7 z2=$8

  idle1=$((i1 + w1))
  idle2=$((i2 + w2))
  total1=$((u1 + n1 + s1 + i1 + w1 + x1 + y1 + z1))
  total2=$((u2 + n2 + s2 + i2 + w2 + x2 + y2 + z2))

  idle_d=$((idle2 - idle1))
  total_d=$((total2 - total1))

  if [ $total_d -gt 0 ]; then
    cpu_usage=$(( (total_d - idle_d) * 100 / total_d ))
  else
    cpu_usage=0
  fi
fi

# RAM - exclude buffers/cache/reclaimable like CasaOS
mem_info=$(cat /proc/meminfo)
mem_total=$(echo "$mem_info" | awk "/^MemTotal:/ {print \$2}")
mem_free=$(echo "$mem_info" | awk "/^MemFree:/ {print \$2}")
mem_buffers=$(echo "$mem_info" | awk "/^Buffers:/ {print \$2}")
mem_cached=$(echo "$mem_info" | awk "/^Cached:/ {print \$2}")
mem_sreclaimable=$(echo "$mem_info" | awk "/^SReclaimable:/ {print \$2}")
mem_used=$((mem_total - mem_free - mem_buffers - mem_cached - mem_sreclaimable))
ram_percent=$((mem_used * 100 / mem_total))
# Use binary GB (1024^3) like CasaOS RAM display
ram_used_gb=$(awk -v m="$mem_used" "BEGIN {printf \"%.2f\", m / 1048576}")
ram_total_gb=$(awk -v m="$mem_total" "BEGIN {printf \"%.2f\", m / 1048576}")

# Temperature
temp=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null || echo 0)
temp_c=$((temp / 1000))

# Power
power=$(cat /sys/class/power_supply/*/power_now 2>/dev/null | head -1)
if [ -n "$power" ] && [ "$power" -gt 0 ] 2>/dev/null; then
  power_w=$(awk -v p="$power" "BEGIN {printf \"%.1f\", p / 1000000}")
else
  power_w="--"
fi

# Top CPU process (exclude ps/grep/awk and system processes)
top_proc=$(ps -eo pcpu,comm --no-headers --sort=-pcpu 2>/dev/null | grep -v -E "^[[:space:]]*(ps|grep|awk|head|sort|sed)" | grep -v -E "[[:space:]]+(ps|grep|awk)$" | head -1 | awk "{gsub(/^ +/, \"\"); cpu=\$1; name=\$2; if(cpu+0 < 0.1) {name=\"--\"; cpu=0}; printf \"%s:%s\", name, cpu}")
[ -z "$top_proc" ] && top_proc="--:0"

# System info output
echo "CPU:$cpu_usage"
echo "RAM:$ram_percent"
echo "RAM_USED:$ram_used_gb"
echo "RAM_TOTAL:$ram_total_gb"
echo "TEMP:$temp_c"
echo "POWER:$power_w"
echo "TOP_PROC:$top_proc"

# System disk
disk_root=$(df / | tail -1 | awk "{print \$3*1024,\$2*1024,\$5}" | tr -d "%")
echo "DISK:System:/:$disk_root:--"

# Auto-detect all mounted disks (sudo needed for devmon mounts)
echo "saberuu3aa" | sudo -S df -h 2>/dev/null | grep -E "^/dev/" | grep -v -E "(/boot|/efi)" | while read line; do
  dev=$(echo "$line" | awk "{print \$1}")
  mount=$(echo "$line" | awk "{print \$NF}")

  # Skip root
  if [ "$mount" = "/" ]; then continue; fi

  # Get disk info
  info=$(echo "saberuu3aa" | sudo -S df "$mount" 2>/dev/null | tail -1 | awk "{print \$3*1024,\$2*1024,\$5}" | tr -d "%")

  # Get disk name from mount path
  name=$(basename "$mount")

  # Try to get temperature via smartctl
  basedev=$(echo "$dev" | sed "s/[0-9]*$//")
  temp=$(echo "saberuu3aa" | sudo -S smartctl -A "$basedev" 2>/dev/null | awk "/Temperature_Celsius/ {print \$10}")
  [ -z "$temp" ] && temp="--"

  echo "DISK:$name:$mount:$info:$temp"
done

# Tailscale status (try native first, fallback to docker)
ts_output=""
if command -v tailscale &>/dev/null; then
  ts_output=$(tailscale status --json 2>/dev/null)
fi
# Fallback to docker if native failed or returned empty
if [ -z "$ts_output" ]; then
  ts_output=$(echo "saberuu3aa" | sudo -S docker exec tailscale tailscale status --json 2>/dev/null)
fi

if [ -n "$ts_output" ]; then
  ts_state=$(echo "$ts_output" | grep "BackendState" | grep -oE "Running|Stopped|Starting" | head -1)
  ts_ip=$(echo "$ts_output" | grep -oE "100\.[0-9]+\.[0-9]+\.[0-9]+" | head -1)
  ts_hostname=$(echo "$ts_output" | grep "HostName" | head -1 | sed "s/.*\"HostName\":[[:space:]]*\"\([^\"]*\)\".*/\1/")
  [ "$ts_state" = "Running" ] && ts_online="true" || ts_online="false"
  [ -z "$ts_ip" ] && ts_ip="--"
  [ -z "$ts_hostname" ] && ts_hostname="unknown"
  echo "TAILSCALE:$ts_online:$ts_ip:$ts_hostname"
else
  echo "TAILSCALE:false:--:--"
fi

# Docker stats with ports
for container in $(echo "saberuu3aa" | sudo -S docker ps --format "{{.Names}}" 2>/dev/null); do
  raw_stats=$(echo "saberuu3aa" | sudo -S docker stats --no-stream --format "{{.CPUPerc}}:{{.MemUsage}}" "$container" 2>/dev/null)
  # Cap CPU at 100% (docker stats can exceed 100% on multi-core systems)
  cpu_val=$(echo "$raw_stats" | cut -d: -f1 | tr -d '%')
  mem_val=$(echo "$raw_stats" | cut -d: -f2)
  if [ -n "$cpu_val" ]; then
    cpu_capped=$(awk -v c="$cpu_val" "BEGIN {printf \"%.2f\", (c > 100) ? 100 : c}")
    stats="${cpu_capped}%:${mem_val}"
  else
    stats="$raw_stats"
  fi
  # Get web port - prioritize common web UI ports
  all_ports=$(echo "saberuu3aa" | sudo -S docker port "$container" 2>/dev/null | grep -oE "[0-9]+$" | sort -u)
  port="--"
  # First pass: look for 8080 specifically (common web UI)
  for p in $all_ports; do
    if [ "$p" = "8080" ]; then port=$p; break; fi
  done
  # Second pass: 8xxx ports
  if [ "$port" = "--" ]; then
    for p in $all_ports; do
      if [ "$p" -ge 8000 ] && [ "$p" -le 9999 ]; then port=$p; break; fi
    done
  fi
  # Third pass: 3xxx ports
  if [ "$port" = "--" ]; then
    for p in $all_ports; do
      if [ "$p" -ge 3000 ] && [ "$p" -le 3999 ]; then port=$p; break; fi
    done
  fi
  # Fourth pass: 80 or 443
  if [ "$port" = "--" ]; then
    for p in $all_ports; do
      if [ "$p" = "80" ] || [ "$p" = "443" ]; then port=$p; break; fi
    done
  fi
  echo "CONTAINER:$container:$stats:$port"
done
' 2>/dev/null
