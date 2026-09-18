# 小红书验证后的小说人物关系图产品化主线

日期：2026-09-18  
仓库：`EOMZON/novel-characters-force`  
状态：产品化规划候选，尚未合入 `main`

## 1. 结论

当前仓库已经完成“小而可用”的人物关系图核心：静态 HTML、力导图拖拽、按重要性控制节点大小、分组筛选、人物详情、独立导出、Skill 化、公开《红楼梦》示例。

因此下一阶段不应重做 renderer，也不应扩张成完整写作操作系统。真正缺口是：

1. 普通用户无法低摩擦把自己的文本变成图；
2. 人物一多会出现“更乱”的信息密度问题；
3. 小红书评论明确要求情节/时间线，但 Timeline 应作为 sibling module，而不是污染 Character Graph schema；
4. 当前更像 engine / skill，还缺公开可体验的产品入口和真实用户回流。

推荐形态：

```text
Open-source core
  ├─ Character Graph renderer / schema / skill
  ├─ local-first static export
  └─ public safe demo

Hosted / product convenience
  ├─ Paste / TXT / Markdown import
  ├─ AI extraction
  ├─ human review
  ├─ graph focus / density control
  └─ optional Timeline sibling
```

## 2. 外部证据边界

小红书原帖当前只抓取到 17/56 条评论，因此只能把已观察到的评论作为方向性证据，不能外推为完整用户分布。

已观察到的强信号：

- “如果能把情节显示出来就更好了”；
- “小说怎么导入的呀”；
- “我就要找这种的，不过我是为了玩游戏”；
- “我想做英文单词关系图”；
- “怎么用的？”；
- “感觉更乱了”。

这些反馈共同说明：用户认可“结构化可视化”本身，但 adoption blocker 已从“有没有图”转向“怎么把内容放进去、怎么保持图仍然可读”。

## 3. 第一目标用户

### 3.1 产品化第一用户

优先：**拥有自己文本版权的长篇/群像小说创作者**。

理由：

- 可以反复导入、更新、校正，形成持续使用而不是一次性截图；
- Timeline 的长期价值更明确；
- 版权边界比“上传任意商业小说全文”清晰；
- 有项目保存、版本 diff、系列作品的未来付费空间。

### 3.2 开源用户

- 重度读者；
- Codex / Agent 用户；
- 本地优先用户；
- 想把结构化关系图嵌入自己工作流的开发者。

开源层继续保持 MIT / local-first，不强制云服务。

## 4. 产品主链

V1 不做“大而全编辑器”，只完成：

```text
Source Text
  ↓
Import Adapter
  ↓
Extraction Candidate
  ↓
Human Review
  ↓
Normalized Graph Data
  ↓
Graph ViewModel
  ↓
Character Graph Viewer
```

用户可见流程：

```text
粘贴正文 / 上传 TXT / Markdown
  → AI 提取人物与关系
  → 用户确认人物、别名、关系
  → 得到清晰关系图
  → 搜索 / Focus / 支线筛选
  → 导出静态 HTML
```

## 5. 架构边界：数据与 UI 分离

禁止把 AI 调用、文本解析、图谱归一化逻辑塞进 viewer 组件。

建议分层：

```text
source/
  RawTextSource
  TxtSource
  MarkdownSource

application/
  ImportStoryText
  ExtractCharacterCandidates
  ReviewExtraction
  BuildCharacterGraph

domain/
  Character
  CharacterAlias
  CharacterRelation
  CharacterGroup
  SourceAnchor
  CharacterGraph

infrastructure/
  ExtractionProvider
  LocalFileReader
  FutureHostedAIAdapter

presentation/
  ImportViewModel
  ReviewViewModel
  GraphViewModel
  ImportPanel
  ReviewPanel
  CharacterGraphViewer
```

### 5.1 Character Graph domain

保持现有图数据的“小 schema”原则，但未来归一化模型应能支持：

- stable `characterId`；
- aliases；
- source anchors；
- relation confidence / review state；
- visibility / importance；
- group ids。

Renderer 只消费 normalized view model，不直接理解模型响应。

### 5.2 Extraction Provider

必须是 adapter contract：

```ts
extractCharacters(source): ExtractionCandidate
```

不能让 UI 直接绑定某个模型供应商。

公共开源版允许：

- 用户自行通过 Agent/Skill 生成 candidate；
- 本地导入已经生成的 JSON / graph-data；
- Hosted 版未来再接服务端 AI。

不要把 API key 直接要求用户写进浏览器前端。

## 6. P0：Zero-friction Import + Review

这是下一阶段最重要的 coherent set。

### 必须做

- Paste 文本；
- TXT / Markdown；
- 解析状态；
- 候选人物；
- alias 合并；
- 候选关系；
- 人工勾选 / 修正；
- 生成 normalized graph；
- 导出静态 HTML。

