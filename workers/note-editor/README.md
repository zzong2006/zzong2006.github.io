# Owner-only note editor

This is a separate, free-plan Cloudflare Worker linked from Quartz. It edits existing public Markdown notes in the **private vault**, not the generated site copy. The editor opens in a separate tab so OAuth cookies do not depend on third-party-cookie support. It does not require KV, D1, a custom domain, a paid Worker plan, or an AI API.

## Status and scope

Source implementation and local tests are provided. Production use requires the setup below and a real save/publish smoke test. Keep the Quartz plugin disabled until then.

- Owner GitHub login, Markdown source, sanitized approximate preview, math and wiki-link labels.
- Save updates the vault only. Publish validates an immutable saved version in a private workflow before updating the public copy. Public `deploy.yml` then builds the site.
- SHA checks reject concurrent edits. Unsaved text can be downloaded. Publication state survives a reload in the same tab, but do not close the tab during validation: the browser must finish the validated publication request.
- Existing public notes only, 256 KiB maximum. No uploads, new notes, renames, deletion, draft/unpublish or site-only home/resume editing.
- Preview is not Quartz itself: Mermaid, embeds and wiki target resolution are not rendered identically. The existing validator reports missing links as warnings. Always check the deployed page.
- Remote vault changes do not automatically update a local Obsidian checkout. Pull/reconcile local edits before the next local publish. Never blindly overwrite the remote version.

## 1. Install the private validator workflow

Merge `.github/workflows/web-note-publish-check.yml` and `scripts/check_web_note.py` into `zzong2006/obsidian-vault` main. The workflow uses existing private validation scripts/patterns, validates only the selected note, and uploads **no artifacts**. It runs on standard Linux runners and uses the account's private Actions quota. Confirm Actions usage/budget settings before enabling production.

## 2. Cloudflare Free

From this directory:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm build
pnpm exec wrangler login
pnpm exec wrangler deploy
```

Use the existing Cloudflare **Free** Workers plan. Do not enable Paid, paid add-ons or automatic paid usage. Configure GitHub Actions overage blocking separately in account billing; those budgets are account-wide and must not be changed silently.

The initial deployment serves the editor but returns a setup-required error on API calls. Record its `https://zzong-note-editor.<account>.workers.dev` URL as `APP_ORIGIN` in `wrangler.toml`.

## 3. Register a private GitHub App

Create an App under the owner's GitHub Developer settings:

- Homepage URL: Worker URL.
- Callback URL: Worker URL + `/callback`.
- Webhook: disabled. User access-token expiration: enabled.
- Repository permissions: **Contents: read and write**, **Actions: read and write**, Metadata: read. No account permissions, no Workflows write permission.
- Install only on `obsidian-vault` and `zzong2006.github.io`.
- Record the **client ID**, not App ID, as `GITHUB_CLIENT_ID` in `wrangler.toml`.
- Generate a client secret and enter it directly in the local secret prompt. Do not paste secrets into chat, screenshots, public files or commands.

```powershell
pnpm exec wrangler secret put GITHUB_CLIENT_SECRET
pnpm exec wrangler secret put SESSION_SECRET
```

For `SESSION_SECRET`, use a password-manager-generated random value with at least 43 characters (256 bits of entropy recommended). The encrypted HttpOnly session lasts at most one hour. Rotating this secret invalidates sessions and publication tickets. The App token is never returned to browser JavaScript or stored in localStorage. The existing `gh` credential is not reused by the server.

Run `pnpm deploy` after configuring variables. Verify the owner ID in `wrangler.toml` matches the intended account. Authentication uses state + PKCE, encrypted purpose-bound cookies, Origin + CSRF checks and an owner numeric-ID allowlist. Runtime logs are disabled to avoid accidental callback/body logging.

## 4. Connect Quartz and verify

Set `./plugins/note-editor-link` in `quartz.config.yaml` to `enabled: true` and `endpoint: <Worker URL>`. Install the local plugin through the existing Quartz plugin installer, build and deploy the site normally.

Before enabling the link publicly, verify:

1. Logged-out/other-account requests cannot read or edit a note.
2. A small deliberate edit saves in private vault only; text and frontmatter are preserved.
3. A stale SHA produces a conflict, keeping the user's text intact.
4. The private validation run succeeds and only that saved note is copied publicly.
5. A validation failure produces no public content commit.
6. The public deploy succeeds, then the live title, math and links are correct.
7. Reload the local vault safely to incorporate remote changes.

To disable, turn off the Quartz plugin and disable/delete the Worker or revoke the GitHub App. No note data lives in the Worker.

## Local checks

```powershell
pnpm test
pnpm audit --prod
pnpm build
pnpm exec wrangler deploy --dry-run
# Mock server; no login, remote writes or deployment:
node test/preview-server.mjs
```

Never deploy `test/preview-server.mjs`; it is only a localhost UI fixture, not an authenticated backend.
