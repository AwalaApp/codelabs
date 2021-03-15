#!/bin/bash -x

set -o nounset
set -o errexit
set -o pipefail

# Constants

CODELABS_DOMAIN="codelabs.awala.network"
FATHOM_SCRIPT_URL='https://aardwolf.relaycorp.tech/script.js'
FATHOM_SITE='TBSIELNB'

# Main

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
