#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

bash $scriptDir/convex_docker_pull.bash
bash $scriptDir/convex_docker_down.bash
bash $scriptDir/convex_docker_up.bash
