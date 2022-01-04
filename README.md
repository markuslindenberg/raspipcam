# Raspberry Pi WebRTC IP Camera

This is an experimental [buildroot](https://buildroot.org/) external tree to produce a webcam firmware for Raspberry Pi Zero 2 W.
The firmware is designed for maximal reliability and has no admin GUI, configuration is done by SSH access or by editing files on the sd card.

The resulting SD card image only contains one FAT partition with the root image included in the kernel, running as initramfs.
The FAT partition is mounted read only to `/boot` so there are no SD card writes during operation.

## Features

The firmware currently provides a low latency WebRTC live stream to web browsers by accessing https://raspipcam.local/.

The video stream is captured and encoded using video4linux by [gstreamer](https://gstreamer.freedesktop.org/), which forwards a h264 RTP stream to [Janus](https://janus.conf.meetecho.com/).

Video settings are optimized for a Raspberry Pi Camera v2, for different versions and capture/resolution settings, the gstreamer pipeline has to be modified.

To persist a modified gstreamer pipeline, create an environment file `gstreamer.txt` on the SD card and put the pipeline in the `GSTREAMER_PIPELINE` variable:

```
GSTREAMER_PIPELINE=v4l2src \
	extra-controls="controls,video_bitrate_mode=1,video_bitrate=4000000,h264_i_frame_period=60,repeat_sequence_header=1" \
	! video/x-h264,format=I420,width=1640,height=922,framerate=30/1 \
	! rtph264pay ! udpsink host=127.0.0.1 port=5004
```

This can also be used to configure streaming to external (rtmp/rtp) servers instead or additionally to the WebRTC browser output.

## Building

```
git clone https://github.com/buildroot/buildroot.git
git clone https://github.com/markuslindenberg/raspipcam.git
make O=$PWD/build BR2_EXTERNAL=$PWD/raspipcam -C $PWD/buildroot raspipcam_raspberrypizero2w_defconfig
cd build
make
```

## Installing

Create SD card from image in `output/images/sdcard.img`.

## Updating

* `mount -o remount,rw /boot`
* Use `output/images/zImage` to replace the `kernel7.img` file on the SD card (mounted as `/boot/`) and reboot.

## SSH access

Keys only. Put an `authorized_keys` file for root on the SD card FAT partition (`/boot/authorized_keys`), reboot.

## Network

The image supports (USB) ethernet adapters and Wifi.
It uses RA and DHCP for autoconfiguation and announces as mDNS host raspipcam.local. 
Additionally to IPv6, legacy IP is also supported.

### Enabling Wifi

* edit `/boot/config.txt` and remove the line `dtoverlay=disable-wifi`, reboot
* Use iwctl (interactively) to scan&connect, then copy the `/var/lib/iwd` folder to `/boot/` (FAT partition) to persist.

```
iwctl station wlan0 scan
iwctl station wlan0 get-networks
iwctl connect "some network"
```

## FAQ

> Can I build this for other Raspberry Pi boards?

Currently this only includes a working build configuration for a Zero 2 W but other boards can easily be added.

> Can it support other streaming formats?

Most possibly yes, by including more gstreamer plugins into the build and adaping the gstreamer pipeline.
