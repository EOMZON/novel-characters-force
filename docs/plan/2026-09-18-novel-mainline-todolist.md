# Novel Characters Force 主线 ToDo

更新：2026-09-18

## 当前 refs

```text
main = 670792cf23ce87d1987f51c16d32b746e92feaf9
test = 012c18f06ee364c48c9b4ae1d0a62079680be1e2
active feature = feat/zero-friction-import-review-20260918
```

## P0 — Zero-friction Import + Review

Issue：
https://github.com/EOMZON/novel-characters-force/issues/2

### P0.1 Governance / architecture

- [x] 主线 roadmap
- [x] long-lived `test` 建立
- [x] feature branch 从 exact test SHA 建立
- [x] current vs ideal architecture
- [x] data / UI boundary
- [x] Provider boundary
- [ ] Source Delivery Manifest（integration 前）
- [ ] target semantic reconciliation（integration 后）

### P0.2 Source

- [ ] Paste
- [ ] TXT
- [ ] Markdown
- [ ] input length / empty guard
- [ ] SourceDocument normalization

### P0.3 Extraction boundary

- [ ] `ExtractionProvider` contract
- [ ] Local Agent Bridge prompt
- [ ] Candidate JSON parser
- [ ] candidate schema validation
- [ ] Future Hosted Provider 保留 adapter 位
- [ ] 不在前端存 API key

### P0.4 Human Review

- [ ] Character enable/disable
- [ ] label
- [ ] aliases
- [ ] role
- [ ] weight
- [ ] groups
- [ ] relation enable/disable
- [ ] from/to
- [ ] relation label
- [ ] relation weight
- [ ] source anchor

### P0.5 Normalize / viewer

- [ ] Candidate → normalized CharacterGraph
- [ ] dangling relation reject
- [ ] default 6–12 characters guidance
- [ ] default 8–20 relations guidance
- [ ] existing force viewer preview
- [ ] 不重写 renderer

### P0.6 Export

- [ ] `graph-data.js`
- [ ] preview URL / page
- [ ] scaffold handoff
- [ ] public-safe example

### P0.7 Verification

- [ ] static smoke
- [ ] file:// smoke
- [ ] localhost smoke
- [ ] existing demo regression
- [ ] candidate review regression
- [ ] export regression
- [ ] screenshot receipt

## P1 — Density / Focus

Issue：
https://github.com/EOMZON/novel-characters-force/issues/3

等待 P0 graph contract 稳定后实现：

- [ ] Search
- [ ] Focus
- [ ] 1-hop
- [ ] 2-hop
- [ ] relation threshold
- [ ] minor-character collapse
- [ ] reset
- [ ] selection/filter state visible

## P1 — Distribution

- [ ] public Try entry
- [ ] public demo → Try your text
- [ ] first-output time
- [ ] XHS 回流验证
- [ ] 真实用户“怎么用”问题是否消失

## P2 — Timeline sibling

Issue：
https://github.com/EOMZON/novel-characters-force/issues/4

Gate：
- P0 Import/Review 已真实可用
- P1 Density 已基本完成
- 有真实用户继续提出 Timeline

暂不实现：
- chapter DB
- worldbuilding OS
- scene planner
- series manager
- collaboration
- payment

## Definition of Done

第一阶段不是“完整小说软件”，而是：

```text
普通用户
→ 输入文本
→ 得到候选
→ 校正
→ 看到清晰关系图
→ 导出
```

不再需要手写 `graph-data.js`。
