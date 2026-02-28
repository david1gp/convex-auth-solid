#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

sed \
  -e "s/#SystemMaxUse=/SystemMaxUse=50M/" \
  -e "s/#SystemMaxFileSize=/SystemMaxFileSize=50M/" \
  -e "s/#RuntimeMaxUse=/RuntimeMaxUse=50M/" \
  -i /etc/systemd/journald.conf

cat /etc/systemd/journald.conf
