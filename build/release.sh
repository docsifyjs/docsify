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

  # Removing test script as non - availibity of tests. Will Add it once tests are completed

  # npm run test

  # build
  VERSION=$VERSION npm run build

  # update packages
  cd packages/docsify-server-renderer
  npm version $VERSION
  if [[ -z $RELEASE_TAG ]]; then
    npm publish --access public
  else
    npm publish --tag $RELEASE_TAG --access public
  fi
  cd -

  # commit
  git add -A
  git commit -m "[build] $VERSION $RELEASE_TAG"
  npm --no-git-tag-version version $VERSION --message "[release] $VERSION $RELEASE_TAG"

  # changelog
  node_modules/.bin/conventional-changelog -p angular -i CHANGELOG.md -s

  git add .
  git commit -m "chore: add changelog $VERSION"

  # publish
  git tag v$VERSION
  git push origin refs/tags/v$VERSION
  git push
  if [[ -z $RELEASE_TAG ]]; then
    npm publish --access public
  else
    npm publish --tag $RELEASE_TAG --access public
  fi
fi
