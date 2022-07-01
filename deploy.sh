#!/usr/bin/env sh

ng build --base-href "https://rriet.github.io/flightbag/"

# Deploy pages
npx angular-cli-ghpages --dir=dist/eflight/

# Deploy master source code
git init

git add -A

git commit -m 'deploy'

git push -f https://github.com/rriet/flightbag.git master:master