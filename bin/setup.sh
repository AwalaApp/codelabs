#!/bin/bash -x

set -o nounset
set -o errexit
set -o pipefail

go get github.com/googlecodelabs/tools/claat@v2.2.4

cd site
npm install
