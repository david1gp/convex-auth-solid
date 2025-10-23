#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

rsync -avh ../adaptive-convex-auth/convex/auth.ts ./convex/auth.ts --delete-after
rsync -avh ../adaptive-convex-auth/src/auth ./src/auth --delete-after
