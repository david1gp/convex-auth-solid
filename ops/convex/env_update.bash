#!/usr/bin/env bash
# Push the app env values of an environment into its Convex deployment env
# (`convex env set` for every var), so Convex functions see them.
#
# Usage: bash ops/convex/env_update.bash <development>
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

envName="${1:-development}"
envFile=$scriptDir/../../.env.$envName

if [ ! -f "$envFile" ]; then
  echo "Error: File $envFile not found"
  exit 2
fi

# Skip comments, empty lines and the CONVEX_SELF_HOSTED_* CLI credentials
# (they select the deployment; they must not become deployment env vars).
grep -v '^#' "$envFile" | grep -v '^$' | grep -v '^CONVEX_SELF_HOSTED' | while IFS='=' read -r key value; do
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  if [ -n "$key" ] && [ -n "$value" ]; then
    bun convex env set "$key" "$value" --env-file=$envFile
  fi
done
