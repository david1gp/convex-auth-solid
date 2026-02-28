#!/usr/bin/env bash
set -x # Print all executed commands to the terminal
set -e # Exit immediately if a command exits with a non-zero status

useradd -m convex -s /bin/bash
# -m - create home dir
# -s - shell

#
# setup ssh access
#

mkdir -p /home/convex/.ssh
cp /root/.ssh/authorized_keys /home/convex/.ssh/authorized_keys

chmod 600 /home/convex/.ssh/*
chmod 755 /home/convex/.ssh

chown convex:convex -R /home/convex
chmod u+w -R /home/convex

#
# enable docker
#
usermod -aG docker convex

systemctl start docker.service
systemctl enable docker.service
