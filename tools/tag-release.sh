#!/bin/bash

# Pulled and modified from this link:
# https://gist.github.com/devster/b91b97ebbca4db4d02b84337b2a3d933

# Script to simplify the release flow.
# 1) Fetch the current release version
# 2) Increase the version (major, minor, patch)
# 3) Add a new git tag
# 4) Push the tag

# Parse command line options.
while getopts ":Mmpd" Option
do
  case $Option in
    M ) major=true;;
    m ) minor=true;;
    p ) patch=true;;
    d ) dry=true;;
  esac
done

shift $(($OPTIND - 1))

# Display usage
if [ -z $major ] && [ -z $minor ] && [ -z $patch ];
then
  echo "usage: $(basename $0) [Mmp] [message]"
  echo ""
  echo "  -d Dry run"
  echo "  -M for a major release"
  echo "  -m for a minor release"
  echo "  -p for a patch release"
  echo ""
  echo " Example: release -p \"Some fix\""
  echo " means create a patch release with the message \"Some fix\""
  exit 1
fi

# 1) Fetch the current release version

echo "Fetch tags"
git fetch --prune --tags

version=$(git describe --abbrev=0 --tags)
version=${version:1} # Remove the v in the tag v0.37.10 for example

echo "Current version: $version"

# 2) Increase version number

# Build array from version string.

a=( ${version//./ } )

# Increment version numbers as requested.

if [ ! -z $major ]
then
  ((a[0]++))
  a[1]=0
  a[2]=0
fi

if [ ! -z $minor ]
then
  ((a[1]++))
  a[2]=0
fi

if [ ! -z $patch ]
then
  ((a[2]++))
fi

next_version="${a[0]}.${a[1]}.${a[2]}"

msg="$1"

branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

# If its a dry run, just display the new release version number
if [ ! -z $dry ]
then
  echo "Tag message: $msg"
  echo "Next version: v$next_version"
else
  # If a command fails, exit the script
  set -e

  # Push master
  git push origin $branch

  # If it's not a dry run, let's go!
  # 3) Add git tag
  echo "Add git tag v$next_version with message: $msg"
  git tag -s -a "v$next_version" -m "$msg"

  # 4) Push the new tag

  echo "Push the tag"
  git push --tags origin $branch

  echo -e "\e[32mRelease done: $next_version\e[0m"
fi
