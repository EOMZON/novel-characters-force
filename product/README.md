# Product Workbench · P0

这是 `novel-characters-force` 从“开发者 skill / renderer”走向普通用户产品入口的第一阶段。

## 当前可做

```text
Paste / TXT / Markdown
→ 生成 Agent 抽取提示词
→ 导入 Candidate JSON
→ 人物 / 关系人工校对
→ Normalized CharacterGraph
→ 复用现有 Force Viewer 预览
→ 下载 graph-data.js
```

## 当前为什么不是一键 Hosted AI

当前公开仓没有授权后的 Hosted backend，也不应该要求用户在浏览器保存第三方 API Key。

因此第一阶段使用 Local Agent Bridge：

1. 文本先停留在浏览器本地；
2. 用户主动生成并复制抽取提示词；
3. 用户把提示词交给自己选择的 Agent；
4. 将 JSON 结果粘贴回 workbench；
5. 后续 UI / domain 不依赖具体模型供应商。

未来 Hosted adapter 应通过同一个 `ExtractionProvider` boundary 接入。

## 本地打开

可以直接双击 `product/index.html`。

也可以运行：

```bash
python3 -m http.server 8000
```

然后打开 `http://127.0.0.1:8000/product/`。

## 不变量

- 不上传私人小说作为公开 fixture；
- 不把 API key 写进前端；
- 不重写现有 force renderer；
- Candidate 必须经过 Human Review；
- Graph viewer 只消费 normalized graph；
- P0 不扩成完整小说 OS。

主线：https://github.com/EOMZON/novel-characters-force/issues/2
