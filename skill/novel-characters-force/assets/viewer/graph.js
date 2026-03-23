(() => {
  const graphData = window.charactersForceGraph;
  if (!graphData) {
    throw new Error("window.charactersForceGraph is required");
  }

  const svg = document.getElementById("graph");
  const groupFilter = document.getElementById("group-filter");
  const spreadRange = document.getElementById("spread-range");
  const titleEl = document.getElementById("page-title");
  const subtitleEl = document.getElementById("page-subtitle");
  const detailEl = document.getElementById("detail");
  const detailName = document.getElementById("detail-name");
  const detailRole = document.getElementById("detail-role");
  const detailSummary = document.getElementById("detail-summary");
  const detailRelations = document.getElementById("detail-relations");

  const width = 1200;
  const height = 760;
  const nodes = (graphData.nodes || []).map((node) => ({
    ...node,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0
  }));
  const links = (graphData.links || []).map((link) => ({
    ...link,
    weight: typeof link.weight === "number" ? link.weight : 3
  }));

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const groups = Array.isArray(graphData.groups) ? graphData.groups : [];
  const groupOptions = [{ id: "all", label: "All branches" }, ...groups];
  let selectedNodeId = null;
  let activeGroup = "all";
  let spread = Number(spreadRange?.value || 82) / 100;
  let raf = null;
  const initialSelectedId = new URLSearchParams(window.location.search).get("select");

  if (titleEl) titleEl.textContent = graphData.title || "人物关系图";
  if (subtitleEl) subtitleEl.textContent = graphData.subtitle || "";

  function addParagraphs(container, items) {
    container.innerHTML = "";
    const list = Array.isArray(items) ? items : [];
    if (!list.length) {
      const p = document.createElement("p");
      p.textContent = "No content";
      container.appendChild(p);
      return;
    }
    list.forEach((item) => {
      const p = document.createElement("p");
      p.textContent = item;
      container.appendChild(p);
    });
  }

  function showDetail(node) {
    selectedNodeId = node.id;
    detailEl.classList.remove("detail--empty");
    const empty = detailEl.querySelector(".detail-empty");
    if (empty) empty.style.display = "none";
    if (detailName) detailName.textContent = node.label;
    if (detailRole) detailRole.textContent = node.role || "";
    if (detailSummary) addParagraphs(detailSummary, node.summary || []);
    if (detailRelations) addParagraphs(detailRelations, node.relationsNote || []);
    render();
  }

  function nodeGroups(node) {
    if (Array.isArray(node.groups)) return node.groups.filter(Boolean);
    if (typeof node.group === "string" && node.group) return [node.group];
    return [];
  }

  function buildGroupOptions() {
    groupOptions.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.label;
      groupFilter.appendChild(option);
    });
  }

  function isNodeVisible(node) {
    return activeGroup === "all" || nodeGroups(node).includes(activeGroup);
  }

  function isLinkVisible(link) {
    const from = nodeById.get(link.from);
    const to = nodeById.get(link.to);
    if (!from || !to) return false;
    return isNodeVisible(from) && isNodeVisible(to);
  }

  function initPositions() {
    const cx = width / 2;
    const cy = height / 2;
    const ordered = [...nodes].sort((a, b) => (b.weight || 0) - (a.weight || 0));
    const center = ordered[0];
    if (center) {
      center.x = cx;
      center.y = cy;
    }

    const others = ordered.slice(1);
    const radius = Math.min(width, height) * 0.38;
    const step = (Math.PI * 2) / Math.max(others.length, 1);
    others.forEach((node, index) => {
      const angle = step * index - Math.PI / 2;
      node.x = cx + Math.cos(angle) * radius;
      node.y = cy + Math.sin(angle) * radius;
    });
  }

  function clamp(node) {
    const pad = 42;
    node.x = Math.max(pad, Math.min(width - pad, node.x));
    node.y = Math.max(pad, Math.min(height - pad, node.y));
  }

  function centerVisibleNodes(visibleNodes) {
    if (!visibleNodes.length) return;
    const avgX = visibleNodes.reduce((sum, node) => sum + node.x, 0) / visibleNodes.length;
    const avgY = visibleNodes.reduce((sum, node) => sum + node.y, 0) / visibleNodes.length;
    const shiftX = width / 2 - avgX;
    const shiftY = height / 2 - avgY;
    visibleNodes.forEach((node) => {
      node.x += shiftX;
      node.y += shiftY;
      clamp(node);
    });
  }

  function tick() {
    const cx = width / 2;
    const cy = height / 2;
    const visibleNodes = nodes.filter(isNodeVisible);
    const visibleLinks = links.filter(isLinkVisible);

    visibleNodes.forEach((node) => {
      node.vx += (cx - node.x) * 0.0008 * spread;
      node.vy += (cy - node.y) * 0.0008 * spread;
    });

    visibleLinks.forEach((link) => {
      const from = nodeById.get(link.from);
      const to = nodeById.get(link.to);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const target = 190 + (5 - Math.min(from.weight || 3, to.weight || 3)) * 18;
      const force = (dist - target) * 0.0009;
      const fx = dx * force;
      const fy = dy * force;
      from.vx += fx;
      from.vy += fy;
      to.vx -= fx;
      to.vy -= fy;
    });

    for (let i = 0; i < visibleNodes.length; i += 1) {
      for (let j = i + 1; j < visibleNodes.length; j += 1) {
        const a = visibleNodes[i];
        const b = visibleNodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const ux = dx / dist;
        const uy = dy / dist;
        const softRepel = (125 * spread) / dist;
        a.vx -= ux * softRepel;
        a.vy -= uy * softRepel;
        b.vx += ux * softRepel;
        b.vy += uy * softRepel;
        const minDist = 78 + (a.weight + b.weight) * 9;
        if (dist < minDist) {
          const repel = (minDist - dist) * 0.0055;
          const fx = ux * repel;
          const fy = uy * repel;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }
    }

    visibleNodes.forEach((node) => {
      if (node.dragging) return;
      node.vx *= 0.92;
      node.vy *= 0.92;
      node.x += node.vx;
      node.y += node.vy;
      clamp(node);
    });

    centerVisibleNodes(visibleNodes);
    render();
    raf = requestAnimationFrame(tick);
  }

  function render() {
    svg.innerHTML = "";

    links.forEach((link) => {
      if (!isLinkVisible(link)) return;
      const from = nodeById.get(link.from);
      const to = nodeById.get(link.to);
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", from.x);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x);
      line.setAttribute("y2", to.y);
      line.setAttribute("class", selectedNodeId && (selectedNodeId === from.id || selectedNodeId === to.id) ? "edge edge--active" : "edge");
      line.setAttribute("stroke-width", String(0.8 + link.weight * 0.32));
      svg.appendChild(line);

      const showLabel =
        Boolean(selectedNodeId) &&
        (selectedNodeId === from.id || selectedNodeId === to.id);

      if (link.label && showLabel) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", String((from.x + to.x) / 2));
        label.setAttribute("y", String((from.y + to.y) / 2));
        label.setAttribute("class", "edge-label edge-label--active");
        label.textContent = link.label;
        svg.appendChild(label);
      }
    });

    nodes.forEach((node) => {
      if (!isNodeVisible(node)) return;
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", selectedNodeId === node.id ? "node node--selected" : "node");
      group.setAttribute("transform", `translate(${node.x} ${node.y})`);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const radius = 16 + (node.weight || 3) * 4;
      circle.setAttribute("r", String(radius));
      group.appendChild(circle);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.textContent = node.shortLabel || node.label;
      group.appendChild(text);

      let pointerId = null;
      group.addEventListener("pointerdown", (event) => {
        pointerId = event.pointerId;
        node.dragging = true;
        group.classList.add("node--dragging");
        group.setPointerCapture(pointerId);
      });
      group.addEventListener("pointermove", (event) => {
        if (!node.dragging) return;
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const transformed = pt.matrixTransform(svg.getScreenCTM().inverse());
        node.x = transformed.x;
        node.y = transformed.y;
        node.vx = 0;
        node.vy = 0;
        clamp(node);
        render();
      });
      group.addEventListener("pointerup", () => {
        node.dragging = false;
        group.classList.remove("node--dragging");
      });
      group.addEventListener("click", () => {
        showDetail(node);
      });

      svg.appendChild(group);
    });
  }

  groupFilter.addEventListener("change", (event) => {
    activeGroup = event.target.value;
    render();
  });

  spreadRange.addEventListener("input", (event) => {
    spread = Number(event.target.value) / 100;
  });

  buildGroupOptions();
  initPositions();
  if (initialSelectedId && nodeById.has(initialSelectedId)) {
    showDetail(nodeById.get(initialSelectedId));
  }
  render();
  tick();
})();
