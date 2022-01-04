#!/bin/sh

set -u
set -e

mkdir -p ${TARGET_DIR}/boot

cat << EOF > ${TARGET_DIR}/etc/os-release
NAME=raspipcam
ID=raspipcam
ID_LIKE=buildroot
PRETTY_NAME="raspipcam (Buildroot ${BR2_VERSION})"
EOF

if [ -n "${GITHUB_SHA:-}" ]; then
    echo "VERSION_ID=${GITHUB_SHA}" >> ${TARGET_DIR}/etc/os-release 
fi

