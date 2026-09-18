# Novel P0 Import + Review 执行索引

## 1. Canonical issues

Mainline：
https://github.com/EOMZON/novel-characters-force/issues/1

P0：
https://github.com/EOMZON/novel-characters-force/issues/2

P1 Density：
https://github.com/EOMZON/novel-characters-force/issues/3

P2 Timeline：
https://github.com/EOMZON/novel-characters-force/issues/4

## 2. Product docs

Roadmap：
https://github.com/EOMZON/novel-characters-force/blob/test/docs/roadmap/2026-09-18-xhs-validated-productization-mainline.md

Architecture：
https://github.com/EOMZON/novel-characters-force/blob/feat/zero-friction-import-review-20260918/docs/architecture/2026-09-18-novel-current-vs-ideal-architecture.md

ToDo：
https://github.com/EOMZON/novel-characters-force/blob/feat/zero-friction-import-review-20260918/docs/plan/2026-09-18-novel-mainline-todolist.md

## 3. Git baseline

```text
main = 670792cf23ce87d1987f51c16d32b746e92feaf9
test = 012c18f06ee364c48c9b4ae1d0a62079680be1e2
feature = feat/zero-friction-import-review-20260918
```

## 4. P0 coherent set

同一个 writer 负责：

```text
Source
→ Import
→ ExtractionProvider
→ Candidate
→ Review
→ Normalized Graph
→ Existing Viewer
→ Export
```

不要拆多个 writer 修改同一 graph contract / viewer boundary。

## 5. 当前 Provider 策略

第一阶段：

```text
Local Agent Bridge
```

即：
- 本地准备抽取 prompt
- 用户明确把文本交给 Agent
- 将 Agent JSON response 导回 workbench
- 浏览器不保存第三方 API key

未来 Hosted provider 通过同一 adapter 接入。

不得把 mock / heuristic 冒充真实 AI。

## 6. Git governance

https://github.com/EOMZON/codex-skills-private/blob/9a8e385ccc98f068b0990133f9a2e80681ffa9ec/github-ops/references/test-main-governance.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/merge-reconciliation.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/post-merge-synchronization.md

## 7. Integration Gate

feature 退出前至少记录：
- source branch / SHA
- exact test SHA
- owned paths
- required files
- required symbols
- required behavior
- required smoke
- consumer = product workbench + existing demo

合入 test 后必须重新验证：
- old demo
- new workbench
- preview
- export
- file:// / localhost

未授权不 test→main / deploy。
