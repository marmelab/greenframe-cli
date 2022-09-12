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

ARCH="$(uname -m)"
if [ "$ARCH" == "x86_64" ]; then
  ARCH=x64
fi

mkdir -p $HOME/.local/bin
mkdir -p $HOME/.local/lib
cd $HOME/.local/lib
rm -rf greenframe
rm -rf ~/.local/share/greenframe/client

URL=https://assets.greenframe.io/channels/stable/greenframe-$OS-$ARCH.tar.gz
TAR_ARGS="xz"

echo "Installing CLI from $URL"
if [ $(command -v curl) ]; then
  curl "$URL" | tar "$TAR_ARGS"
else
  wget -O- "$URL" | tar "$TAR_ARGS"
fi
# delete old greenframe bin if exists
rm -f $(command -v greenframe) || true
rm -f $HOME/.local/bin/greenframe
ln -s $HOME/.local/lib/greenframe/bin/greenframe $HOME/.local/bin/greenframe

# on alpine (and maybe others) the basic node binary does not work
# remove our node binary and fall back to whatever node is on the PATH
$HOME/.local/lib/greenframe/bin/node -v || rm $HOME/.local/lib/greenframe/bin/node

if [[ ! ":$PATH:" == *":$HOME/.local/bin:"* ]]; then
  echoerr "GreenFrame has been installed but your path is missing $HOME/.local/bin, you need to add this to use GreenFrame CLI."
else
  # test the CLI
  LOCATION=$(command -v greenframe)
  echo "GreenFrame installed to $LOCATION"
  greenframe -v
fi

