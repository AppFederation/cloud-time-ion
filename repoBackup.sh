#!/bin/bash

shopt -s extglob

dst=/S/Backups/test-repo-backup

# cp -r ./!(node_modules|electron) $dst

echo dot star

# cp -r ./.* $dst

rsync -av --progress . $dst  \
    --exclude '**/node_modules'  \
    --exclude platforms

#    --exclude node_modules  \
#    --exclude electron/node_modules  \

