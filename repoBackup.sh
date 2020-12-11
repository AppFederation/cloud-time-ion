#!/bin/bash

shopt -s extglob

# set -x

function backupRepo () {
  set +x
  src="$1"
  echo "============================================"
  echo "============================================ REPO ${src}"
  echo "============================================"
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

  git remote -v

#  git add ".*" "*"
  git add --all #".*" "*"

  # git pull origin "$branchName"

  # Could also have a branch version *rebased* on develop

  git commit -m "$branchName `date`"

  # https://askubuntu.com/questions/755535/how-do-i-highlight-a-word-or-a-phrase-in-a-commands-output

  git pull --no-edit origin AutoBackup # in case history diverged

  echo "================================ GIT PUSH: "
  set -x
  git push origin HEAD:AutoBackup
  echo "================================ END GIT PUSH"

  git status
}


backupAllRepos() {
  backupRepo "/A/R/O/OrYoL"

  backupRepo "/A/R/InnoTopic/InnoTopic_Website" # FIXME /A/R/InnoTopic/InnoTopic_Website : 2 SUBMODULES
  backupRepo "/A/R/InnoTopic/InnoTopic_Website/InnoTopicWebsite/src/app/TopicFriendsShared"
  backupRepo "/A/R/InnoTopic/InnoTopic_Website/svg-conversions"

  backupRepo "/A/R/FlexLife/LifeSense2"
#  backupRepo "$(pwd)"
  backupRepo "/A/R/FlexLife/cloud-time-ion"
}

time backupAllRepos
