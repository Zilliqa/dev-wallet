#!/bin/bash

echo $(pwd)

docker --version
aws --version

echo $TRAVIS_COMMIT
commit=$(git rev-parse --short=7 $TRAVIS_COMMIT)

docker build -t "tempimagebuild:$commit" .
