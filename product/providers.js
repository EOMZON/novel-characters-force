(function () {
  "use strict";

  var MAX_SOURCE_CHARS = 12000;

  function buildAgentPrompt(sourceDocument) {
    if (!sourceDocument || !sourceDocument.text) throw new Error("source document missing");
    if (sourceDocument.text.length > MAX_SOURCE_CHARS) {
      throw new Error("P0 首版建议输入不超过 " + MAX_SOURCE_CHARS + " 字符；请先选取人物密集片段");
    }

    var schema = [
      "{",
      '  "title": "作品标题",',
      '  "subtitle": "可选的一句话上下文",',
      '  "characters": [',
      "    {",
      '      "id": "stable_id",',
      '      "label": "人物名",',
      '      "aliases": ["别名"],',
      '      "role": "角色定位",',
      '      "weight": 1,',
      '      "groups": ["主线"],',
      '      "summary": ["1-2 条短简介"],',
      '      "sourceAnchors": [{"location":"章节/段落","excerpt":"短证据"}]',
      "    }",
      "  ],",
      '  "relations": [',
      "    {",
      '      "from": "stable_id",',
      '      "to": "stable_id",',
      '      "label": "关系",',
      '      "weight": 1,',
      '      "sourceAnchors": [{"location":"章节/段落","excerpt":"短证据"}]',
      "    }",
      "  ]",
      "}"
    ].join("\n");

    return [
      "你是人物关系抽取器。不要写小说，不做心理诊断，只把给定文本压缩成可校对的人物关系候选。",
      "",
      "要求：",
      "1. 优先 6–12 个核心人物；人物太多时删次要角色。",
      "2. 优先 8–20 条读者能快速识别的关键关系。",
      "3. weight 使用 1–5，表示叙事重要性，不是道德评价。",
      "4. aliases 只放文本中真实出现或高度确定的别名。",
      "5. 每个重要人物/关系尽量给短 sourceAnchors，便于人工复核。",
      "6. 不要输出 Markdown 解释，只输出一个 JSON object。",
      "7. relation.from / relation.to 必须引用 characters[].id。",
      "",
      "JSON schema：",
      schema,
      "",
      "作品：" + sourceDocument.title,
      "输入格式：" + sourceDocument.format,
      "",
      "原文开始",
      "<<<",
      sourceDocument.text,
      ">>>",
      "原文结束"
    ].join("\n");
  }

  function stripFence(raw) {
    var value = String(raw == null ? "" : raw).trim();
    var fence = String.fromCharCode(96, 96, 96);
    if (value.indexOf(fence) === 0) {
      value = value.slice(fence.length).trim();
      if (value.toLowerCase().indexOf("json") === 0) value = value.slice(4).trim();
      if (value.slice(-fence.length) === fence) value = value.slice(0, -fence.length).trim();
    }
    var first = value.indexOf("{");
    var last = value.lastIndexOf("}");
    if (first !== -1 && last > first) value = value.slice(first, last + 1);
    return value;
  }

  function parseAgentResponse(raw) {
    var jsonText = stripFence(raw);
    if (!jsonText) throw new Error("请粘贴 Agent 返回的 JSON");
    var parsed = JSON.parse(jsonText);
    return window.NovelGraphDomain.normalizeCandidate(parsed);
  }

  function publicExample() {
    return {
      title: "红楼梦 · 公开示例候选",
      subtitle: "用于验证 Import → Review → Viewer 产品链路",
      characters: [
        {
          id: "jia_baoyu",
          label: "贾宝玉",
          aliases: ["宝玉"],
          role: "核心人物",
          weight: 5,
          groups: ["核心关系", "贾府"],
          summary: ["荣国府核心年轻人物。"],
          sourceAnchors: [{ location: "公开示例", excerpt: "公开安全示例，不来自私人文本。" }]
        },
        {
          id: "lin_daiyu",
          label: "林黛玉",
          aliases: ["黛玉"],
          role: "核心人物",
          weight: 5,
          groups: ["核心关系"],
          summary: ["与宝玉形成重要情感关系。"],
          sourceAnchors: [{ location: "公开示例", excerpt: "公开安全示例。" }]
        },
        {
          id: "xue_baochai",
          label: "薛宝钗",
          aliases: ["宝钗"],
          role: "核心人物",
          weight: 5,
          groups: ["核心关系", "薛家"],
          summary: ["与宝玉、黛玉共同构成关键关系线。"],
          sourceAnchors: [{ location: "公开示例", excerpt: "公开安全示例。" }]
        }
      ],
      relations: [
        { from: "jia_baoyu", to: "lin_daiyu", label: "深厚情感", weight: 5 },
        { from: "jia_baoyu", to: "xue_baochai", label: "婚姻与家族关系线", weight: 4 },
        { from: "lin_daiyu", to: "xue_baochai", label: "复杂对照关系", weight: 3 }
      ]
    };
  }

  window.NovelGraphProviders = {
    MAX_SOURCE_CHARS: MAX_SOURCE_CHARS,
    buildAgentPrompt: buildAgentPrompt,
    parseAgentResponse: parseAgentResponse,
    publicExample: publicExample
  };
})();