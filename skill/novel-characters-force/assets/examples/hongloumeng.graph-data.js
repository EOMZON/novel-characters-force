window.charactersForceGraph = {
  title: "《红楼梦》人物关系图",
  subtitle:
    "公开示例 · 核心 8 人版。用最小关系图展示情感主线、家族权力线与长辈网络。",
  groups: [
    { id: "core", label: "Core triangle" },
    { id: "elders", label: "Elders" },
    { id: "power", label: "Household power" },
    { id: "xue", label: "Xue family" },
    { id: "jia", label: "Jia household" }
  ],
  nodes: [
    {
      id: "jia_baoyu",
      label: "贾宝玉",
      shortLabel: "宝玉",
      role: "核心人物 / 情感中心",
      groups: ["core", "jia"],
      weight: 5,
      summary: [
        "贾府核心少年人物，是多条关系线交汇的中心。",
        "他与黛玉、宝钗的关系，构成最适合用图展示的情感三角。"
      ],
      relationsNote: [
        "与林黛玉的关系最具情感张力。",
        "与薛宝钗的关系则体现家族秩序和婚配期待。"
      ]
    },
    {
      id: "lin_daiyu",
      label: "林黛玉",
      shortLabel: "黛玉",
      role: "核心人物 / 情感主线",
      groups: ["core"],
      weight: 5,
      summary: [
        "才情敏锐、情感强烈，是宝玉最重要的心灵对应者。",
        "她与宝玉的关系最能体现人物图中“主线突出”的价值。"
      ],
      relationsNote: [
        "与宝玉形成作品最强的情感连线。",
        "与宝钗的对照关系，能帮助读者快速看懂人物结构。"
      ]
    },
    {
      id: "xue_baochai",
      label: "薛宝钗",
      shortLabel: "宝钗",
      role: "核心人物 / 家族秩序线",
      groups: ["core", "xue"],
      weight: 4,
      summary: [
        "稳重克制，是家族期待中的理想婚配对象。",
        "她把情感关系和家族秩序这两层结构连在一起。"
      ],
      relationsNote: [
        "与宝玉构成婚配期待线。",
        "与薛姨妈构成薛家内部支撑线。"
      ]
    },
    {
      id: "jia_mu",
      label: "贾母",
      shortLabel: "贾母",
      role: "长辈核心 / 家族最高权威",
      groups: ["elders", "jia"],
      weight: 4,
      summary: [
        "贾府长辈核心人物，许多关系在她这里获得承认或压制。",
        "她让人物图不只是情感图，还能看出权威结构。"
      ],
      relationsNote: [
        "她对宝玉、黛玉的偏爱，直接影响家中秩序。",
        "她与王夫人的关系体现家族内部权力层级。"
      ]
    },
    {
      id: "wang_fengjie",
      label: "王熙凤",
      shortLabel: "凤姐",
      role: "管家权力人物 / 事务中枢",
      groups: ["power", "jia"],
      weight: 4,
      summary: [
        "贾府事务执行中心，既管人也管事。",
        "她的存在让人物图能显示‘家庭治理’这条线。"
      ],
      relationsNote: [
        "与贾琏构成夫妻和权力搭档关系。",
        "与王夫人、贾母都存在明显的上下权力关系。"
      ]
    },
    {
      id: "jia_lian",
      label: "贾琏",
      shortLabel: "贾琏",
      role: "家族成员 / 凤姐对应人物",
      groups: ["power", "jia"],
      weight: 3,
      summary: [
        "与凤姐的夫妻关系，是家族事务线的重要支点。",
        "他可以帮助读者快速看懂‘主角群之外还有另一条家庭权力线’。"
      ],
      relationsNote: [
        "与凤姐的关系适合用图展示‘婚姻 + 权力’双重属性。"
      ]
    },
    {
      id: "wang_furen",
      label: "王夫人",
      shortLabel: "王夫人",
      role: "长辈人物 / 家族内政线",
      groups: ["elders", "jia"],
      weight: 3,
      summary: [
        "宝玉之母，是贾府内部秩序的重要执行者。",
        "她把长辈网络与宝玉主线连接起来。"
      ],
      relationsNote: [
        "与宝玉是母子关系。",
        "与凤姐存在明确的管理和调度关系。"
      ]
    },
    {
      id: "xue_yima",
      label: "薛姨妈",
      shortLabel: "薛姨妈",
      role: "薛家长辈 / 跨家族连接点",
      groups: ["elders", "xue"],
      weight: 3,
      summary: [
        "薛家长辈人物，是宝钗这条线稳定进入贾府关系网的重要节点。",
        "她能帮助读者看懂这不只是单一家族图，而是跨家族关系图。"
      ],
      relationsNote: [
        "与宝钗是母女关系。",
        "她使薛家与贾府的联系更直观。"
      ]
    }
  ],
  links: [
    { from: "jia_baoyu", to: "lin_daiyu", label: "知己 / 爱情主线", weight: 5 },
    { from: "jia_baoyu", to: "xue_baochai", label: "婚配期待 / 对照线", weight: 4 },
    { from: "lin_daiyu", to: "xue_baochai", label: "对照关系", weight: 3 },
    { from: "jia_baoyu", to: "jia_mu", label: "宠爱 / 祖孙", weight: 4 },
    { from: "jia_baoyu", to: "wang_furen", label: "母子", weight: 4 },
    { from: "jia_mu", to: "wang_furen", label: "长辈权威", weight: 3 },
    { from: "wang_furen", to: "wang_fengjie", label: "家务调度", weight: 3 },
    { from: "wang_fengjie", to: "jia_lian", label: "夫妻 / 权力搭档", weight: 4 },
    { from: "xue_baochai", to: "xue_yima", label: "母女", weight: 4 },
    { from: "xue_yima", to: "jia_mu", label: "亲族往来", weight: 2 },
    { from: "xue_baochai", to: "jia_mu", label: "长辈认可", weight: 2 },
    { from: "lin_daiyu", to: "jia_mu", label: "寄居 / 偏爱", weight: 3 }
  ]
};

