#!/bin/bash 
# Get directory of calling script
DIR="$( cd "$( dirname "$0" )" &> /dev/null && pwd )"
# DIR="$(cd "$(dirname "$0")" && pwd -P)"
if [ "$(echo $DIR | grep '.nvm')" ]; then
    DIR="$(dirname "$(readlink -f "$0")")"
fi 
/usr/bin/env node --experimental-specifier-resolution=node $DIR/../dist/bin/commands.js $@
