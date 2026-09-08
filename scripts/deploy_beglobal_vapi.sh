#!/bin/sh
# One-time, additive release for the existing Hostinger account.
# Usage: sh deploy_beglobal_vapi.sh FULL_GIT_COMMIT
set -eu
revision=${1:?Full Git commit is required}
case "$revision" in *[!a-f0-9]*|'') exit 2 ;; esac
[ "${#revision}" -eq 40 ] || exit 2
site_root=/home/u828768827/domains/beglobal.softvibes.pro/public_html
[ -d "$site_root" ] || exit 3
destination="$site_root/vapi"
# Never overwrite an existing route, including symlinks.
if [ -e "$destination" ] || [ -L "$destination" ]; then exit 0; fi
stage=$(mktemp -d "$site_root/.vapi-release.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT HUP INT TERM
base="https://raw.githubusercontent.com/softvibeslab/beglobal/$revision/beglobal/vapi"
for name in index.html styles.css app.js config.json SHA256SUMS; do
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 "$base/$name" -o "$stage/$name"
done
cd "$stage"
sha256sum --check SHA256SUMS
chmod 755 "$stage"
chmod 644 index.html styles.css app.js config.json SHA256SUMS
# -T avoids accidentally nesting this release in a concurrently-created route.
mv -T --no-clobber "$stage" "$destination"
printf 'Be Global /vapi release checked and installed: %s\n' "$revision"
