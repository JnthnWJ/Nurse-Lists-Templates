import { execFileSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { parse } from 'smol-toml'

const roots = ['templates', 'examples']
const compareIndex = process.argv.indexOf('--compare-ref')
const compareRef = compareIndex >= 0 ? process.argv[compareIndex + 1] : undefined

try {
  const current = await loadWorkingTreeTemplates()
  validateUniqueTemplateIds(
    current.filter((item) => item.filename.startsWith('templates/')),
    'live catalog',
  )
  validateUniqueTemplateIds(
    current.filter((item) => item.filename.startsWith('examples/')),
    'examples',
  )
  if (compareRef) {
    const previous = loadTemplatesAtRef(compareRef)
    validateVersionHistory(previous, current)
  }
  const liveCount = current.filter((item) => item.filename.startsWith('templates/')).length
  const exampleCount = current.length - liveCount
  console.log(`Validated ${liveCount} live template(s) and ${exampleCount} example(s).`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}

async function loadWorkingTreeTemplates() {
  const templates = []
  for (const root of roots) {
    for (const name of (await readdir(root)).filter((item) => item.endsWith('.toml')).sort()) {
      const filename = path.posix.join(root, name)
      templates.push(parseAndValidate(await readFile(filename, 'utf8'), filename))
    }
  }
  return templates
}

function loadTemplatesAtRef(ref) {
  let names = []
  try {
    names = execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'templates'], {
      encoding: 'utf8',
    })
      .split('\n')
      .filter((name) => name.endsWith('.toml'))
  } catch {
    return []
  }
  return names.map((filename) =>
    parseAndValidate(
      execFileSync('git', ['show', `${ref}:${filename}`], { encoding: 'utf8' }),
      `${ref}:${filename}`,
    ),
  )
}

function parseAndValidate(source, filename) {
  let value
  try {
    value = parse(source)
  } catch (error) {
    throw new Error(`${filename}: invalid TOML: ${error instanceof Error ? error.message : error}`)
  }
  requireObject(value, filename)
  rejectUnknown(value, ['id', 'version', 'title', 'category', 'kind', 'description', 'synonyms', 'sections'], filename)
  const id = stableId(value.id, `${filename} id`)
  const version = positiveInteger(value.version, `${filename} version`)
  const kind = requiredString(value.kind, `${filename} kind`)
  if (!['checklist', 'reference', 'hybrid'].includes(kind)) {
    throw new Error(`${filename}: unsupported kind ${kind}`)
  }
  requiredString(value.title, `${filename} title`)
  requiredString(value.category, `${filename} category`)
  optionalString(value.description, `${filename} description`)
  stringArray(value.synonyms, `${filename} synonyms`)
  const sections = nonEmptyArray(value.sections, `${filename} sections`)
  const sectionIds = new Set()
  const blockIds = new Set()
  let taskCount = 0
  for (const [sectionIndex, section] of sections.entries()) {
    const context = `${filename} section ${sectionIndex + 1}`
    requireObject(section, context)
    rejectUnknown(section, ['id', 'title', 'blocks'], context)
    const sectionId = stableId(section.id, `${context} id`)
    unique(sectionIds, sectionId, `${filename} section id`)
    requiredString(section.title, `${context} title`)
    for (const [blockIndex, block] of nonEmptyArray(section.blocks, `${context} blocks`).entries()) {
      const blockContext = `${context} block ${blockIndex + 1}`
      requireObject(block, blockContext)
      rejectUnknown(block, ['id', 'kind', 'title', 'body', 'assetName'], blockContext)
      const blockId = stableId(block.id, `${blockContext} id`)
      unique(blockIds, blockId, `${filename} block id`)
      const blockKind = requiredString(block.kind, `${blockContext} kind`)
      if (!['task', 'instruction', 'warning', 'tip', 'rationale', 'documentation', 'image'].includes(blockKind)) {
        throw new Error(`${blockContext}: unsupported kind ${blockKind}`)
      }
      if (blockKind === 'task') taskCount += 1
      requiredString(block.title, `${blockContext} title`)
      optionalString(block.body, `${blockContext} body`)
      optionalString(block.assetName, `${blockContext} assetName`)
    }
  }
  if ((kind === 'checklist' || kind === 'hybrid') && taskCount === 0) {
    throw new Error(`${filename}: ${kind} templates require at least one task block`)
  }
  return { filename, id, version, fingerprint: JSON.stringify(value) }
}

function validateUniqueTemplateIds(templates, context) {
  const ids = new Set()
  for (const template of templates) unique(ids, template.id, `${context} template id`)
}

function validateVersionHistory(previous, current) {
  const previousById = new Map(previous.map((template) => [template.id, template]))
  for (const template of current.filter((item) => item.filename.startsWith('templates/'))) {
    const old = previousById.get(template.id)
    if (!old || old.fingerprint === template.fingerprint) continue
    if (template.version !== old.version + 1) {
      throw new Error(
        `${template.filename}: meaningful changes to ${template.id} require version ${old.version + 1}; found ${template.version}`,
      )
    }
  }
}

function requireObject(value, context) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${context}: expected an object`)
}
function rejectUnknown(value, allowed, context) {
  const unknown = Object.keys(value).find((key) => !allowed.includes(key))
  if (unknown) throw new Error(`${context}: unsupported field ${unknown}`)
}
function requiredString(value, context) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${context}: expected a non-empty string`)
  return value
}
function optionalString(value, context) {
  if (value !== undefined && typeof value !== 'string') throw new Error(`${context}: expected a string`)
}
function stableId(value, context) {
  const id = requiredString(value, context)
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`${context}: must use lowercase kebab-case`)
  return id
}
function positiveInteger(value, context) {
  if (!Number.isInteger(value) || value < 1) throw new Error(`${context}: expected a positive integer`)
  return value
}
function stringArray(value, context) {
  if (value !== undefined && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) {
    throw new Error(`${context}: expected an array of strings`)
  }
}
function nonEmptyArray(value, context) {
  if (!Array.isArray(value) || value.length === 0) throw new Error(`${context}: expected a non-empty array`)
  return value
}
function unique(seen, value, context) {
  if (seen.has(value)) throw new Error(`${context}: duplicate ${value}`)
  seen.add(value)
}
