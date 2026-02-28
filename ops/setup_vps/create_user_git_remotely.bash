#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

ssh root@leg.tj "bash -s" < ops/create_user_git.bash
