#!/usr/bin/env bash

set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

envFile=$scriptDir/.env.prod.convex

if [[ ! -f "$envFile" ]]; then
	echo -e "Error: File $envFile does not exist"
	exit 1
fi

bun run convex export \
	--env-file=$envFile \
	--path ${2:-./data/convex/$(date +%Y-%m-%d_%H-%M-%S).zip}
