#!/bin/bash
set -euo pipefail
archive=${1:?backup archive required}
target=${2:?new isolated restore directory required}
test -f "$archive"
test ! -e "$target" || { echo 'Refusing existing restore destination'; exit 1; }
mkdir -m 700 "$target"
tar -xzf "$archive" -C "$target"
python3 - "$target" <<'PY'
import sqlite3,sys,pathlib
root=pathlib.Path(sys.argv[1]);db=root/'monitoring/data/kuma.db'
con=sqlite3.connect('file:'+str(db)+'?mode=ro',uri=True)
assert con.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
print('Restored SQLite integrity OK; monitors:',con.execute('select count(*) from monitor').fetchone()[0])
assert (root/'current/index.html').is_file()
print('Restored current release exists. Live services unchanged.')
PY
