#!/bin/sh
# Activate the verified Vapi public configuration; preserve the existing page.
set -eu
revision=${1:?Full Git commit is required}
case "$revision" in *[!a-f0-9]*|'') exit 2 ;; esac
[ "${#revision}" -eq 40 ] || exit 2
parent=/home/u828768827/domains/beglobal.softvibes.pro
destination="$parent/public_html/vapi"
[ -d "$destination" ] && [ ! -L "$destination" ] || exit 3
for name in config.json SHA256SUMS; do
  [ -f "$destination/$name" ] && [ ! -L "$destination/$name" ] || exit 3
done
stage=$(mktemp -d "$parent/.vapi-activate.XXXXXXXX")
trap 'rm -rf -- "$stage"' EXIT HUP INT TERM
base="https://raw.githubusercontent.com/softvibeslab/beglobal/$revision/beglobal/vapi"
for name in config.json SHA256SUMS; do
  curl --fail --silent --show-error --location --connect-timeout 10 --max-time 30 "$base/$name" -o "$stage/$name"
done
cd "$stage"
grep '  config.json$' SHA256SUMS | sha256sum --check
cd "$destination"
grep -v '  config.json$' "$stage/SHA256SUMS" | sha256sum --check
if cmp -s config.json "$stage/config.json" && cmp -s SHA256SUMS "$stage/SHA256SUMS"; then exit 0; fi
# Only replace the known pending configuration or finish an interrupted update.
if ! cmp -s config.json "$stage/config.json"; then
  printf '%s  config.json\n' '58533bf7a59c96a23cf1eea4e05355cbad30f446ef451306837dc80ec41c1def' | sha256sum --check
  backup="$parent/.vapi-backups/$revision"
  mkdir -p "$backup"
  chmod 700 "$parent/.vapi-backups" "$backup"
  if [ ! -f "$backup/config.json" ]; then cp -p config.json "$backup/config.json"; fi
  if [ ! -f "$backup/SHA256SUMS" ]; then cp -p SHA256SUMS "$backup/SHA256SUMS"; fi
  cmp config.json "$backup/config.json"
  cmp SHA256SUMS "$backup/SHA256SUMS"
fi
chmod 644 "$stage/config.json" "$stage/SHA256SUMS"
mv -f "$stage/config.json" "$destination/config.json"
mv -f "$stage/SHA256SUMS" "$destination/SHA256SUMS"
sha256sum --check SHA256SUMS
printf 'Vapi configuration activated: %s\n' "$revision"
