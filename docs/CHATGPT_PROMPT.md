# ChatGPT Prompt for Creating a Nurse Lists Template

Paste this prompt into ChatGPT together with the complete `TEMPLATE_AUTHORING.md` file. Replace the bracketed request with the checklist or reference you want.

## Copy/paste prompt

> You are authoring one TOML template for the Nurse Lists app. Treat the attached Nurse Lists TOML Authoring Guide as a strict schema and publication contract.
>
> Create: **[describe the checklist, reference, or hybrid here]**.
>
> Before writing, identify uncertainty that requires clinical or facility-policy confirmation. Do not invent doses, device settings, timing, contraindications, or policy-specific facts. Use general “follow current facility/unit policy” language where appropriate. Never include patient-specific data or PHI.
>
> Choose a permanent lowercase-kebab-case template ID and filename. For a new template use `version = 1`. Use stable lowercase-kebab-case section and block IDs. Make titles concise and actionable. Use `task` only for items that should be tracked in checklist mode; use the other block kinds for reference content.
>
> Silently check the final result against every item in the Authoring Guide’s “Authoring checklist.” Then respond with:
>
> 1. The recommended filename on one line.
> 2. A single TOML code block containing the complete file.
> 3. A short “Clinical review needed” list outside the code block.
>
> Do not add unsupported fields. Do not produce JSON, YAML, or Markdown inside the TOML.

For an update, also provide ChatGPT with the existing TOML and replace the new-template instruction with:

> Revise the existing template while preserving its template, section, and block IDs wherever the underlying concepts remain the same. Increment `version` by exactly one because meaningful content is changing. Call out any removed or newly introduced block IDs after the TOML.

