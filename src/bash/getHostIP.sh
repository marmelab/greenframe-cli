# Script to get host ip address in order to be able to map localhost to our docker container
# Our playwright container should be able to query localhost network by using this IP.

if command -v ip 1> /dev/null;
then
    if ip -4 addr show docker0 > /dev/null 2>&1 # Docker0 is network for docker under linux and OSX
    then
        printf $(ip -4 addr show docker0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
    else
        printf $(ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}') # eth0 is network for docker under wsl
    fi
else
    printf $(ifconfig | grep 'inet ' | grep -v 127.0.0.1  | awk '{ print $2 }' | head -1 | sed -n 's/[^0-9]*\([0-9\.]*\)/\1/p')
fi
