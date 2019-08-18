#!/bin/bash
mod=
if [ "$1" == "manual" ] || [ "$1" == "auto" ] || [ "$1" == "none" ]; then
  mod=$1
else
  echo $(gsettings get org.gnome.system.proxy mode)
  exit 0
fi

gsettings set org.gnome.system.proxy mode $mod
