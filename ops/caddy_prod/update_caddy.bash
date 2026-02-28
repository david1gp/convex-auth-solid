#!/usr/bin/env bash

set -x # Print all executed commands to the terminal set -e # Exit immediately if a command exits with a non-zero status

remoteUrl=root@leg.tj
scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"

# copy
caddyFile=$scriptDir/Caddyfile
rsync -avh $caddyFile $remoteUrl:/etc/caddy/Caddyfile
# validate
caddy validate --config /etc/caddy/Caddyfile
# restart
ssh $remoteUrl systemctl restart caddy
# status
ssh $remoteUrl systemctl status caddy
# logs
ssh $remoteUrl 'journalctl -f --unit=caddy --since "1 minute ago"'
