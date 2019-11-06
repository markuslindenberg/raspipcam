#!/bin/sh

set -u
set -e

if [ ! -d ${TARGET_DIR}/etc/dropbear ]; then
	rm -f ${TARGET_DIR}/etc/dropbear
	mkdir -p ${TARGET_DIR}/etc/dropbear
fi

rm -f ${TARGET_DIR}/etc/nginx/*.default
rm -f ${TARGET_DIR}/etc/nginx/fastcgi*
rm -f ${TARGET_DIR}/etc/nginx/scgi*
rm -f ${TARGET_DIR}/etc/nginx/uwsgi*

rm -f ${TARGET_DIR}/etc/avahi/services/ssh.service
rm -f ${TARGET_DIR}/etc/avahi/services/sftp-ssh.service
rm -f ${TARGET_DIR}/etc/avahi/avahi-dnsconfd.action
