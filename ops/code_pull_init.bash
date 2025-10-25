#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

# convex
rsync -avh ../adaptive-convex-auth/convex/auth.ts ./convex/auth.ts --delete-after
rsync -avh ../adaptive-convex-auth/convex/http.ts ./convex/http.ts --delete-after

# app
mkdir -p ./src/app/env ./src/app/url ./src/app/text
rsync -avh ../adaptive-convex-auth/src/app/env/ ./src/app/env/ --delete-after
rsync -avh ../adaptive-convex-auth/src/app/url/ ./src/app/url/ --delete-after
rsync -avh ../adaptive-convex-auth/src/app/text/ ./src/app/text/ --delete-after

# org
rsync -avh ../adaptive-convex-auth/src/org/ ./src/org/ --delete-after

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
bash $scriptDir/code_pull_update.bash
bun run convex codegen
