#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

# convex
rsync -avh ../adaptive-convex-auth/convex/auth.ts ./convex/auth.ts --delete-after

## src/auth
rsync -avh ../adaptive-convex-auth/src/auth/ ./src/auth/ --delete-after

# utils
rsync -avh ../adaptive-convex-auth/src/utils/convex/ ./src/utils/convex/ --delete-after
rsync -avh ../adaptive-convex-auth/src/utils/ui/ ./src/utils/ui/ --delete-after
