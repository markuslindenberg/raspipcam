# Raspberry Pi Zero W Webcam Firmware

## Building

```
git clone -b 2019.08.01 git://git.buildroot.net/buildroot 

cd buildroot
make BR2_EXTERNAL=../campi campi_raspberrypi0w_defconfig
make
```

## Installing

Create SD card from image in `output/images/sdcard.img`.

## Updating

Use `output/images/Image` to replace the `Image` file on the SD card (mounted as `/boot/`) and reboot.

## Access

### Console

Password for root is `campi`.

### SSH

Keys only. Put an `authorized_keys` file for root on the SD card, reboot.

## Wifi

```
iwctl station wlan0 scan
iwctl station wlan0 get-networks
iwctl connect "some network"
```

Reboot or use `systemctl restart iwd-restore.service` to save all known wifi networks on the SD card.

