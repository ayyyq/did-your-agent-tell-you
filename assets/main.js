// Fig. 1: Easy and Challenging side by side, one column per agent, each panel sorted low → high
// (best first), in the style of artificialanalysis.ai: brand color per developer, logo + rotated
// name under each bar. The two sets may hold different agents. One toggle picks the metric.
(function () {
  const MARK = { target: "†" };
  // key (also the key in window.LOGOS and the --d-<key> color), developer name, model-name pattern
  const DEVS = [
    ["anthropic", "Anthropic", /^Claude/],
    ["openai", "OpenAI", /^GPT/],
    ["google", "Google", /^Gemini/],
    ["alibaba", "Alibaba", /^Qwen/],
    ["deepseek", "DeepSeek", /^DeepSeek/],
    ["kimi", "Moonshot AI", /^Kimi/],
  ];
  const dev = (model) => DEVS.find(([, , re]) => re.test(model));
  const METRICS = {
    unfaithful: {
      title: "Unfaithful rate",
      sub: "Undisclosed deviations / runs with a deviation.",
      den: (r) => r.F + r.U,
      denLabel: "runs with a deviation",
    },
    undisclosed: {
      title: "Undisclosed-deviation rate",
      sub: "Undisclosed deviations / all runs.",
      den: (r) => r.F + r.U + r.NA + r.Other,
      denLabel: "all runs",
    },
  };
  const SETS = ["easy", "challenging"];
  const state = { metric: "unfaithful" };

  const rateOf = (r) => (100 * r.U) / (r.F + r.U);

  // One panel of columns: `rows` in display order, `value(r)` the bar height on a 0..max scale.
  function drawPanel(plot, rows, { value, max, ticks, fmt, tip }) {
    const pct = (v) => (100 * v) / max;
    const grid = ticks.map((t) => `<div class="gridline" style="bottom:${pct(t)}%"></div>`).join("");
    const cols = rows
      .map((r, i) => `
        <div class="col" data-i="${i}">
          <div class="bar" style="height:${pct(value(r))}%;background:var(--d-${r.dev[0]})"></div>
          <div class="val" style="bottom:${pct(value(r))}%">${fmt(value(r))}</div>
        </div>`)
      .join("");
    const under = rows
      .map((r) => `
        <div>
          <span class="logo" role="img" aria-label="${r.dev[1]}" title="${r.dev[1]}">${window.LOGOS[r.dev[0]]}</span>
          <div class="name">${r.model}${r.flag ? MARK[r.flag] : ""}<span>${r.harness}</span></div>
        </div>`)
      .join("");
    plot.innerHTML = `
      <div class="plot-area">${grid}<div class="cols">${cols}</div></div>
      <div class="under">${under}</div>`;

    const area = plot.querySelector(".plot-area");
    const box = document.createElement("div");
    box.className = "tip";
    box.hidden = true;
    area.appendChild(box);
    area.querySelectorAll(".col").forEach((col) => {
      const r = rows[col.dataset.i];
      col.addEventListener("mouseenter", () => {
        box.innerHTML = tip(r);
        box.style.left = `${col.offsetLeft + col.offsetWidth / 2}px`;
        // Tall bars: show the tip below the bar top so the scroll box does not clip it.
        const h = pct(value(r));
        const below = h > 65;
        box.classList.toggle("below", below);
        box.style.top = `${area.offsetHeight * (1 - h / 100) + (below ? 20 : 0)}px`;
        box.hidden = false;
      });
      col.addEventListener("mouseleave", () => (box.hidden = true));
    });
  }

  function renderPanel(setKey, m) {
    const set = window.RESULTS[setKey];
    const rows = set.rows
      .map((r) => ({ ...r, rate: (100 * r.U) / m.den(r), dev: dev(r.model) }))
      .sort((a, b) => a.rate - b.rate);
    drawPanel(document.getElementById(`fig1-${setKey}`), rows, {
      value: (r) => r.rate, max: 100, ticks: [25, 50, 75, 100], fmt: (v) => v.toFixed(1),
      tip: (r) => `<b>${r.model}</b> (${r.harness})<br>${m.title}: ${r.rate.toFixed(1)}%<br>` +
        `${r.U} unfaithful / ${m.den(r)} ${m.denLabel}`,
    });
    document.getElementById(`fig1-${setKey}-title`).textContent =
      `${set.label} tasks (${set.tasks})`;
  }

  function render() {
    const m = METRICS[state.metric];
    SETS.forEach((k) => renderPanel(k, m));
    document.getElementById("fig1-title").textContent = `${m.title} on FIDA-Bench (%)`;
    document.getElementById("fig1-sub").textContent = m.sub;
    document.getElementById("fig1-note").innerHTML =
      SETS.filter((k) => window.RESULTS[k].note).map((k) => `<p>${window.RESULTS[k].note}</p>`).join("") + `<p>${window.RESULTS.note}</p>`;
    document.querySelectorAll("#fig1-metric button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.value === state.metric)));
  }

  document.querySelectorAll("#fig1-metric button").forEach((b) =>
    b.addEventListener("click", () => { state.metric = b.dataset.value; render(); }));
  render();

  // Fig. 3: average final-message length, agents in the same order as Fig. 1 (unfaithful rate,
  // low → high), so the two figures can be read side by side.
  SETS.forEach((k) => {
    const plot = document.getElementById(`fig3-${k}`);
    if (!plot) return;
    const set = window.RESULTS[k];
    const rows = set.rows
      .map((r) => ({ ...r, dev: dev(r.model) }))
      .sort((a, b) => rateOf(a) - rateOf(b));
    drawPanel(plot, rows, {
      value: (r) => r.words, max: 450, ticks: [100, 200, 300, 400], fmt: (v) => String(v),
      tip: (r) => `<b>${r.model}</b> (${r.harness})<br>Final message: ${r.words} words on average<br>` +
        `Unfaithful rate: ${rateOf(r).toFixed(1)}%`,
    });
    document.getElementById(`fig3-${k}-title`).textContent = `${set.label} tasks (${set.tasks})`;
  });
})();

// Fig. 2: heatmap of the unfaithful rate by deviation category. Each cell is the mean of the easy and the
// challenging rate, so both sets count equally; hover or focus shows the two rates behind it.
(function () {
  const L = window.LABELS;
  const root = document.getElementById("fig2");
  if (!L || !root) return;
  const rate = (u, n) => (100 * u) / n;
  const mean = (c) => (rate(c[0], c[1]) + rate(c[2], c[3])) / 2;
  const fill = (r) => `color-mix(in srgb, var(--bar) ${Math.round(r * 0.85)}%, var(--bg))`;
  const cols = [...L.labels, { key: "all", name: "all" }];
  const rows = [...L.rows].sort((a, b) => mean(a.cells.all) - mean(b.cells.all));
  const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
  // Bottom row: the plain average over agents of each cell (mean rate, easy rate, challenging rate).
  const avgOf = (k) => ({
    m: avg(L.rows.map((r) => mean(r.cells[k]))),
    e: avg(L.rows.map((r) => rate(r.cells[k][0], r.cells[k][1]))),
    c: avg(L.rows.map((r) => rate(r.cells[k][2], r.cells[k][3]))),
  });
  const td = (r, m, k) => `<td class="cell${r >= 55 ? " hi" : ""}" tabindex="0" data-m="${m}" data-k="${k}"
      style="background:${fill(r)}">${r.toFixed(0)}</td>`;
  const cell = (row, col) => td(mean(row.cells[col.key]), row.model, col.key);
  const avgCell = (col) => td(avgOf(col.key).m, "", col.key);
  root.innerHTML = `
    <table class="heat">
      <colgroup><col class="agent-col">${L.labels.map(() => "<col>").join("")}<col class="gap-col"><col></colgroup>
      <thead><tr><th class="agent">agent</th>${L.labels.map((c) => `<th>${c.name}</th>`).join("")}<th class="gap"></th><th>all</th></tr></thead>
      <tbody>${rows.map((row) => `<tr><td class="agent">${row.model}<span>${row.harness}</span></td>${
        L.labels.map((c) => cell(row, c)).join("")}<td class="gap"></td>${cell(row, cols[4])}</tr>`).join("")}</tbody>
      <tfoot><tr><td class="agent">average<span>${L.rows.length} agents</span></td>${
        L.labels.map((c) => avgCell(c)).join("")}<td class="gap"></td>${avgCell(cols[4])}</tr></tfoot>
    </table>`;
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.hidden = true;
  root.appendChild(tip);
  const pct = (u, n) => `${u} / ${n} (${rate(u, n).toFixed(0)}%)`;
  const show = (td) => {
    if (!td.dataset.m) {
      const a = avgOf(td.dataset.k);
      tip.innerHTML = `<b>Average of ${L.rows.length} agents</b> · ${td.dataset.k}<br>Mean of the two sets: ${a.m.toFixed(0)}%<br>` +
        `Easy: ${a.e.toFixed(0)}%<br>Challenging: ${a.c.toFixed(0)}%`;
      return place(td);
    }
    const row = L.rows.find((r) => r.model === td.dataset.m);
    const c = row.cells[td.dataset.k];
    tip.innerHTML = `<b>${row.model}</b> · ${td.dataset.k}<br>Mean of the two sets: ${mean(c).toFixed(0)}%<br>` +
      `Easy: ${pct(c[0], c[1])}<br>Challenging: ${pct(c[2], c[3])}`;
    place(td);
  };
  const place = (td) => {
    tip.style.left = `${td.offsetLeft + td.offsetWidth / 2}px`;
    // Near the top the scroll box would clip a tip above the cell, so show it below.
    const below = td.offsetTop < 90;
    tip.classList.toggle("below", below);
    tip.style.top = `${td.offsetTop + (below ? td.offsetHeight : 0)}px`;
    tip.hidden = false;
  };
  root.querySelectorAll("td.cell").forEach((td) => {
    td.addEventListener("mouseenter", () => show(td));
    td.addEventListener("focus", () => show(td));
    td.addEventListener("mouseleave", () => (tip.hidden = true));
    td.addEventListener("blur", () => (tip.hidden = true));
  });
  document.getElementById("fig2-ramp").style.background =
    `linear-gradient(to right, ${fill(0)}, ${fill(100)})`;
})();

// Case study: show one example at a time; the tabs switch between them.
(function () {
  const tabs = [...document.querySelectorAll('.case-tabs [role="tab"]')];
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
  if (tabs.length) select(tabs[0]);
})();

// Figs. 4-6: grouped horizontal bars. One group per model, one row per condition, one bar column
// per task set. The base row is solid; other rows are lighter and carry a tick at the base rate,
// so each change reads against the model's baseline.
(function () {
  const pct = ([u, n]) => (100 * u) / n;
  const ALL_SETS = { easy: "Easy tasks", chal: "Challenging tasks" };
  function render(id, groups, sets, { baseTag, vs }) {
    const root = document.getElementById(id);
    if (!root) return;
    root.style.gridTemplateColumns = `minmax(110px, 30%) repeat(${sets.length}, 1fr)`;
    let html = `<div></div>` + sets.map((k) => `<div class="swap-head">${ALL_SETS[k]}</div>`).join("");
    groups.forEach((g, gi) => {
      const base = g.rows.find((r) => r.base);
      html += `<div class="swap-grp"><span class="logo">${window.LOGOS[g.dev]}</span>${g.model}</div>`;
      g.rows.forEach((r, ri) => {
        html += `<div class="swap-lab${r.base ? " own" : ""}">${r.label}${r.base && baseTag ? ` <span>${baseTag}</span>` : ""}</div>`;
        sets.forEach((k) => {
          const v = pct(r[k]);
          // The value sits past the tick when the bar is shorter, so the two never overlap.
          const tick = r.base ? "" : `<div class="swap-tick" style="left:${pct(base[k])}%"></div>`;
          html += `<div class="swap-track" data-g="${gi}" data-r="${ri}" data-k="${k}">
            <div class="swap-bar${r.base ? "" : " other"}" style="width:${v}%;background:var(--d-${g.dev})"></div>${tick}
            <div class="swap-val" style="left:${r.base ? v : Math.max(v, pct(base[k]))}%">${Math.round(v)}</div></div>`;
        });
      });
    });
    root.innerHTML = html;

    const box = document.createElement("div");
    box.className = "tip";
    box.hidden = true;
    root.appendChild(box);
    root.querySelectorAll(".swap-track").forEach((t) => {
      const g = groups[t.dataset.g], r = g.rows[t.dataset.r], k = t.dataset.k;
      const base = g.rows.find((x) => x.base);
      t.addEventListener("mouseenter", () => {
        const d = pct(r[k]) - pct(base[k]);
        box.innerHTML = `<b>${g.model}</b>, ${r.label}<br>${r[k][0]} unfaithful / ${r[k][1]} runs with a deviation` +
          (r.base ? "" : `<br>${d >= 0 ? "+" : ""}${d.toFixed(0)} points vs ${vs}`);
        box.style.left = `${t.offsetLeft + t.offsetWidth / 2}px`;
        box.style.top = `${t.offsetTop}px`;
        box.hidden = false;
      });
      t.addEventListener("mouseleave", () => (box.hidden = true));
    });
  }
  render("fig4", window.SWAP, ["easy", "chal"], { baseTag: "(own)", vs: "its own harness" });
  render("fig5", window.INSTR, ["easy", "chal"], { vs: "no instruction" });
  render("fig6", window.INSTR_WHY, ["chal"], { vs: "no instruction" });
})();

// Sidebar table of contents: one link per h2 (and per h3 with an id), highlighting the section in view.
(function () {
  const toc = document.getElementById("toc");
  if (!toc) return;
  const heads = [...document.querySelectorAll("main h2[id], main h3[id]")];
  toc.innerHTML = `<div class="toc-title">Contents<button type="button" class="toc-toggle" aria-label="Hide contents" title="Hide contents">«</button></div>` + heads
    .map((h) => `<a href="#${h.id}"${h.tagName === "H3" ? ' class="sub"' : ""}>${h.textContent}</a>`)
    .join("");
  const links = [...toc.querySelectorAll("a")];
  function update() {
    let i = 0;
    heads.forEach((h, k) => { if (h.getBoundingClientRect().top < 120) i = k; });
    links.forEach((a, k) => a.classList.toggle("active", k === i));
  }
  window.addEventListener("scroll", update, { passive: true });
  update();

  // Collapse / expand. The choice is remembered per browser when storage is available.
  const open = document.createElement("button");
  open.type = "button";
  open.className = "toc-open";
  open.textContent = "☰ Contents";
  open.setAttribute("aria-label", "Show contents");
  document.body.appendChild(open);
  function setCollapsed(c) {
    document.body.classList.toggle("toc-collapsed", c);
    try { localStorage.setItem("tocCollapsed", c ? "1" : "0"); } catch (e) {}
  }
  let saved = false;
  try { saved = localStorage.getItem("tocCollapsed") === "1"; } catch (e) {}
  document.body.classList.toggle("toc-collapsed", saved);
  toc.querySelector(".toc-toggle").addEventListener("click", () => setCollapsed(true));
  open.addEventListener("click", () => setCollapsed(false));
})();

// Back-to-top button: shown after scrolling one screen down.
(function () {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  const update = () => btn.classList.toggle("show", window.scrollY > window.innerHeight);
  btn.addEventListener("click", (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Citation: copy the BibTeX entry.
(function () {
  const btn = document.getElementById("cite-copy");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(document.getElementById("cite-bib").textContent);
      btn.textContent = "Copied";
    } catch (e) {
      btn.textContent = "Select and copy";
    }
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  });
})();
