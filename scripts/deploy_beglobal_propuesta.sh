#!/bin/sh
# Additive, checksum-verified deployment of /propuesta only.
# Usage: sh deploy_beglobal_propuesta.sh FULL_COMMIT MANIFEST_SHA256
# Failed staging directories stay outside public_html for inspection.
set -eu
revision=${1:?Full Git commit is required}
manifest_digest=${2:?SHA256SUMS digest is required}
case "$revision" in *[!a-f0-9]*|'') exit 2 ;; esac
case "$manifest_digest" in *[!a-f0-9]*|'') exit 2 ;; esac
[ "${#revision}" -eq 40 ] && [ "${#manifest_digest}" -eq 64 ] || exit 2
parent=/home/u828768827/domains/beglobal.softvibes.pro
site_root="$parent/public_html"
destination="$site_root/propuesta"
[ -d "$site_root" ] && [ ! -L "$site_root" ] || exit 3
lock="$parent/.propuesta-deploy.lock"
if ! mkdir -m 700 "$lock"; then
  echo 'Another proposal deployment may be running; no changes made.'
  exit 75
fi
trap 'rmdir -- "$lock"' EXIT
trap 'exit 130' HUP INT TERM

# Reruns may verify this exact release, never replace an unknown existing route.
if [ -e "$destination" ] || [ -L "$destination" ]; then
  [ -d "$destination" ] && [ ! -L "$destination" ] || exit 4
  [ -f "$destination/SHA256SUMS" ] && [ ! -L "$destination/SHA256SUMS" ] || exit 4
  cd "$destination"
  echo "$manifest_digest  SHA256SUMS" | sha256sum --check -
  sha256sum --check SHA256SUMS
  echo "Proposal release already installed and verified: $revision"
  exit 0
fi

stage=$(mktemp -d "$parent/.propuesta-release.XXXXXXXX")
base="https://raw.githubusercontent.com/softvibeslab/beglobal/$revision/beglobal/propuesta"
for name in index.html styles.css economics.js app.js .htaccess logo-beglobal.png podcast.mp3 SHA256SUMS; do
  curl --fail --silent --show-error --location --retry 2 --connect-timeout 10 --max-time 90 "$base/$name" -o "$stage/$name"
done
cd "$stage"
echo "$manifest_digest  SHA256SUMS" | sha256sum --check -
sha256sum --check SHA256SUMS
chmod 644 index.html styles.css economics.js app.js .htaccess logo-beglobal.png podcast.mp3 SHA256SUMS
chmod 755 "$stage"
# Never nest inside or overwrite a route created concurrently.
mv -T --no-clobber "$stage" "$destination"
if [ -d "$stage" ]; then
  echo 'Destination appeared concurrently; verified stage retained outside public_html.'
  exit 4
fi
cd "$destination"
sha256sum --check SHA256SUMS
echo "BeGlobal /propuesta release installed and verified: $revision"
