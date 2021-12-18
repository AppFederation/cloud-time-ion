#!/bin/bash

doAll () {
  echo Starting build and deploy `date`
  set -x

  scriptDir="`dirname $0`"
  # $scriptDir/compileFirebaseRules.sh

  # TODO: add protractor.sh &&, once tests are reliable

  # To initialize, run: firebase use --add

  #   && cp -r assets dist \

  #git tag test_`date --utc +%Y-%m-%d_%H.%M.%SZ`

  #ng build \
  ionic build --prod --aot \
    && npx firebase deploy --only hosting \
    && git tag deploy_`date -u +%Y-%m-%d__%H.%M.%SZ` \
    && git push origin develop --tags

  Echo Finished `date`
}

time doAll
