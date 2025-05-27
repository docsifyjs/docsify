set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION $RELEASE_TAG - are you sure? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Releasing $VERSION ..."

  # Update version (don't commit or tag yet)
  npm --no-git-tag-version version "$VERSION" --message "[release] $VERSION $RELEASE_TAG"

  # Build and test
  npm run build
  npm run test:update:snapshot
  npm run test

  # Changelog
  npx conventional-changelog -p angular -i CHANGELOG.md -s

  # Commit all changes
  git add -A
  git commit -m "[release] $VERSION $RELEASE_TAG"

  # Tag and push
  git tag "v$VERSION"
  git push origin "v$VERSION"
  git push

  # Publish to npm
  if [[ -z $RELEASE_TAG ]]; then
    npm publish
  else
    npm publish --tag "$RELEASE_TAG"
  fi
fi
