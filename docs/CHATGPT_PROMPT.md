# Standalone ChatGPT Prompt for Nurse Lists TOML

The prompt below contains the complete schema and authoring rules ChatGPT needs to create or revise a Nurse Lists template. You do not need to attach the separate authoring guide. Replace the bracketed request, then copy the entire prompt into ChatGPT. For an update, also paste the existing TOML where indicated.

## Copy/paste prompt

```text
You are creating or revising exactly one TOML template for the Nurse Lists app. Follow every rule in this prompt. Return TOML that can be saved directly in the public Nurse Lists template repository.

MY REQUEST

[Describe the checklist, reference, or hybrid template you want. Include any trusted content, required steps, source material, and facility-specific constraints.]

MODE

[Write NEW for a new template, or UPDATE and paste the complete existing TOML here.]

PUBLICATION MODEL

- Produce one template in one file.
- The live file will be placed directly in `templates/` and must end in `.toml`.
- Only direct `.toml` files in `templates/` are loaded. Files in subdirectories, `examples/`, or `docs/` are not loaded.
- The repository is public. Never include patient-specific data, protected health information (PHI), encounter data, credentials, secrets, or private facility information.
- The app validates the whole catalog atomically. One invalid live file prevents the entire new catalog from being applied, so follow the schema exactly.
- Deleting a published file removes it from the Library after refresh. Active checklists keep the exact template snapshot with which they started.

COMPLETE TOML SHAPE

Use this structure. Fields marked optional may be omitted. Do not invent fields that are not documented here.

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

TEMPLATE FIELDS

- `id` (required): a globally unique, permanent lowercase-kebab-case identifier. Never reuse an ID for a different template.
- `version` (required): a positive integer. A new template starts at `1`. An update with any meaningful parsed-content change increments the existing version by exactly one.
- `title` (required): a short human-readable display title.
- `category` (required): a concise Library grouping and search term.
- `kind` (required): exactly one of `checklist`, `reference`, or `hybrid`.
- `description` (optional): a concise plain-language description of purpose and scope. It is shown in reference detail.
- `synonyms` (optional): an array of useful search terms, abbreviations, or alternative names. If omitted, it behaves as an empty array.
- `sections` (required): one or more `[[sections]]` tables.

TEMPLATE KINDS

- `checklist`: a room-based workflow made primarily of trackable task blocks. It must contain at least one `task` block.
- `reference`: read-only instructional content. It does not offer checklist mode and may contain no tasks.
- `hybrid`: reference content that also offers checklist mode for its task blocks. It must contain at least one `task` block.

SECTION RULES

- Every template must contain at least one section.
- Each `[[sections]]` table requires `id` and `title`.
- Each section must contain at least one nested `[[sections.blocks]]` table.
- A section ID must be permanent lowercase kebab-case and unique within the template.
- Section order in the TOML is the display order.
- Each `[[sections.blocks]]` declaration belongs to the most recently declared `[[sections]]` table.

BLOCK FIELDS

- `id` (required): permanent lowercase kebab-case. It must be unique across the entire template, not just within its section.
- `kind` (required): exactly one of the supported block kinds below.
- `title` (required): concise visible text. For a task, make it action-oriented.
- `body` (optional): supporting detail in plain language.
- `assetName` (optional): allowed only on an `image` block. It names a visual placeholder; remote image synchronization is not supported.

SUPPORTED BLOCK KINDS

- `task`: an actionable, trackable step. It becomes a checklist item with status and notes.
- `instruction`: neutral directions or preparation. Reference-only content.
- `warning`: a risk, contraindication, or escalation reminder. Reference-only content.
- `tip`: practical efficiency or comfort guidance. Reference-only content.
- `rationale`: an explanation of why a step matters. Reference-only content.
- `documentation`: a documentation reminder. Reference-only content.
- `image`: a placeholder for a named visual asset. Reference-only content; it may use `assetName`.

Only `task` blocks are instantiated in checklist mode. Do not make an informational statement a task merely so that it appears in checklist mode.

ID RULES

- Template, section, and block IDs may contain only lowercase letters, digits, and single hyphens, for example `confirm-discharge-order`.
- Do not use spaces, underscores, uppercase letters, punctuation, leading or trailing hyphens, repeated hyphens, or random IDs.
- Choose IDs based on durable concepts rather than display wording.
- Template IDs must be globally unique across all live templates. Section IDs must be unique within their template. Block IDs must be unique across their entire template.
- In UPDATE mode, preserve every existing template, section, and block ID whenever the underlying concept remains the same, even if its wording or location changes.
- If an existing concept is genuinely replaced with a different concept, remove the old block ID and create a new one.
- Never reuse a removed template, section, or block ID for a different concept.

VERSION RULES

- In NEW mode, use `version = 1`.
- In UPDATE mode, increment the existing version by exactly one when meaningful parsed content changes.
- Meaningful changes include wording, order, title, category, description, synonyms, kinds, sections, blocks, or any other parsed value.
- Comments and whitespace-only changes do not require a version increment.
- Never change meaningful content while retaining the same version. The app remembers semantic fingerprints and rejects a changed template at a previously known version.
- Active checklists remain pinned to their starting version. The new version affects only checklists started afterward.

TOML SYNTAX RULES

- Quote all strings with double quotes.
- Escape a double quote inside a string as `\"`.
- Write arrays in brackets, for example `synonyms = ["piv", "iv start"]`.
- Put all template-level fields before the first `[[sections]]` declaration.
- Declare a section before declaring its blocks.
- Comments begin with `#` and are ignored semantically.
- Prefer concise one-line `body` values. If genuinely needed, a multiline basic string is allowed:

  body = """
  First paragraph.

  Second paragraph.
  """

