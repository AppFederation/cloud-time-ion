#!/bin/bash

shopt -s extglob

set -x

src="$(pwd)"
dstParent=/A/Backups/RepoAutoBackup
dst="$dstParent/$src"

branchName="AutoBackup"

mkdir -p "$dst"

# cp -r ./!(node_modules|electron) $dst

#echo dot star

# cp -r ./.* $dst

# https://stackoverflow.com/a/14789400/170451
# https://gist.github.com/macmladen/75817cc47f4ddf0a18f0
# https://linux.die.net/man/1/rsync

# trailing / in "$src"/ needed to not create sub-dir of same name

# --progress -v
time rsync -a "$src"/ "$dst"  \
    --exclude '**/node_modules'  \
    --exclude platforms \
    --exclude .git \

    # for first copy, do not `--exclude .git`; but maybe always syncing .git could give me a kind of automatic rebase on develop; then maybe push -f  (but need to think how to preserve the incremental commits)

#    --exclude node_modules  \
#    --exclude electron/node_modules  \


cd "$dst"

echo "======== GIT ====== "

git add ".*" "*"

git pull origin "$branchName"

# Could also have a branch version *rebased* on develop

git commit -m "$branchName `date`"

git push origin HEAD:AutoBackup

git status
