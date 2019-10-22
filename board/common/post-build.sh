#!/bin/sh

set -u
set -e

rm -f ${TARGET_DIR}/etc/pam.d/*
cp -f ${TARGET_DIR}/usr/share/factory/etc/pam.d/* ${TARGET_DIR}/etc/pam.d/

