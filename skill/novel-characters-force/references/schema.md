# Schema

The public version of this skill uses a small graph schema on purpose.

## Graph Object

```js
window.charactersForceGraph = {
  title: "Dream of the Red Chamber",
  subtitle: "Optional short context.",
  groups: [
    { id: "core", label: "Core line" },
    { id: "jia", label: "Jia household" }
  ],
  nodes: [],
  links: []
};
```

`groups` is recommended when you want readable filter labels.
If omitted, the viewer will infer group options from node `groups`.

## Node

```js
{
  id: "jia_baoyu",
  label: "Jia Baoyu",
  shortLabel: "Baoyu",
  role: "Central protagonist",
  weight: 5,
  groups: ["core", "jia"],
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
- Prefer 8-20 links for the first pass.
- Keep labels human-readable.
- Use `weight` to express importance, not moral judgment.
- Keep `weight` in the `1-5` range.
- Use `groups` for factions, branches, or side clusters.
- Keep `summary` short enough to read in a side panel.
- Keep links focused on relationships a reader can recognize quickly.

## Data Integrity Checks

- `id` must be unique across nodes.
- `links.from` and `links.to` must point to existing node ids.
- If top-level `groups` exists, each `node.groups` value should match one group `id`.
- Prefer trimming nodes before inventing extra schema fields.

## Avoid In V1

- complex psych profiles
- writing-only arc notes
- timeline payloads
- worldbuilding payloads
- chapter databases
