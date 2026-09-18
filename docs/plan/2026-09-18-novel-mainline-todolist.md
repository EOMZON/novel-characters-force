# Novel Characters Force 主线 ToDo

更新：2026-09-18 晚间

## 当前 refs

```text
main = 670792cf23ce87d1987f51c16d32b746e92feaf9
test = 012c18f06ee364c48c9b4ae1d0a62079680be1e2
active feature = feat/zero-friction-import-review-20260918
feature head = 635440cfaf61230986a7dd8e2071e2fae447a41e
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
- [x] 一个 writer 维护 P0 coherent set
- [ ] Source Delivery Manifest（integration 前）
- [ ] target semantic reconciliation（integration 后）

### P0.2 Source

- [x] Paste UI
- [x] TXT input
- [x] Markdown input
- [x] input empty guard
- [x] 12,000 字符 P0 guard
- [x] SourceDocument normalization

### P0.3 Extraction boundary

- [x] Provider boundary 已独立于 UI
- [x] Local Agent Bridge prompt
- [x] Candidate JSON parser
- [x] candidate normalization
- [x] Future Hosted Provider 保留 adapter 位
- [x] 不在前端存 API key
- [ ] 真正 Hosted / one-click provider（独立后续问题，不在浏览器硬编码 key）

当前真实边界：

```text
Paste / TXT / MD
→ Local Agent Bridge Prompt
→ Agent JSON
→ Candidate Review
```

不把 Agent Bridge 冒充成“一键 Hosted AI”。

### P0.4 Human Review

- [x] Character enable/disable
- [x] label
- [x] aliases
- [x] role
- [x] weight
- [x] groups
- [x] relation enable/disable
- [x] from/to
- [x] relation label
- [x] relation weight
- [x] source anchor readback
- [ ] alias 真正 merge / ID reassignment UX（当前可编辑 aliases，但没有一键合并 duplicate node）

### P0.5 Normalize / viewer

- [x] Candidate → normalized CharacterGraph
- [x] dangling relation reject
- [x] 6–12 characters guidance
- [x] 8–20 relations guidance
- [x] existing force viewer preview bridge
- [x] 不重写 renderer
- [ ] browser-level preview smoke

### P0.6 Export

- [x] `graph-data.js` 生成
- [x] preview page
- [x] public-safe example candidate
- [ ] standalone scaffold 端到端浏览器验收

### P0.7 Verification

已完成：

- [x] feature tree readback：10 commits / 10 changed files
- [x] `domain.js` node --check
- [x] `providers.js` node --check
- [x] `workbench.js` node --check
- [x] domain/provider smoke：3 nodes / 3 links / export PASS
- [x] 静态 UI render 证据

受当前云容器浏览器策略阻断：

- [ ] file:// interactive smoke
- [ ] localhost interactive smoke
- [ ] load-example → review browser smoke
- [ ] existing viewer preview browser smoke
- [ ] export download browser smoke
- [ ] existing demo regression

说明：浏览器工具返回 `ERR_BLOCKED_BY_ADMINISTRATOR`，不将静态 render 冒充交互验收。

## P0.8 当前 candidate 状态

```text
SOURCE_SAVED = YES
SEMANTICALLY_REVIEWED = PARTIAL
STATIC_VERIFIED = YES
BROWSER_VERIFIED = NO
MERGED_TO_TEST = NO
CONSUMER_UPDATED = NO
```

因此当前 feature 只能进入 Draft PR / browser Gate，不能报告 P0 完成。

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
- [ ] “怎么用”问题是否明显减少

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

P0 最终不是“有 workbench 文件”，而是：

```text
普通用户
→ 输入文本
→ 得到候选
→ 校正
→ 看到清晰关系图
→ 导出
```

并且：
- 不手写 `graph-data.js`
- 不在浏览器暴露 API key
- existing demo 不回归
- feature → test semantic reconciliation 完整
- exact target verification 完成
