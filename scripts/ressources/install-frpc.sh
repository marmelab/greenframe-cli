#!/bin/bash

set -e

echoerr() { echo -e "\n$@\n" 1>&2; }

if [ -z ${HOME+x} ]; then
  echoerr "\$HOME is unset, you need to have this variable to use this installer.";
  exit 1
fi

if [ "$(uname)" == "Darwin" ]; then
  OS=darwin
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  OS=linux
else
  echoerr "This installer is only supported on Linux and MacOS"
  exit 1
fi

ARCH=""
case $(uname -m) in
  i386)   ARCH="386" ;;
  i686)   ARCH="386" ;;
  x86_64) ARCH="amd64" ;;
  arm)    dpkg --print-ARCH | grep -q "arm64" && ARCH="arm64" || ARCH="arm" ;;
esac


mkdir -p $HOME/.local/bin
mkdir -p $HOME/.local/lib
cd $HOME/.local/lib
rm -rf $HOME/.local/lib/frpc

FRP_VERSION="0.36.2"

FRP_FILENAME="frp_${FRP_VERSION}_${OS}_${ARCH}"

URL=https://github.com/fatedier/frp/releases/download/v$FRP_VERSION/$FRP_FILENAME.tar.gz

echo "Installing FRPC from $URL"

wget -q -O "./frp.tar.gz" "$URL" &>/dev/null

tar -xzf "./frp.tar.gz"
rm "./frp.tar.gz"
mv "./$FRP_FILENAME" "./frpc"
#   delete old frpc bin if exists
rm -f $HOME/.local/bin/frpc
ln -s $HOME/.local/lib/frpc/frpc $HOME/.local/bin/frpc

if [[ ! ":$PATH:" == *":$HOME/.local/bin:"* ]]; then
  echoerr "FRPC has been installed but your path is missing $HOME/.local/bin, you need to add this to use FRPC."
else
  # test the CLI
  LOCATION=$(command -v frpc)
  echo "frpc installed to $LOCATION"
  frpc -v
fi
