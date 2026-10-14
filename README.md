# Gym Log

Personal workout logger that runs as a home-screen app (PWA) on iPhone.
Plain HTML + JavaScript, no frameworks, no server, no account. Data stays on the phone (localStorage).

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app: layout, styles and code |
| `manifest.json` | App name, icon and "standalone" (full-screen) mode |
| `sw.js` | Service worker: caches the app so it opens offline |
| `icon-180.png` | iPhone home-screen icon |
| `icon-192.png`, `icon-512.png` | Icons referenced by the manifest |

## Publish on GitHub Pages

1. Create a new repository on GitHub (e.g. `gymlog`).
2. Upload all the files above to the root of the repository (*Add file → Upload files*).
3. *Settings → Pages → Build and deployment*: Source **Deploy from a branch**, Branch **main**, folder **/ (root)** → Save.
4. After about a minute the app is at `https://<your-username>.github.io/gymlog/`.

On a free GitHub plan the repository (the code) is public. Your workout data is not in the repo; it never leaves the phone unless you export it.

## Install on iPhone

1. Open the URL in **Safari**.
2. Share → **Add to Home Screen** → Add.
3. Open it from the home-screen icon (not from Safari) — that copy is the "app", with its own storage.

Note: the home-screen app and Safari keep **separate** data. Always use the icon.

## Publishing an update

1. Edit the files.
2. In `sw.js`, change `CACHE_VERSION` (`gymlog-v1` → `gymlog-v2`).
3. Upload the changed files.
4. Open the app twice: the first launch downloads the new version in the background, the second shows it.

## Backups

Settings → **Export backup (JSON)** opens the iPhone share sheet: save to Files, OneDrive or email it to yourself.
**Import backup** restores such a file (it replaces all current data).
**Export CSV** gives one row per set (`date, exercise, set, kg, reps`) for Excel.
