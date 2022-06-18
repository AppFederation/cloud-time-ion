#!/bin/bash

nRuns=5

runSingleRepetition() {
  echo "======================= RUN $i of $nRuns - `date`"
  echo Args For TestCafe: "$@"
  time npm run tcafe:repeated -- "$@"
}

runAll() {
  echo git status:
  git status
  git log -n 1

  echo "Starting tests"
  cd testcafe && \
    for i in $(seq 1 ${nRuns}); do \
      runSingleRepetition "$@" ; \
    done
}

time runAll "$@"

echo ===================== Tests Finished `date`
