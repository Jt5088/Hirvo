#!/bin/bash
# build.sh — Processes <!-- INCLUDE: sections/foo.html --> markers in index.html
# and outputs a fully assembled dist/index.html with all sections inlined.
#
# Usage: ./build.sh
# Output: dist/index.html (ready to deploy)

set -euo pipefail
cd "$(dirname "$0")"

mkdir -p dist

# Copy static assets into dist
cp -r styles dist/ 2>/dev/null || true
cp -r js dist/ 2>/dev/null || true
cp -r fonts dist/ 2>/dev/null || true
cp -r signin dist/ 2>/dev/null || true

# Process index.html: replace each INCLUDE marker with the file contents
cp index.html dist/index.html

count=0
while IFS= read -r line; do
  if echo "$line" | grep -q '<!-- INCLUDE:'; then
    filepath=$(echo "$line" | sed 's/.*<!-- INCLUDE: \([^ ]*\) -->.*/\1/')
    if [ -f "$filepath" ]; then
      # Use a temp file approach for reliable sed replacement on macOS
      content=$(cat "$filepath")
      count=$((count + 1))
    fi
  fi
done < index.html

# Use a while loop to process line by line and build the output
{
  while IFS= read -r line; do
    if echo "$line" | grep -q '<!-- INCLUDE:'; then
      filepath=$(echo "$line" | sed 's/.*<!-- INCLUDE: \([^ ]*\) -->.*/\1/')
      if [ -f "$filepath" ]; then
        cat "$filepath"
        echo ""
      else
        echo "$line"
      fi
    else
      echo "$line"
    fi
  done < index.html
} > dist/index.html

echo "Build complete: dist/index.html"
echo "Sections inlined: $count markers processed"
