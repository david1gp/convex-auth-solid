#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

useradd -m git
# -m - create home dir
# -s - shell

mkdir -p /home/git/.ssh
cp /root/.ssh/authorized_keys /home/git/.ssh/authorized_keys

chmod 600 /home/git/.ssh/*
chmod 755 /home/git/.ssh

chown git:git -R /home/git
chmod u+w -R /home/git

sudo -H -u git bash -c 'cd && git config --global init.defaultBranch main'
