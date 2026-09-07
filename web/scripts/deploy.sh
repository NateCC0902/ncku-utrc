#!/usr/bin/env bash
# Publish the site to https://natecc0902.github.io/ncku-utrc/
#
# GitHub Pages serves the gh-pages branch directly rather than building from a
# workflow, because pushing a workflow file needs an OAuth scope the local
# token does not carry. So the branch holds the built output, not the source.
set -euo pipefail
cd "$(dirname "$0")/.."

REPO=ncku-utrc
export NEXT_PUBLIC_BASE_PATH="/$REPO"   # project sites live under /<repo>

rm -rf out
pnpm build
touch out/.nojekyll                     # or Jekyll strips _next/

# A throwaway repo: gh-pages carries no history worth keeping, and force-push
# means the branch is always exactly the current build.
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Static export of the NCKU UTRC site"
git push -qf "https://github.com/NateCC0902/$REPO.git" gh-pages
rm -rf .git

echo "pushed — Pages rebuilds in ~1 min"
