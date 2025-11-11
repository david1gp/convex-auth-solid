#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

authDir="../adaptive-convex-auth"

# convex
rsync -avh $authDir/convex/auth.ts ./convex/auth.ts --delete-after

## src/auth
rsync -avh $authDir/src/auth/ ./src/auth/ --delete-after

# utils
rsync -avh $authDir/src/utils/convex/ ./src/utils/convex/ --delete-after
rsync -avh $authDir/src/utils/ui/ ./src/utils/ui/ --delete-after
