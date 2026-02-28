#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

remoteUrl=convex@leg.tj

ssh $remoteUrl "docker exec convex-backend ./generate_admin_key.sh"
