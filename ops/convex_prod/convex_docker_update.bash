#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
remoteUrl=convex@leg.tj

rsync -avh $scriptDir/convex_compose_prod.yml $remoteUrl:/home/convex/convex.yml
rsync -avh $scriptDir/.env.prod.docker $remoteUrl:/home/convex/.env.prod