- Do not output JSON, YAML, Markdown, HTML, or unsupported TOML fields inside the template.

CLINICAL SAFETY AND PRIVACY

- This content will be public and reusable. Never include a patient name, room number, date of birth, medical record number, real encounter note, or any other patient identifier or runtime checklist data.
- Never include credentials, tokens, secrets, proprietary facility information, or authentication details.
- Treat templates as workflow aids, not authoritative medical instructions or substitutes for current facility policy, product instructions, required training, or clinical judgment.
- Do not invent or infer medication doses, concentrations, device settings, time limits, contraindications, escalation thresholds, or policy-specific facts.
- If information is uncertain, variable, institution-specific, or not supplied in MY REQUEST, use language such as “Follow current facility/unit policy” or identify it for clinical review. Do not fill the gap with a plausible-sounding fact.
- A qualified clinician must review the content against current policy and evidence before operational use.
- Make any uncertainty or clinical-review need explicit outside the TOML.

AUTHORING PROCESS

1. Decide whether the requested content is a `checklist`, `reference`, or `hybrid` based on the behavior described above.
2. Identify missing or uncertain clinical and facility-policy information. Do not invent it.
3. Choose a concise lowercase-kebab-case filename and permanent IDs.
4. Organize content into ordered sections and blocks. Use `task` only for independently trackable actions.
5. Create the complete TOML using only supported fields and kinds.
6. Silently validate the finished template against every item in the final checklist below.

FINAL VALIDATION CHECKLIST

- The filename ends in `.toml` and its basename is lowercase kebab-case.
- The template contains every required field and at least one section.
- Every section has an `id`, a `title`, and at least one block.
- Every block has an `id`, a supported `kind`, and a `title`.
- All IDs obey the lowercase-kebab-case rules and uniqueness scopes.
- The template ID is intended to be unique across `templates/`.
- The version is `1` for NEW mode or exactly one greater for a meaningful UPDATE.
- The template kind is exactly `checklist`, `reference`, or `hybrid`.
- A `checklist` or `hybrid` contains at least one `task` block.
- Only image blocks use `assetName`.
- There are no unsupported fields or unsupported block kinds.
- Existing IDs are preserved in UPDATE mode wherever their concepts remain the same.
- The content contains no patient data, PHI, credentials, secrets, or runtime checklist data.
- Uncertain clinical or policy details were not invented and are called out for review.

RESPONSE FORMAT

Respond with exactly these parts:

1. `Recommended filename: <lowercase-kebab-case>.toml`
2. One `toml` code block containing the complete file and nothing else inside the code block.
3. `Clinical review needed:` followed by a short bullet list of every claim, choice, omission, or facility-specific detail that a qualified clinician should verify. If none were identified, still state that the complete template requires qualified clinical review before use.
4. In UPDATE mode only, `ID changes:` followed by all added and removed template, section, or block IDs and a brief reason for each. State `None` if no IDs changed.

Do not claim that the content is clinically approved or that repository validation has passed. Repository validation must still be run after saving the file.
```

After saving the generated file, commit it to `templates/`, confirm that the GitHub **Validate templates** Action passes, obtain qualified clinical review, and use **Settings → Refresh templates** in Nurse Lists.
