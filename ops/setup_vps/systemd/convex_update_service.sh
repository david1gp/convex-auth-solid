#!/usr/bin/env bash

set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

remoteUrl=convex@leg.tj

#
# create systemd unit file directory
#
ssh $remoteUrl mkdir -p /home/convex/.config/systemd/user

#
# copy systemd service file
#
scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null 2>&1 && pwd)"

serviceFile=$scriptDir/convex.service
if [[ ! -f $serviceFile ]]; then
  echo "systemd service file not found: $serviceFile"
  exit 1
fi

rsync \
  $serviceFile \
  $remoteUrl:/home/convex/.config/systemd/user/convex.service \
  --delete -a --verbose

#
# restart systemd service
#
ssh $remoteUrl systemctl --user daemon-reload
ssh $remoteUrl systemctl --user enable convex --now
ssh $remoteUrl systemctl --user restart convex

#
# monitor deployment
#
ssh $remoteUrl systemctl --user status convex
ssh $remoteUrl journalctl -f
