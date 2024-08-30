#!/bin/bash

# Check if a port number is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <port_number>"
  exit 1
fi

PORT=$1

# Find the process running on the specified port
PID=$(lsof -t -i:$PORT)

# Check if a process is found
if [ -z "$PID" ]; then
  echo "No process found running on port $PORT"
  exit 1
fi

# Kill the process
kill -9 $PID

# Confirm the process is killed
if [ $? -eq 0 ]; then
  echo "Process running on port $PORT (PID: $PID) has been killed."
else
  echo "Failed to kill the process running on port $PORT."
fi
