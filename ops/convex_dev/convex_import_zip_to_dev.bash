#!/usr/bin/env bash

set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status


if [[ $# -ne 1 ]]; then
  echo -e "Usage: $0 zip-file-to-import"
  exit 1
fi

if [[ ! -f "$1" ]]; then
  echo -e "Error: File '$1' does not exist"
  exit 1
fi

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
envFile=$scriptDir/.env.dev.convex

if [[ ! -f "$envFile" ]]; then
  echo -e "Error: File $envFile does not exist"
  exit 1
fi

bun run convex import \
  --env-file=$envFile --replace-all \
  $1
