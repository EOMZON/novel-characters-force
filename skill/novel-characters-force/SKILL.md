---
name: novel-characters-force
description: Turn a novel summary, character notes, or chapter excerpts into a small static HTML character relationship graph with draggable nodes, group filtering, and click-to-read detail cards. Use when the user wants to quickly visualize who matters and how characters connect, without building a full writing system.
---

# novel-characters-force

Use this skill when the user wants a lightweight character graph for a novel.

This skill is intentionally thin.

It does not build a complete writing workflow.
It only helps extract a small character graph and render it as static HTML.

## Use This For

- too many characters in a novel
- messy relationship notes
- wanting a graph for reading or writing
- wanting a local HTML result that can be opened directly

## Do Not Turn This Into

- an Obsidian project
- a YAML-heavy system
- a timeline engine
- a clue database
- a full novel operating system

If the user only wants to understand character relations, keep the output small and usable.

## Output Contract

Write four files into the target output folder:

- `index.html`
- `style.css`
- `graph.js`
- `graph-data.js`

Reuse the public viewer from:

- `assets/viewer/index.html`
- `assets/viewer/style.css`
- `assets/viewer/graph.js`

If you need to scaffold a runnable folder quickly, use:

- `scripts/scaffold_demo.sh`

The graph data file must assign to:

```js
window.charactersForceGraph = { ... };
```

This keeps the output friendly to `file://` double-click usage.

For a public-safe example, see:

- `assets/examples/hongloumeng.graph-data.js`

## Minimum Useful Schema

Read [references/schema.md](references/schema.md) when building data.

Prefer this small node shape:

- `id`
- `label`
- `shortLabel`
- `role`
- `weight`
- `groups`
- `summary`
- `relationsNote`

Prefer this small link shape:

- `from`
- `to`
- `label`
- `weight`

## Extraction Rules

1. Start from natural-language source material.
2. Compress aggressively.
3. Prefer 6-12 core characters in v1.
4. Keep only relationships that help a reader quickly understand the cast.
5. If the source is too large, drop minor nodes before adding more fields.

## Interaction Rules

The public viewer should keep only these core interactions:

- draggable force graph
- node size by importance
- group filtering
- click to inspect character details

Avoid adding extra panels unless the user explicitly asks.

## Public Demo Rules

If the user asks for a demo or open-source-safe example:

- prefer public works like `Dream of the Red Chamber`
- avoid personal/private novels
- avoid exposing writing preferences or local project traces

Before preparing a public repo or demo, scan for:

- absolute paths
- private titles
- private names
- internal prompts
- project-specific residue
