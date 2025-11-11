#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

authDir="../adaptive-convex-auth"

# convex
rsync -avh ./convex/auth.ts $authDir/convex/auth.ts --delete-after

## src/auth
rsync -avh ./src/auth/ $authDir/src/auth/ --delete-after

# convex/org
rsync -avh ./convex/org.ts $authDir/convex/org.ts

# utils
rsync -avh ./src/utils/convex/ $authDir/src/utils/convex/ --delete-after
rsync -avh ./src/utils/ui/ $authDir/src/utils/ui/ --delete-after
