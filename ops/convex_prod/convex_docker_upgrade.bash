#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TODAY=$(date +%Y-%m-%d)

echo "Exporting Convex data from prod..."
if [[ -n "$1" ]]; then
	EXPORT_PATH=$("$scriptDir/convex_export_zip_from_prod.bash" "" "$1")
else
	EXPORT_PATH=$("$scriptDir/convex_export_zip_from_prod.bash")
fi

echo "Updating volume name to convex-data-$TODAY..."
sed -i "s/convex-data-v[0-9]*/convex-data-$TODAY/g" "$scriptDir/convex_compose_prod.yml"

echo "Pushing updated compose file..."
$scriptDir/convex_docker_update.bash

echo "Restarting Convex services..."
ssh convex@leg.tj "docker compose -f /home/convex/convex.yml down"
ssh convex@leg.tj "docker compose -f /home/convex/convex.yml up -d"

echo "Importing Convex data..."
$scriptDir/convex_import_zip_to_prod.bash $EXPORT_PATH

echo "Setting Env variables..."
$scriptDir/convex_env_update.bash

echo "Deploying functions..."
$scriptDir/convex_deploy_prod.bash

echo "Checking health..."
curl https://api.leg.tj/api/isOnline
