#!/bin/sh
# Apply the blue Be Global branding to /vapi, preserving the previous release.
set -eu
revision=${1:?Full Git commit is required}
case "$revision" in *[!a-f0-9]*|'') exit 2 ;; esac
[ "${#revision}" -eq 40 ] || exit 2
parent=/home/u828768827/domains/beglobal.softvibes.pro
destination="$parent/public_html/vapi"
[ -d "$destination" ] && [ ! -L "$destination" ] || exit 3
stage=$(mktemp -d "$parent/.vapi-brand.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT HUP INT TERM
base="https://raw.githubusercontent.com/softvibeslab/beglobal/$revision/beglobal/vapi"
for name in index.html styles.css app.js config.json logo-beglobal.png SHA256SUMS; do
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 "$base/$name" -o "$stage/$name"
done
cd "$stage"
sha256sum --check SHA256SUMS
cd "$destination"
if cmp -s SHA256SUMS "$stage/SHA256SUMS"; then sha256sum --check SHA256SUMS; exit 0; fi
printf '%s  SHA256SUMS\n' '9788e553c082b9bd5859f89fc4c32af108e55a7367922af50acead1ce538d709' | sha256sum --check
backup="$parent/.vapi-backups/branding-$revision"
if [ ! -f "$backup/BACKUP_COMPLETE" ]; then
  sha256sum --check SHA256SUMS
  mkdir -p "$backup"
  chmod 700 "$parent/.vapi-backups" "$backup"
  for name in index.html styles.css app.js config.json SHA256SUMS; do
    [ ! -L "$name" ] || exit 4
    cp -p "$name" "$backup/$name"
    cmp "$name" "$backup/$name"
  done
  touch "$backup/BACKUP_COMPLETE"
fi
# The existing assistant configuration must stay identical.
cmp config.json "$stage/config.json"
for name in logo-beglobal.png styles.css app.js index.html SHA256SUMS; do
  [ ! -L "$name" ] || exit 4
  chmod 644 "$stage/$name"
  mv -f "$stage/$name" "$destination/$name"
done
sha256sum --check SHA256SUMS
printf 'Be Global blue branding published: %s\n' "$revision"
