#!/bin/bash

shopt -s extglob

dst=/S/Backups/test-repo-backup

cp -r ./!(node_modules) $dst

echo dot star

# cp -r ./.* $dst
