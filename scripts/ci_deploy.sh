#!/bin/bash

echo $(pwd)

docker --version
aws --version

echo $TRAVIS_COMMIT
commit=$(git rev-parse --short=7 $TRAVIS_COMMIT)

accountID=$(aws sts get-caller-identity --output text --query 'Account')
regionID=us-west-2
application=nucleus-wallet
registryURL="zilliqa/$application"

#eval "$(aws ecr get-login --no-include-email --region $regionID)"
echo "$DOCKER_API_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker cp extractbuild:/usr/share/nginx/html/. $(pwd)/"$application"-artifact/build/
docker rm extractbuild
docker push "$registryURL"

rm -rf "$application"-artifact
mkdir -p "$application"-artifact/build/

cd "$application"-artifact
cd build
echo $commit > "$application"-artifact-commit.txt
zip -r "$application"-artifact.zip .
aws s3 sync . s3://"$application"-static-artifact --exclude='*' --include=''"$application"'-artifact.zip'

cd ..
echo $(date) > date_created.txt
aws s3 sync . s3://"$application"-static-artifact --exclude='*' --include='date_created.txt'
