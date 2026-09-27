
# 2026-09-28 主线复核：Novel Characters Force

## 原始目标

XHS 的核心价值：

~~~text
小说 / 长文本
→ 快速理解人物关系
→ 可拖拽 / 筛选的关系图
→ 降低阅读 / 创作复杂度
~~~

已观察信号：
- 小说怎么导入
- 怎么用
- 如果能把情节显示出来更好
- 感觉更乱了

## 当前 Git 真值

~~~text
main = 670792cf23ce87d1987f51c16d32b746e92feaf9
test = 012c18f06ee364c48c9b4ae1d0a62079680be1e2
feature = 4d1fc0a9809a8d9b183e5a4a854f6c2fea4dfa9f
~~~

9/18 后没有新的业务代码推进：

~~~text
feature → test = NO
test → main = NO
browser Gate = NO
~~~

## P0 当前实现

~~~mermaid
flowchart LR
    Source[Paste / TXT / Markdown] --> Normalize[SourceDocument]
    Normalize --> Provider[Local Agent Bridge]
    Provider --> Candidate[Extraction Candidate]
    Candidate --> Review[Human Review]
    Review --> Graph[Normalized CharacterGraph]
    Graph --> Viewer[Existing Force Viewer]
    Graph --> Export[graph-data.js]
~~~

已经有：
- Paste / TXT / Markdown
- source normalization
- Local Agent Bridge
- candidate JSON
- character/relation review
- normalized graph
- existing viewer preview
- graph-data.js export
- UI/domain/provider 分离

## P0 未完成

Browser Gate 仍未完成：
- localhost E2E
- file smoke
- TXT/Markdown real FileReader
- candidate review browser evidence
- preview iframe evidence
- export download evidence
- existing demo regression
- screenshot receipt

当前：

~~~text
STATIC_VERIFIED = YES
DOMAIN_SMOKE = PASS
BROWSER_VERIFIED = NO
MERGED_TO_TEST = NO
~~~

## P1 Density

Issue #3：

~~~mermaid
flowchart LR
    Graph[CharacterGraph] --> Selector[GraphFocusSelector]
    Selector --> VM[GraphViewModel]
    VM --> Viewer[CharacterGraphViewer]
    Selector --> Search[Search]
    Selector --> Hop1[1-hop]
    Selector --> Hop2[2-hop]
    Selector --> Threshold[Relation Threshold]
    Selector --> Collapse[Minor Character Collapse]
~~~

目的不是装饰，而是解决 XHS 已出现的“感觉更乱了”。

## P2 Timeline

Issue #4 保持 sibling module：

~~~mermaid
flowchart TB
    Source[Shared Source]
    Source --> Characters[Character Extraction]
    Source --> Events[Event Extraction]
    Characters --> Graph[Character Graph]
    Events --> Timeline[Timeline]
    Graph --- IDs[characterId / sourceAnchor]
    Timeline --- IDs
~~~

不要把 Timeline 塞进 CharacterGraph v1。

## P1 One-click Provider

Issue #7：

~~~text
SourceDocument
→ ExtractionProvider
→ ExtractionCandidate
~~~

可以是 hosted backend / connected agent / local service。

禁止浏览器保存第三方 API key，禁止 provider payload 直达 renderer。

## 原始目标 → 当前差距

| 能力 | 当前 | 理想 |
|---|---|---|
| 关系图 engine | 已完成 | 稳定 |
| 导入 | candidate 已实现 | 普通用户无需理解 Skill |
| AI extraction | Agent Bridge | one-click provider |
| Human Review | 已有 | 更低摩擦 |
| Density | 未做 | Focus / 1-hop / 2-hop |
| Timeline | 未做 | sibling module |
| Public Try | 未形成 | 1 分钟得到自己的图 |
| OSS | 已有 | public-safe example + local-first |
| Hosted product | 未有 | 后续验证 |
| XHS 回流 | 未进行 | 实际用户反馈 |

## 当前唯一主线

~~~text
Browser Gate
→ feature → test
→ exact target verification
→ #3 Density
→ real user / XHS feedback
→ #7 Provider / #4 Timeline
~~~

## 非目标

- 完整小说 OS
- chapter DB
- worldbuilding
- scene planner
- collaboration
- payment
- Timeline 先于 P0
- Provider 先于 graph contract 稳定

## 相关 Issues

- 主线：https://github.com/EOMZON/novel-characters-force/issues/1
- P0：https://github.com/EOMZON/novel-characters-force/issues/2
- Density：https://github.com/EOMZON/novel-characters-force/issues/3
- Timeline：https://github.com/EOMZON/novel-characters-force/issues/4
- Provider：https://github.com/EOMZON/novel-characters-force/issues/7
- Draft：https://github.com/EOMZON/novel-characters-force/pull/6
