# Novel P0 Import + Review 执行索引

更新：2026-09-18 晚间

## 1. Canonical issues / PR

Mainline：
https://github.com/EOMZON/novel-characters-force/issues/1

P0：
https://github.com/EOMZON/novel-characters-force/issues/2

P0 Draft PR：
https://github.com/EOMZON/novel-characters-force/pull/6

One-click Provider：
https://github.com/EOMZON/novel-characters-force/issues/7

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

Verification：
https://github.com/EOMZON/novel-characters-force/blob/feat/zero-friction-import-review-20260918/docs/verification/2026-09-18-novel-p0-import-review-candidate-verification.md

Product：
https://github.com/EOMZON/novel-characters-force/tree/feat/zero-friction-import-review-20260918/product

## 3. Git baseline

```text
main = 670792cf23ce87d1987f51c16d32b746e92feaf9
test = 012c18f06ee364c48c9b4ae1d0a62079680be1e2
feature = feat/zero-friction-import-review-20260918
verified candidate before this handoff refresh = b89a0108f38f16decc3f4338c846bbb76f28cf86
```

本 Handoff 自身更新会推进 feature HEAD；执行时必须重新 live readback 当前 source exact SHA。

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

当前已经实现：

```text
Paste / TXT / Markdown
→ Local Agent Bridge Prompt
→ Candidate JSON
→ Character / Relation Review
→ Normalized CharacterGraph
→ Existing Force Viewer Preview
→ graph-data.js export
```

不要拆多个 writer 修改同一 graph contract / viewer boundary。

## 5. Provider 策略

当前 P0：

```text
Local Agent Bridge
```

即：
- 文本先在浏览器本地；
- 生成抽取 prompt；
- 用户主动把 prompt 交给 Agent；
- 把 Candidate JSON 粘回 workbench；
- UI/domain 不绑定模型供应商；
- 浏览器不保存第三方 API key。

未来 One-click provider：
https://github.com/EOMZON/novel-characters-force/issues/7

它 BLOCKED ON #2。

不得把 mock / heuristic 冒充真实 AI。

## 6. 已完成验证

- GitHub tree readback：PASS
- feature vs test：source ahead / behind 已确认
- JS syntax：PASS
- domain/provider smoke：PASS
- public-safe example → normalized graph：3 nodes / 3 links
- graph-data.js export：PASS
- static visual render：PASS

当前明确：

```text
SOURCE_SAVED = YES
STATIC_VERIFIED = YES
DOMAIN_SMOKE = PASS
BROWSER_VERIFIED = NO
MERGED_TO_TEST = NO
```

## 7. 为什么 Browser Gate 还没完成

当前云容器对：

```text
file://
http://127.0.0.1
```

浏览器导航返回：

```text
ERR_BLOCKED_BY_ADMINISTRATOR
```

因此没有把静态渲染冒充 E2E。

## 8. 本机 / 可浏览器环境 Browser Gate

这是与 Nutrition 完全解耦的**只读 reviewer 任务**。

### 8.1 先读回 Git

不要直接假设 branch 没移动：

```text
origin/main
origin/test
origin/feat/zero-friction-import-review-20260918
PR #6 head
dirty / worktree / active writer
```

如果 feature 在验证后移动，重新从新 exact SHA 验证。

### 8.2 不创建第二 writer

优先：
- 复用现有 repo；
- reviewer 只读；
- 如果发现 bug，再由当前 feature writer 修。

不要为了浏览器测试创建另一个长期 feature 分支。

### 8.3 启动

仓库如果本机已有，先确认真实路径；不要根据聊天历史盲目假设。

在 source exact SHA 上：

```bash
python3 -m http.server 8000
```

打开：

```text
http://127.0.0.1:8000/product/
```

同时回归：

```text
http://127.0.0.1:8000/demo/
```

### 8.4 必测

- [ ] 页面完整加载
- [ ] Paste source
- [ ] 生成 Agent prompt
- [ ] TXT FileReader
- [ ] Markdown FileReader
- [ ] Load public example
- [ ] Candidate JSON import
- [ ] Character enable/disable
- [ ] character label / aliases / role / groups / weight
- [ ] Relation enable/disable
- [ ] relation from/to / label / weight
- [ ] source anchor 可见
- [ ] Build Graph
- [ ] preview iframe 显示 existing force viewer
- [ ] group filter / drag / detail 没回归
- [ ] Copy graph-data.js
- [ ] Download graph-data.js
- [ ] old demo 正常
- [ ] responsive 基本可用
- [ ] console 无关键 error

### 8.5 Screenshot receipt

至少保存：

1. Step 1 输入态；
2. Step 2 Candidate Review；
3. Step 3 Graph Preview；
4. old demo regression。

可以上传公开安全 example 的截图；不要上传私人小说正文。

## 9. Browser Gate 结果

如果 PASS：

```text
BROWSER_VERIFIED = YES
```

回写：
- #2
- PR #6
- verification doc / receipt

然后才进入 Source Delivery Manifest / feature→test integration。

如果 FAIL：

- 精确记录 browser / route / console / reproduction；
- 新产品 bug 属于 #2，直接修当前 feature；
- 完全独立的新问题才创建新 Issue；
- 不直接改 test。

## 10. Integration Gate

feature 退出前记录：

- source branch / exact SHA
- exact test SHA
- owned paths
- required files
- required symbols
- required behavior
- required smoke
- consumer = product workbench + existing demo

合入 test 后必须：

```text
MERGED
→ SEMANTICALLY_RECONCILED
→ TARGET_VERIFIED
→ CONSUMER_UPDATED / explicit consumer state
```

至少重新验证：
- old demo
- new workbench
- preview
- export
- file:// / localhost

未授权不 test→main / deploy。

## 11. Git governance

https://github.com/EOMZON/codex-skills-private/blob/9a8e385ccc98f068b0990133f9a2e80681ffa9ec/github-ops/references/test-main-governance.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/SKILL.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/merge-reconciliation.md

https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/post-merge-synchronization.md
