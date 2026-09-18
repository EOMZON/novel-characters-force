# Novel P0 Import + Review Candidate 验证回执

日期：2026-09-18  
业务 Issue：https://github.com/EOMZON/novel-characters-force/issues/2

## 1. Source / Target

```text
target = test@012c18f06ee364c48c9b4ae1d0a62079680be1e2
source = feat/zero-friction-import-review-20260918
observed source SHA before this receipt = 1976e3e9653d5d4fe706e8afc71577d1bed56a8d
source vs test = ahead 11 / behind 0
```

本回执自身会产生新的 source commit，因此 integration 时必须重新读回最终 source exact SHA。

## 2. Coherent set

本 candidate 当前包含：

```text
Source Input
→ SourceDocument normalization
→ Local Agent Bridge / Extraction boundary
→ Candidate JSON parser
→ Human Review
→ Normalized CharacterGraph
→ Existing Force Viewer Preview
→ graph-data.js export
```

关键文件：

- `product/index.html`
- `product/domain.js`
- `product/providers.js`
- `product/workbench.js`
- `product/preview.html`
- `product/style.css`
- `product/README.md`

架构：
https://github.com/EOMZON/novel-characters-force/blob/feat/zero-friction-import-review-20260918/docs/architecture/2026-09-18-novel-current-vs-ideal-architecture.md

ToDo：
https://github.com/EOMZON/novel-characters-force/blob/feat/zero-friction-import-review-20260918/docs/plan/2026-09-18-novel-mainline-todolist.md

## 3. 已验证

### 3.1 GitHub tree readback

PASS。

GitHub Contents / compare 已实际读回：

- product 目录所有文件存在；
- architecture / handoff / todo 存在；
- source 对 target 没有 behind；
- old viewer 文件未被修改。

### 3.2 JavaScript syntax

隔离环境执行：

```text
node --check product/domain.js       PASS
node --check product/providers.js    PASS
node --check product/workbench.js    PASS
```

### 3.3 Domain / Provider smoke

使用公开安全 example candidate 执行：

```text
SourceDocument
→ Agent prompt
→ normalizeCandidate
→ buildCharacterGraph
→ graph-data.js
```

结果：

```json
{
  "promptChars": 855,
  "nodes": 3,
  "links": 3,
  "groups": 3,
  "exportChars": 1625
}
```

PASS。

已证明：
- prompt 包含 source；
- candidate 可规范化；
- relation endpoint 可校验；
- normalized graph 可生成；
- graph-data.js 可导出。

### 3.4 Static visual render

已使用当前产品 HTML/CSS 做静态视觉渲染。

用途：
- 检查布局层级；
- 检查三步工作台结构；
- 检查 CSS 基本渲染。

**它不是 browser interaction E2E，不替代下面的 Browser Gate。**

## 4. 当前环境未能验证

### Browser Gate — BLOCKED BY ENVIRONMENT

当前云容器的浏览器策略对：

```text
file://
http://127.0.0.1
```

均返回：

```text
ERR_BLOCKED_BY_ADMINISTRATOR
```

Raw Chromium 也无法形成可审计交互回执。

因此当前明确：

```text
STATIC_VERIFIED = YES
DOMAIN_SMOKE = YES
BROWSER_VERIFIED = NO
```

不得把静态 render 冒充：

- file:// smoke；
- localhost smoke；
- load-example interaction；
- Review interaction；
- iframe viewer preview；
- download graph-data.js；
- existing demo regression。

## 5. Integration 前必须补的 Gate

在 source → test 前至少完成：

- [ ] `product/index.html` localhost 打开；
- [ ] Paste → Generate Prompt；
- [ ] TXT / Markdown FileReader；
- [ ] Load Example；
- [ ] Candidate Review；
- [ ] enable / disable 人物；
- [ ] relation edit；
- [ ] Build Graph；
- [ ] preview iframe 成功复用 existing viewer；
- [ ] graph-data.js export；
- [ ] old `demo/` regression；
- [ ] screenshot receipt。

如果测试发现问题，只修 feature，不直接写共享 test。

## 6. 当前状态

```text
SOURCE_SAVED = YES
STATIC_VERIFIED = YES
DOMAIN_SMOKE = PASS
BROWSER_VERIFIED = NO
MERGED_TO_TEST = NO
SEMANTICALLY_RECONCILED_ON_TEST = NO
CONSUMER_UPDATED = NO
```

因此当前只适合：

```text
Draft PR → Browser Gate → Fix if needed → Source Delivery Manifest
→ merge test → semantic reconciliation → exact target verify
```

不授权 `test → main`，不 deploy。

## 7. Worktree / Merge 治理

必须遵循：

https://github.com/EOMZON/codex-skills-private/blob/9a8e385ccc98f068b0990133f9a2e80681ffa9ec/github-ops/references/test-main-governance.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/merge-reconciliation.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/post-merge-synchronization.md
