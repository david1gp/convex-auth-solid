#!/usr/bin/env bash
# Import a Convex snapshot zip into a deployment (REPLACES all data).
#
# Usage: bash ops/convex/import_zip.bash <development> <zip-file>
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

if [[ $# -ne 2 ]]; then
  echo -e "Usage: $0 <development> zip-file-to-import"
  exit 1
fi

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

envName="$1"
envFile=$scriptDir/../../.env.$envName

if [[ ! -f "$envFile" ]]; then
  echo -e "Error: File $envFile does not exist"
  exit 1
fi

if [[ ! -f "$2" ]]; then
  echo -e "Error: File '$2' does not exist"
  exit 1
fi

bun run convex import \
  --env-file=$envFile --replace-all \
  $2
