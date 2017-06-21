#!/bin/bash

git clone "https://${GH_TOKEN}@${GH_REF}" $TRAVIS_BUILD_DIR/pages_repo
rm -rf $TRAVIS_BUILD_DIR/pages_repo/*
git --git-dir=./pages_repo/.git --work-tree=./pages_repo checkout ${GH_PAGES_BRANCH}
cp -r $TRAVIS_BUILD_DIR/dist/* $TRAVIS_BUILD_DIR/pages_repo/
if [[ -n "$GH_PAGES_CNAME" ]]; then
  echo $GH_PAGES_CNAME> $TRAVIS_BUILD_DIR/pages_repo/CNAME
fi
if [[ `git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo status --porcelain` ]]; then
  git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo config user.name "${GIT_NAME}"
  git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo config user.email "${GIT_EMAIL}"
  git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo add . -A
  git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo commit -m "Travis CI publish ${TRAVIS_JOB_NUMBER} of https://github.com/${TRAVIS_REPO_SLUG}/commit/${TRAVIS_COMMIT}"
  git --git-dir=$TRAVIS_BUILD_DIR/pages_repo/.git --work-tree=$TRAVIS_BUILD_DIR/pages_repo push --quiet "https://${GH_TOKEN}@${GH_REF}" master:${GH_PAGES_BRANCH} > /dev/null 2>&1
fi