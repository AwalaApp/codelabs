#!/bin/bash -x

set -o nounset
set -o errexit
set -o pipefail

go get github.com/googlecodelabs/tools/claat

cd site
npm install
