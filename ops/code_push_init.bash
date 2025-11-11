#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

authDir="../adaptive-convex-auth"

# convex
rsync -avh ./convex/auth.ts $authDir/convex/auth.ts --delete-after
rsync -avh ./convex/http.ts $authDir/convex/http.ts --delete-after

# app
rsync -avh ./src/app/env/ $authDir/src/app/env/ --delete-after
rsync -avh ./src/app/url/ $authDir/src/app/url/ --delete-after
rsync -avh ./src/app/text/ $authDir/src/app/text/ --delete-after

# org
rsync -avh ./src/org/ $authDir/src/org/ --delete-after

# update
scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
bash $scriptDir/code_push_update.bash

# validate
bun run convex codegen
