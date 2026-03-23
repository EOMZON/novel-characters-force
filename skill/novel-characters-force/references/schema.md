# Schema

The public version of this skill uses a small graph schema on purpose.

## Graph Object

```js
window.charactersForceGraph = {
  title: "Dream of the Red Chamber",
  subtitle: "Optional short context.",
  hint: "Optional viewer hint.",
  meta: ["Static HTML", "File-safe data"],
  nodes: [],
  links: []
};
```

## Node

```js
{
  id: "jia_baoyu",
  label: "Jia Baoyu",
  shortLabel: "Baoyu",
  role: "Central protagonist",
  weight: 5,
  primary: true,
  groups: ["Jia household", "Inner circle"],
  summary: ["One or two short lines."],
  relationsNote: ["Optional extra notes."]
}
```

## Link

```js
{
  from: "jia_baoyu",
  to: "lin_daiyu",
  label: "deep emotional bond",
  weight: 5
}
```

## Practical Guidance

- Prefer 6-12 nodes for the first pass.
- Keep labels human-readable.
- Use `weight` to express importance, not moral judgment.
- Use `groups` for factions, branches, or side clusters.
- Keep `summary` short enough to read in a side panel.
- Keep links focused on relationships a reader can recognize quickly.

## Avoid In V1

- complex psych profiles
- writing-only arc notes
- timeline payloads
- worldbuilding payloads
- chapter databases

