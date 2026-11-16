#!/bin/sh
# Cloudflare tells browsers to cache .css/.js for hours, so pages reference them with ?v=<content hash>.
# Run this after editing i18n.css or i18n.js (it rewrites the ?v= in every page).
cd "$(dirname "$0")"
for f in i18n.css i18n.js; do
  h=$(shasum "$f" | cut -c1-8)
  sed -i '' -E "s#(href|src)=\"$f(\?v=[a-z0-9]+)?\"#\1=\"$f?v=$h\"#g" *.html
done
