(function () {
  "use strict";

  var Domain = window.NovelGraphDomain;
  var Providers = window.NovelGraphProviders;

  var state = { source: null, candidate: null, graph: null };
  var ids = [
    "source-title","source-text","source-file","prepare-prompt","source-meta",
    "agent-prompt","copy-prompt","load-example","candidate-json","import-candidate",
    "review-empty","review-panel","character-count","relation-count",
    "character-list","relation-list","build-graph","download-data","copy-data",
    "graph-summary","graph-warning","graph-preview","app-status"
  ];
  var el = {};
  ids.forEach(function (id) { el[id] = document.getElementById(id); });

  function status(message, isError) {
    el["app-status"].textContent = (isError ? "Error · " : "Ready · ") + message;
    el["app-status"].classList.toggle("is-error", Boolean(isError));
  }

  function updateSourceMeta() {
    var length = el["source-text"].value.length;
    if (!length) {
      el["source-meta"].textContent = "尚未输入文本";
      return;
    }
    el["source-meta"].textContent =
      length.toLocaleString() + " 字符" +
      (length > Providers.MAX_SOURCE_CHARS ? " · 超过 P0 建议长度" : "");
  }

  function preparePrompt() {
    try {
      state.source = Domain.createSourceDocument({
        title: el["source-title"].value,
        text: el["source-text"].value,
        format: el["source-file"].files && el["source-file"].files.length ? "file" : "paste"
      });
      el["agent-prompt"].value = Providers.buildAgentPrompt(state.source);
      status("抽取提示词已生成；文本尚未自动发送到任何服务。");
    } catch (error) {
      status(error.message || String(error), true);
    }
  }

  function fallbackCopy(value, successMessage) {
    var area = document.createElement("textarea");
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    status(successMessage);
  }

  function copyText(value, successMessage) {
    if (!value) return status("没有可复制内容", true);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(function () {
        status(successMessage);
      }).catch(function () {
        fallbackCopy(value, successMessage);
      });
      return;
    }
    fallbackCopy(value, successMessage);
  }

  function importCandidate(candidate) {
    state.candidate = Domain.normalizeCandidate(candidate);
    state.graph = null;
    renderReview();
    el["build-graph"].disabled = false;
    el["download-data"].disabled = true;
    el["copy-data"].disabled = true;
    el["graph-summary"].textContent = "候选已导入，等待校对并生成图";
    el["graph-preview"].removeAttribute("src");
    status("Candidate 已进入人工校对层。");
  }

  function createInput(value) {
    var input = document.createElement("input");
    input.type = "text";
    input.value = value || "";
    return input;
  }

  function createNumberInput(value) {
    var input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.max = "5";
    input.value = String(value || 3);
    return input;
  }

  function labeled(label, control) {
    var wrap = document.createElement("label");
    wrap.className = "mini-field";
    var span = document.createElement("span");
    span.textContent = label;
    wrap.appendChild(span);
    wrap.appendChild(control);
    return wrap;
  }

  function characterSelect(selectedId) {
    var select = document.createElement("select");
    state.candidate.characters.forEach(function (character) {
      var option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.label;
      option.selected = character.id === selectedId;
      select.appendChild(option);
    });
    return select;
  }

  function renderReview() {
    var candidate = state.candidate;
    if (!candidate) return;

    el["review-empty"].hidden = true;
    el["review-panel"].hidden = false;
    el["character-list"].innerHTML = "";
    el["relation-list"].innerHTML = "";

    candidate.characters.forEach(function (character, index) {
      var card = document.createElement("div");
      card.className = "review-item";
      card.dataset.characterIndex = String(index);

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = character.enabled !== false;
      check.dataset.field = "enabled";

      var head = document.createElement("div");
      head.className = "review-item-head";
      var label = document.createElement("strong");
      label.textContent = character.label;
      head.appendChild(check);
      head.appendChild(label);
      card.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "mini-grid";

      var labelInput = createInput(character.label);
      labelInput.dataset.field = "label";
      grid.appendChild(labeled("人物名", labelInput));

      var aliasInput = createInput(character.aliases.join(", "));
      aliasInput.dataset.field = "aliases";
      grid.appendChild(labeled("别名", aliasInput));

      var roleInput = createInput(character.role);
      roleInput.dataset.field = "role";
      grid.appendChild(labeled("角色定位", roleInput));

      var groupInput = createInput(character.groups.join(", "));
      groupInput.dataset.field = "groups";
      grid.appendChild(labeled("分组", groupInput));

      var weightInput = createNumberInput(character.weight);
      weightInput.dataset.field = "weight";
      grid.appendChild(labeled("重要度 1–5", weightInput));

      card.appendChild(grid);

      if (character.sourceAnchors.length) {
        var anchor = document.createElement("p");
        anchor.className = "anchor";
        anchor.textContent =
          "证据：" +
          (character.sourceAnchors[0].location || "") +
          " " +
          (character.sourceAnchors[0].excerpt || "");
        card.appendChild(anchor);
      }

      el["character-list"].appendChild(card);
    });

    candidate.relations.forEach(function (relation, index) {
      var card = document.createElement("div");
      card.className = "review-item";
      card.dataset.relationIndex = String(index);

      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = relation.enabled !== false;
      check.dataset.field = "enabled";

      var head = document.createElement("div");
      head.className = "review-item-head";
      var label = document.createElement("strong");
      label.textContent = relation.label;
      head.appendChild(check);
      head.appendChild(label);
      card.appendChild(head);

      var grid = document.createElement("div");
      grid.className = "mini-grid";

      var fromSelect = characterSelect(relation.from);
      fromSelect.dataset.field = "from";
      grid.appendChild(labeled("From", fromSelect));

      var toSelect = characterSelect(relation.to);
      toSelect.dataset.field = "to";
      grid.appendChild(labeled("To", toSelect));

      var relationLabel = createInput(relation.label);
      relationLabel.dataset.field = "label";
      grid.appendChild(labeled("关系", relationLabel));

      var weightInput = createNumberInput(relation.weight);
      weightInput.dataset.field = "weight";
      grid.appendChild(labeled("强度 1–5", weightInput));

      card.appendChild(grid);

      if (relation.sourceAnchors.length) {
        var anchor = document.createElement("p");
        anchor.className = "anchor";
        anchor.textContent =
          "证据：" +
          (relation.sourceAnchors[0].location || "") +
          " " +
          (relation.sourceAnchors[0].excerpt || "");
        card.appendChild(anchor);
      }

      el["relation-list"].appendChild(card);
    });

    el["character-count"].textContent = String(candidate.characters.length) + " candidates";
    el["relation-count"].textContent = String(candidate.relations.length) + " candidates";
  }

  function syncReviewToState() {
    el["character-list"].querySelectorAll("[data-character-index]").forEach(function (card) {
      var item = state.candidate.characters[Number(card.dataset.characterIndex)];
      card.querySelectorAll("[data-field]").forEach(function (control) {
        var field = control.dataset.field;
        if (field === "enabled") item.enabled = control.checked;
        else if (field === "weight") item.weight = Number(control.value);
        else if (field === "aliases" || field === "groups") {
          item[field] = control.value
            .split(/[，,、]/)
            .map(function (value) { return value.trim(); })
            .filter(Boolean);
        } else {
          item[field] = control.value.trim();
        }
      });
    });

    el["relation-list"].querySelectorAll("[data-relation-index]").forEach(function (card) {
      var item = state.candidate.relations[Number(card.dataset.relationIndex)];
      card.querySelectorAll("[data-field]").forEach(function (control) {
        var field = control.dataset.field;
        if (field === "enabled") item.enabled = control.checked;
        else if (field === "weight") item.weight = Number(control.value);
        else item[field] = control.value.trim();
      });
    });
  }

  function buildGraph() {
    try {
      syncReviewToState();
      state.graph = Domain.buildCharacterGraph(state.candidate);

      var nodeCount = state.graph.nodes.length;
      var linkCount = state.graph.links.length;
      el["graph-summary"].textContent = nodeCount + " 人物 · " + linkCount + " 关系";
      el["graph-warning"].textContent =
        nodeCount > 12 || linkCount > 20
          ? "首版建议优先压缩到 6–12 人物、8–20 关系，避免“信息更多但更乱”。"
          : "规模在首版建议范围内。";

      el["download-data"].disabled = false;
      el["copy-data"].disabled = false;

      var payload = encodeURIComponent(JSON.stringify(state.graph));
      el["graph-preview"].src = "./preview.html#" + payload;
      status("Normalized graph 已生成，并交给现有 force viewer 预览。");
    } catch (error) {
      status(error.message || String(error), true);
    }
  }

  function graphDataText() {
    if (!state.graph) throw new Error("请先生成图");
    return Domain.toGraphDataJavaScript(state.graph);
  }

  function downloadGraphData() {
    try {
      var blob = new Blob([graphDataText()], { type: "text/javascript;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "graph-data.js";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      status("graph-data.js 已生成。");
    } catch (error) {
      status(error.message || String(error), true);
    }
  }

  el["source-text"].addEventListener("input", updateSourceMeta);

  el["source-file"].addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      el["source-text"].value = String(reader.result || "");
      if (!el["source-title"].value) {
        el["source-title"].value = file.name.replace(/\.(txt|md)$/i, "");
      }
      updateSourceMeta();
      status("已读取 " + file.name + "；文件内容仍停留在浏览器本地。");
    };
    reader.onerror = function () { status("文件读取失败", true); };
    reader.readAsText(file);
  });

  el["prepare-prompt"].addEventListener("click", preparePrompt);
  el["copy-prompt"].addEventListener("click", function () {
    copyText(el["agent-prompt"].value, "抽取提示词已复制。");
  });
  el["load-example"].addEventListener("click", function () {
    var example = Providers.publicExample();
    el["candidate-json"].value = JSON.stringify(example, null, 2);
    importCandidate(example);
  });
  el["import-candidate"].addEventListener("click", function () {
    try {
      importCandidate(Providers.parseAgentResponse(el["candidate-json"].value));
    } catch (error) {
      status(error.message || String(error), true);
    }
  });
  el["build-graph"].addEventListener("click", buildGraph);
  el["download-data"].addEventListener("click", downloadGraphData);
  el["copy-data"].addEventListener("click", function () {
    try {
      copyText(graphDataText(), "graph-data.js 内容已复制。");
    } catch (error) {
      status(error.message || String(error), true);
    }
  });

  updateSourceMeta();
})();