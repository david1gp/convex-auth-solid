#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

docker pull ghcr.io/get-convex/convex-backend:latest ghcr.io/get-convex/convex-dashboard:latest
