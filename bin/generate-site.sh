#!/bin/bash -x

set -o nounset
set -o errexit
set -o pipefail

# Configuration

CODELABS_DOMAIN="codelabs.awala.network"

FATHOM_SCRIPT_URL='https://aardwolf.relaycorp.tech/script.js'
FATHOM_SITE='TBSIELNB'

# Main

ROOT="$(pwd)"

cd site

node_modules/.bin/gulp dist \
  "--base-url=https://${CODELABS_DOMAIN}" \
  --delete-missing \
  "--fathom-script-url=${FATHOM_SCRIPT_URL}" \
  "--fathom-site=${FATHOM_SITE}"

echo "${CODELABS_DOMAIN}" > dist/CNAME

# FFS. Seriously, Google?
rm dist/codelabs  # It's a symlink 🤦
mv codelabs dist/codelabs
find dist -name '*.html' -exec sed -n -i '/google-analytics.com/!p' {} \;

# Tell GitHub Pages that this isn't a Jekyll site
touch dist/.nojekyll

# Generate downloadable archives for all examples
DIST_EXAMPLES_ROOT="$(pwd)/dist/examples"
mkdir "${DIST_EXAMPLES_ROOT}"
cd "${ROOT}/examples"
find . -maxdepth 1 -mindepth 1 -type d -exec zip -r "${DIST_EXAMPLES_ROOT}/{}.zip" {} \;
