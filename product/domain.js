(function () {
  "use strict";

  function text(value) {
    return String(value == null ? "" : value).trim();
  }

  function number(value, fallback, min, max) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) parsed = fallback;
    return Math.max(min, Math.min(max, parsed));
  }

  function list(value) {
    if (Array.isArray(value)) return value.map(text).filter(Boolean);
    if (typeof value === "string") {
      return value.split(/[，,、]/).map(text).filter(Boolean);
    }
    return [];
  }

  function makeId(prefix, index) {
    return prefix + "_" + String(index + 1);
  }

  function createSourceDocument(input) {
    var sourceText = text(input && input.text);
    if (!sourceText) throw new Error("请先输入小说文本");
    return {
      id: "source_local",
      title: text(input && input.title) || "未命名作品",
      format: text(input && input.format) || "paste",
      text: sourceText,
      charCount: sourceText.length
    };
  }

  function normalizeAnchor(anchor) {
    if (!anchor) return null;
    if (typeof anchor === "string") {
      return { excerpt: text(anchor) };
    }
    var excerpt = text(anchor.excerpt);
    var location = text(anchor.location);
    if (!excerpt && !location) return null;
    return { excerpt: excerpt, location: location };
  }

  function normalizeCandidate(raw) {
    if (!raw || typeof raw !== "object") throw new Error("Candidate 必须是 JSON object");

    var rawCharacters = Array.isArray(raw.characters) ? raw.characters : [];
    var rawRelations = Array.isArray(raw.relations) ? raw.relations : [];
    if (!rawCharacters.length) throw new Error("Candidate 至少需要 1 个 character");

    var usedIds = new Set();
    var characters = rawCharacters.map(function (item, index) {
      item = item || {};
      var preferredId = text(item.id) || makeId("character", index);
      var id = preferredId;
      var suffix = 2;
      while (usedIds.has(id)) {
        id = preferredId + "_" + suffix;
        suffix += 1;
      }
      usedIds.add(id);

      return {
        id: id,
        enabled: item.enabled !== false,
        label: text(item.label) || text(item.name) || ("人物 " + String(index + 1)),
        aliases: list(item.aliases),
        role: text(item.role),
        weight: number(item.weight, 3, 1, 5),
        groups: list(item.groups),
        summary: Array.isArray(item.summary)
          ? item.summary.map(text).filter(Boolean)
          : (text(item.summary) ? [text(item.summary)] : []),
        sourceAnchors: (Array.isArray(item.sourceAnchors) ? item.sourceAnchors : [item.sourceAnchor])
          .map(normalizeAnchor)
          .filter(Boolean)
      };
    });

    var characterIds = new Set(characters.map(function (item) { return item.id; }));

    var relations = rawRelations.map(function (item, index) {
      item = item || {};
      return {
        id: text(item.id) || makeId("relation", index),
        enabled: item.enabled !== false,
        from: text(item.from),
        to: text(item.to),
        label: text(item.label) || "关系",
        weight: number(item.weight, 3, 1, 5),
        sourceAnchors: (Array.isArray(item.sourceAnchors) ? item.sourceAnchors : [item.sourceAnchor])
          .map(normalizeAnchor)
          .filter(Boolean)
      };
    }).filter(function (item) {
      return item.from && item.to && characterIds.has(item.from) && characterIds.has(item.to) && item.from !== item.to;
    });

    return {
      title: text(raw.title) || "人物关系图",
      subtitle: text(raw.subtitle),
      characters: characters,
      relations: relations
    };
  }

  function buildRelationNotes(characterId, relations) {
    return relations.filter(function (item) {
      return item.from === characterId || item.to === characterId;
    }).map(function (item) {
      var other = item.from === characterId ? item.to : item.from;
      return item.label + " · " + other;
    });
  }

  function buildCharacterGraph(candidate) {
    var normalized = normalizeCandidate(candidate);
    var enabledCharacters = normalized.characters.filter(function (item) {
      return item.enabled !== false;
    });
    var enabledIds = new Set(enabledCharacters.map(function (item) { return item.id; }));

    var links = normalized.relations.filter(function (item) {
      return item.enabled !== false && enabledIds.has(item.from) && enabledIds.has(item.to);
    });

    var allGroupIds = [];
    enabledCharacters.forEach(function (item) {
      item.groups.forEach(function (groupId) {
        if (allGroupIds.indexOf(groupId) === -1) allGroupIds.push(groupId);
      });
    });

    var nodes = enabledCharacters.map(function (item) {
      return {
        id: item.id,
        label: item.label,
        shortLabel: item.label.length > 8 ? item.label.slice(0, 8) : item.label,
        role: item.role,
        weight: item.weight,
        groups: item.groups,
        summary: item.summary,
        relationsNote: buildRelationNotes(item.id, links)
      };
    });

    return {
      title: normalized.title,
      subtitle: normalized.subtitle || "由 Import + Review 工作台生成",
      groups: allGroupIds.map(function (id) { return { id: id, label: id }; }),
      nodes: nodes,
      links: links.map(function (item) {
        return {
          from: item.from,
          to: item.to,
          label: item.label,
          weight: item.weight
        };
      })
    };
  }

  function toGraphDataJavaScript(graph) {
    return "window.charactersForceGraph = " + JSON.stringify(graph, null, 2) + ";\n";
  }

  window.NovelGraphDomain = {
    createSourceDocument: createSourceDocument,
    normalizeCandidate: normalizeCandidate,
    buildCharacterGraph: buildCharacterGraph,
    toGraphDataJavaScript: toGraphDataJavaScript
  };
})();