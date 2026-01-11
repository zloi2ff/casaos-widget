#!/bin/bash
# Docker container action script
# Usage: ./docker-action.sh <action> <container_name>

ACTION="$1"
CONTAINER="$2"

if [ -z "$ACTION" ] || [ -z "$CONTAINER" ]; then
  echo "ERROR:Missing parameters"
  exit 1
fi

ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -o BatchMode=yes zloi2ff@192.168.31.73 "
  echo 'saberuu3aa' | sudo -S docker $ACTION $CONTAINER 2>&1
" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "OK:$ACTION:$CONTAINER"
else
  echo "ERROR:$ACTION:$CONTAINER"
fi
