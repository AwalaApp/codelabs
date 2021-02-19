#!/bin/bash -x

set -o nounset
set -o errexit
set -o pipefail

# Constants

CODELABS_DEST_DIR="site/codelabs"

CODELABS_DOMAIN="codelabs.relaynet.network"

# Main

rm -rf "${CODELABS_DEST_DIR}"
claat export \
  -o "${CODELABS_DEST_DIR}" \
  codelabs/*.md

cd site

node_modules/.bin/gulp dist \
  "--base-url=https://${CODELABS_DOMAIN}" \
  --codelabs-dir=codelabs \
  --delete-missing

echo "${CODELABS_DOMAIN}" > dist/CNAME

# FFS. Seriously, Google?
rm dist/codelabs  # It's a symlink 🤦
mv codelabs dist/codelabs
find dist -name '*.html' -exec sed -n -i '/google-analytics.com/!p' {} \;

# Tell GitHub Pages that this isn't a Jekyll site
touch dist/.nojekyll
