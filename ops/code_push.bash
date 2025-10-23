#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

rsync -avh ./convex/auth.ts ../adaptive-convex-auth/convex/auth.ts --delete-after
rsync -avh ./src/auth ../adaptive-convex-auth/src/auth --delete-after
