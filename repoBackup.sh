#!/bin/bash

shopt -s extglob

set -x

src="$(pwd)"
dstParent=/A/Backups/RepoAutoBackup
dst="$dstParent/$src"

branchName="AutoBackup"

mkdir -p "$dst"

# cp -r ./!(node_modules|electron) $dst

echo dot star

# cp -r ./.* $dst

# https://stackoverflow.com/a/14789400/170451
# https://gist.github.com/macmladen/75817cc47f4ddf0a18f0
# https://linux.die.net/man/1/rsync

# trailing / in "$src"/ needed to not create sub-dir of same name

time rsync -av --progress "$src"/ "$dst"  \
    --exclude '**/node_modules'  \
    --exclude platforms \
    --exclude .git \

cd "$dst"

git add ".*" "*"

git pull origin "$branchName"

git commit -m "$branchName `date`"

git push origin HEAD:AutoBackup

#    --exclude node_modules  \
#    --exclude electron/node_modules  \

