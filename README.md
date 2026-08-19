# Nurse Lists Templates

This public repository is the read-only template catalog for the Nurse Lists app. The app checks the [`templates/`](templates/) directory when it opens or returns to the foreground, caches the last valid catalog for offline use, and also provides **Settings → Refresh templates**.

Only `.toml` files directly inside `templates/` are published to the app. The catalog intentionally starts empty. Files under [`examples/`](examples/) are documentation examples and are never loaded by the app.

## Add a template from a phone or browser

1. Use the standalone [`docs/CHATGPT_PROMPT.md`](docs/CHATGPT_PROMPT.md) to generate a template. It contains the complete schema and authoring contract. [`docs/TEMPLATE_AUTHORING.md`](docs/TEMPLATE_AUTHORING.md) is the shorter human-reference guide.
2. In GitHub, open `templates/`, choose **Add file → Create new file**, and name it with lowercase kebab-case plus `.toml`, such as `post-fall-assessment.toml`.
3. Paste the generated TOML and commit it to `main`.
4. Open the repository's **Actions** tab and confirm that **Validate templates** is green. A bad commit is not applied by the app, but it should still be corrected promptly.
5. In Nurse Lists, open **Settings → Refresh templates**. Otherwise, the app checks automatically after 24 hours when launched or resumed.

To update a template, edit its file and increment `version` whenever meaningful content changes. To remove it from the Library, delete the TOML. Active checklists retain the exact template snapshot with which they started.

## Validate locally

```sh
pnpm install
pnpm validate
```

## Safety and privacy

This repository is public. Never add patient names, room numbers, dates of birth, medical record numbers, notes about a real encounter, credentials, secrets, or any other protected health information. Templates are general workflow aids—not medical advice or substitutes for current facility policy, product instructions, clinical judgment, or required training. A qualified clinician must review content before operational use.
