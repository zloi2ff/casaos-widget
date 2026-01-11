#!/bin/bash
# CasaOS stats fetcher for Übersicht widget

# Load configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.sh"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "ERROR:Config file not found. Copy config.example.sh to config.sh"
  exit 1
fi

source "$CONFIG_FILE"

# Validate config
if [ -z "$SERVER_HOST" ] || [ "$SERVER_HOST" = "192.168.1.100" ]; then
  echo "ERROR:Please configure SERVER_HOST in config.sh"
  exit 1
fi

if [ -z "$SERVER_USER" ] || [ "$SERVER_USER" = "your_username" ]; then
  echo "ERROR:Please configure SERVER_USER in config.sh"
  exit 1
fi

ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_HOST} "
# CPU - use mpstat if available, fallback to /proc/stat
if command -v mpstat &>/dev/null; then
  cpu_usage=\$(LC_NUMERIC=C mpstat 1 1 | awk '/^Average:/ {gsub(\",\", \".\"); printf \"%.0f\", 100 - \$NF}')
else
  cpu1=\$(head -1 /proc/stat)
  sleep 1
  cpu2=\$(head -1 /proc/stat)

  set -- \$cpu1; shift
  u1=\$1 n1=\$2 s1=\$3 i1=\$4 w1=\$5 x1=\$6 y1=\$7 z1=\$8

  set -- \$cpu2; shift
  u2=\$1 n2=\$2 s2=\$3 i2=\$4 w2=\$5 x2=\$6 y2=\$7 z2=\$8

  idle1=\$((i1 + w1))
  idle2=\$((i2 + w2))
  total1=\$((u1 + n1 + s1 + i1 + w1 + x1 + y1 + z1))
  total2=\$((u2 + n2 + s2 + i2 + w2 + x2 + y2 + z2))

  idle_d=\$((idle2 - idle1))
  total_d=\$((total2 - total1))

  if [ \$total_d -gt 0 ]; then
    cpu_usage=\$(( (total_d - idle_d) * 100 / total_d ))
  else
    cpu_usage=0
  fi
fi

# RAM - exclude buffers/cache/reclaimable like CasaOS
mem_info=\$(cat /proc/meminfo)
mem_total=\$(echo \"\$mem_info\" | awk '/^MemTotal:/ {print \$2}')
mem_free=\$(echo \"\$mem_info\" | awk '/^MemFree:/ {print \$2}')
mem_buffers=\$(echo \"\$mem_info\" | awk '/^Buffers:/ {print \$2}')
mem_cached=\$(echo \"\$mem_info\" | awk '/^Cached:/ {print \$2}')
mem_sreclaimable=\$(echo \"\$mem_info\" | awk '/^SReclaimable:/ {print \$2}')
mem_used=\$((mem_total - mem_free - mem_buffers - mem_cached - mem_sreclaimable))
ram_percent=\$((mem_used * 100 / mem_total))
ram_used_gb=\$(awk -v m=\"\$mem_used\" 'BEGIN {printf \"%.2f\", m / 1048576}')
ram_total_gb=\$(awk -v m=\"\$mem_total\" 'BEGIN {printf \"%.2f\", m / 1048576}')

# Temperature
temp=\$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null || echo 0)
temp_c=\$((temp / 1000))

# Power
power=\$(cat /sys/class/power_supply/*/power_now 2>/dev/null | head -1)
if [ -n \"\$power\" ] && [ \"\$power\" -gt 0 ] 2>/dev/null; then
  power_w=\$(awk -v p=\"\$power\" 'BEGIN {printf \"%.1f\", p / 1000000}')
else
  power_w=\"--\"
fi

# Disks
disk_root=\$(df / | tail -1 | awk '{print \$3*1024,\$2*1024,\$5}' | tr -d '%')
disk_data=\"0 0 0\"
if [ -n \"$EXTERNAL_DISK\" ] && [ -d \"$EXTERNAL_DISK\" ]; then
  disk_data=\$(df \"$EXTERNAL_DISK\" 2>/dev/null | tail -1 | awk '{print \$3*1024,\$2*1024,\$5}' | tr -d '%' || echo \"0 0 0\")
fi

# HDD temperature via smartctl
hdd_temp=\"--\"
if [ -n \"$SUDO_PASS\" ]; then
  hdd_temp=\$(echo \"$SUDO_PASS\" | sudo -S smartctl -A /dev/sda 2>/dev/null | awk '/Temperature_Celsius/ {print \$10}' || echo \"--\")
fi

echo \"CPU:\$cpu_usage\"
echo \"RAM:\$ram_percent\"
echo \"RAM_USED:\$ram_used_gb\"
echo \"RAM_TOTAL:\$ram_total_gb\"
echo \"TEMP:\$temp_c\"
echo \"POWER:\$power_w\"
echo \"DISK_ROOT:\$disk_root\"
echo \"DISK_DATA:\$disk_data\"
echo \"HDD_TEMP:\$hdd_temp\"

# Docker stats
if [ -n \"$SUDO_PASS\" ]; then
  echo \"$SUDO_PASS\" | sudo -S docker stats --no-stream --format 'CONTAINER:{{.Name}}:{{.CPUPerc}}:{{.MemUsage}}' 2>/dev/null
else
  docker stats --no-stream --format 'CONTAINER:{{.Name}}:{{.CPUPerc}}:{{.MemUsage}}' 2>/dev/null
fi
" 2>/dev/null