### 第一版限制

- 先限制输入长度；
- 先面向一部作品；
- 默认 6–12 个核心人物；
- 默认 8–20 条关键关系；
- 过多人物时先裁剪，而不是无限增加节点。

### 非目标

- EPUB/PDF/OCR 全格式；
- 完整云同步；
- 多人协作；
- 自动长期记忆；
- 写作生成；
- 全量世界观数据库。

## 7. P1：信息密度治理

“感觉更乱了”不是视觉小问题，而是图产品的核心风险。

### 能力

- 搜索人物；
- Focus Mode；
- 只看一跳 / 两跳；
- 支线分组；
- 关系强度阈值；
- 次要人物折叠；
- 一键恢复全局；
- 当前 Focus 的明确视觉状态。

### 设计原则

Graph 的价值不是“显示最多”，而是“帮助用户快速理解当前关注的人物关系”。

信息密度 selector 与 renderer 分离：

```text
CharacterGraph
  → GraphFocusSelector
  → GraphViewModel
  → CharacterGraphViewer
```

viewer 不直接删除原始数据。

## 8. P2：Timeline sibling

评论中的“情节显示”是真实需求，但不能把 timeline payload 塞进 Character Graph v1 schema。

建议：

```text
Shared Source
  ├─ Character Extraction → Character Graph
  └─ Event Extraction → Timeline

Shared IDs
  characterId
  sourceAnchor
  eventId
```

Timeline 独立拥有：

- Event；
- Chapter / time marker；
- involvedCharacterIds；
- event relation；
- source anchor。

Graph 回答“谁和谁是什么关系”；Timeline 回答“什么时候发生了什么”。

以后可以双向联动，但保持 domain owner 独立。

## 9. Distribution：从 engine 到真实入口

当前仓库已有 demo，但仍偏开发者。

目标不是立刻收费，而是让小红书里问“怎么用”的用户可以：

1. 打开一个链接；
2. 先体验公共作品；
3. 进入 Try；
4. 粘贴自己的短文本；
5. 看候选提取 / demo 流程；
6. 获得图或明确提示本地 Skill 路径。

正式接 Hosted AI 前，可以先做安全的流程壳和本地/Agent handoff，不伪造“网页已经自动 AI 提取”。

## 10. 验收指标

### 首次价值

- 用户不阅读 README 也知道从哪里输入；
- 首次从文本到图的流程可解释；
- 错误人物/关系可以在生成图前修正；
- 不需要手写 `graph-data.js`。

### 可读性

- 默认核心人物图保持 6–12 人；
- 用户可以在 2 次操作内聚焦到某个人；
- Focus 时只显示相关关系；
- 不破坏完整原始 graph 数据。

### 开源边界

- 静态 viewer 仍支持 `file://`；
- 本地导出不依赖 Hosted 服务；
- 不上传私人小说作为公开 fixture；
- demo 继续使用公开安全内容。

## 11. Git / Worktree 治理硬门

统一遵循：

- Git governance：
  https://github.com/EOMZON/codex-skills-private/blob/9a8e385ccc98f068b0990133f9a2e80681ffa9ec/github-ops/references/test-main-governance.md
- Merge Reconciliation：
  https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/merge-reconciliation.md
- Post-Merge Synchronization：
  https://github.com/EOMZON/codex-skills-private/blob/main/worktree-audit/references/post-merge-synchronization.md
- Worktree P0：
  https://github.com/EOMZON/codex-skills-private/issues/29

任何后续实现都必须区分：

```text
SOURCE_SAVED
!= MERGED
!= SEMANTICALLY_RECONCILED
!= TARGET_VERIFIED
!= CONSUMER_UPDATED
```

### 本仓建议

- 当前没有必要为只读分析创建本地 worktree；
- 云端文档 / Issue 可以独立推进；
- 真正 P0 import coherent set 由一个 writer 负责；
- density reviewer / research 可以并行，但不能同时写同一 renderer target；
- source branch merge 后必须在 target exact SHA 复核 import contract、normalized graph、viewer、tests；
- 若未来有 Hosted consumer，还要单独 readback，不把 PR merged 当上线。

## 12. 推荐执行顺序

1. P0 Import + Review contract；
2. P0 最小 UI / local export；
3. P1 Focus / Density；
4. Public Try / distribution；
5. 获取真实用户数据；
6. 再决定是否做 Hosted project save；
7. Timeline sibling；
8. 最后才评估付费和协作。

## 13. 暂停项

在 P0 未完成前不要做：

- 完整小说 OS；
- Obsidian 专属系统；
- 复杂知识图谱数据库；
- 大规模协作；
- 付费体系；
- AI 自动写作；
- 角色心理/世界观无限扩字段。

当前唯一目标是：**让一个普通创作者把自己的文本低摩擦变成“清楚、可修正、可聚焦”的人物关系图。**
