#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status
set -x # Print all executed commands to the terminal

# app
mkdir -p ./src/app/env ./src/app/url ./src/app/text
rsync -avh ../adaptive-convex-auth/src/app/env/ ./src/app/env/ --delete-after
rsync -avh ../adaptive-convex-auth/src/app/url/ ./src/app/url/ --delete-after
rsync -avh ../adaptive-convex-auth/src/app/text/ ./src/app/text/ --delete-after
rsync -avh ../adaptive-convex-auth/src/auth/ ./src/auth/ --delete-after

# convex
rsync -avh ../adaptive-convex-auth/convex/auth.ts ./convex/auth.ts --delete-after
rsync -avh ../adaptive-convex-auth/convex/http.ts ./convex/http.ts --delete-after
