#!/usr/bin/env bash

set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

envFileValues=$scriptDir/../../.env.production
envFileTarget=$scriptDir/.env.prod.convex

if [ ! -f "$envFileValues" ]; then
  echo "Error: File $envFileValues not found"
  exit 1
fi

if [ ! -f "$envFileTarget" ]; then
  echo "Error: File $envFileTarget not found"
  exit 2
fi

# Skip comments and empty lines, handle values with spaces/quotes reasonably
grep -v '^#' "$envFileValues" | grep -v '^$' | while IFS='=' read -r key value; do
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  if [ -n "$key" ] && [ -n "$value" ]; then
    bun convex env set "$key" "$value" --env-file=$envFileTarget
  fi
done
