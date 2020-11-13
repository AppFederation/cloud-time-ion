#!/bin/bash

shopt -s extglob

dst=/S/Backups/test-repo-backup

# cp -r ./!(node_modules|electron) $dst

echo dot star

# cp -r ./.* $dst

# https://stackoverflow.com/a/14789400/170451
# https://gist.github.com/macmladen/75817cc47f4ddf0a18f0
# https://linux.die.net/man/1/rsync

rsync -av --progress . $dst  \
    --exclude '**/node_modules'  \
    --exclude platforms

#    --exclude node_modules  \
#    --exclude electron/node_modules  \

