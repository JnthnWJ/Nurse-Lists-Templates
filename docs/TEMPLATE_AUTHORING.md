# Nurse Lists TOML Authoring Guide

This document is the complete authoring contract for TOML templates consumed by Nurse Lists. It is designed to be pasted into ChatGPT when asking it to create or revise a template.

## Publication model

- Put live templates directly in `templates/` with a `.toml` extension.
- Use one template per file.
- Files in `examples/`, `docs/`, or subdirectories are not loaded by the app.
- The app downloads the complete directory as one atomic catalog. If any live TOML is invalid, devices retain their entire last-known-good catalog.
- Template IDs must be unique across all live files.
- Deleting a file removes it from the Library after refresh. Already-active checklists keep their pinned snapshot.

## Complete shape

```toml
id = "lowercase-kebab-case"
version = 1
title = "Human-readable title"
category = "Human-readable category"
kind = "checklist"
description = "A concise explanation of purpose and scope."
synonyms = ["search phrase", "common abbreviation"]

[[sections]]
id = "stable-section-id"
title = "Section title"

[[sections.blocks]]
id = "stable-block-id"
kind = "task"
title = "Action-oriented block title"
body = "Optional supporting detail."
```

Every template needs at least one section, and every section needs at least one block.

## Template fields

| Field | Required | Rules |
| --- | --- | --- |
| `id` | Yes | Globally unique, permanent, lowercase kebab-case. Never reuse an ID for a different template. |
| `version` | Yes | Positive integer. Start at `1`; increment when meaningful content changes. |
| `title` | Yes | Short display title. |
| `category` | Yes | Concise Library grouping/search term. |
| `kind` | Yes | `checklist`, `reference`, or `hybrid`. |
| `description` | No | Plain-language scope shown in reference detail. |
| `synonyms` | No | Array of search terms and abbreviations; defaults to empty. |
| `sections` | Yes | One or more `[[sections]]` tables. |

Kinds behave as follows:

- `checklist`: a room-based workflow made primarily of task blocks.
- `reference`: read-only instructional content; it does not offer checklist mode.
- `hybrid`: reference content that also offers checklist mode for its task blocks.

## Section fields

Each `[[sections]]` table requires:

- `id`: permanent lowercase kebab-case, unique within the template.
- `title`: visible section heading.
- One or more nested `[[sections.blocks]]` tables.

Section order in the file is display order.

## Block fields and kinds

Every block requires an `id`, `kind`, and `title`. `body` is optional. `assetName` is optional only for an `image` placeholder. Block IDs must be lowercase kebab-case and unique across the entire template—not merely within one section.

| `kind` | Purpose | Checklist behavior |
| --- | --- | --- |
| `task` | An actionable, trackable step | Becomes a checklist item with status and notes |
| `instruction` | Neutral directions or preparation | Reference only |
| `warning` | Risk, contraindication, or escalation reminder | Reference only |
| `tip` | Practical efficiency or comfort guidance | Reference only |
| `rationale` | Explanation of why a step matters | Reference only |
| `documentation` | Documentation reminder | Reference only |
| `image` | Placeholder for a named visual asset | Reference only; remote image files are not supported |

Only `task` blocks are instantiated in checklist mode. A `checklist` or `hybrid` template should contain at least one task.

## Stable IDs and versioning

IDs connect saved checklist progress to content. Treat them as database keys:

- Use lowercase letters, digits, and single hyphens: `confirm-discharge-order`.
- Do not use spaces, underscores, uppercase letters, punctuation, or random IDs.
- Do not change an existing template, section, or block ID merely to improve wording.
- If a step is conceptually replaced, add a new block ID and remove the old block.
- Never reuse a removed ID for a different concept.

Increase `version` for any meaningful parsed-content change, including wording, ordering, titles, descriptions, synonyms, kinds, sections, or blocks. Do not increment for comments or whitespace alone. The app rejects a changed semantic fingerprint at an already-known version.

When updating, use the next integer (`1` → `2`). Active checklists remain on their starting snapshot; new checklists use the new version.

## TOML syntax guidance

- Quote all strings with double quotes.
- Escape an embedded double quote as `\"`.
- Use arrays for synonyms: `synonyms = ["piv", "iv start"]`.
- Keep template fields before the first `[[sections]]` declaration.
- A `[[sections.blocks]]` declaration belongs to the most recently declared section.
- Comments begin with `#` and are ignored semantically.
- Prefer concise `body` strings. TOML multiline basic strings are allowed when truly useful:

```toml
body = """
First paragraph.

Second paragraph.
"""
```

## Authoring checklist

Before committing, verify:

1. The filename ends in `.toml` and is lowercase kebab-case.
2. `id`, section IDs, and block IDs are stable lowercase kebab-case.
3. The template ID is unique across `templates/`.
4. The version is `1` for a new template or incremented for a meaningful update.
5. The kind is exactly `checklist`, `reference`, or `hybrid`.
6. Every section has at least one block and every block uses a supported kind.
7. Checklist-capable templates contain at least one `task` block.
8. Content contains no patient-specific data, PHI, credentials, or secrets.
9. A qualified clinician has reviewed the content against current policy and evidence.
10. `pnpm validate` and the GitHub **Validate templates** Action pass.

## Privacy and clinical-content rules

This is a public repository. Templates must be reusable general content only. Never include data about an actual patient or encounter. Do not encode facility secrets or authentication information.

Write templates as workflow aids, not authoritative medical instructions. Avoid invented doses, device settings, time limits, or policy claims. When details vary by institution, say to follow current facility/unit policy. Obtain appropriate clinical review before use and revise or remove outdated content promptly.

## Editing with GitHub on a phone

1. Open the repository while signed in to GitHub.
2. Navigate to `templates/`.
3. For a new template, choose **Add file → Create new file**; for an update, open the file and choose the pencil icon.
4. Paste the TOML, add a concise commit message, and commit to `main`.
5. Open **Actions → Validate templates** and inspect any failure message, which names the file and invalid field.
6. Open Nurse Lists and use **Settings → Refresh templates** for immediate delivery.

