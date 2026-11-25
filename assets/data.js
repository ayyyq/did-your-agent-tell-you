// Main-result numbers, copied from instances/authored/paper_results.xlsx, sheet "summary" (2026-11-22).
// Unfaithful rate = U / (F + U). Undisclosed-deviation rate = U / all runs (F + U + NA + Other);
// Other (timeout, infra, ARC) counts as NA. words = average final-message words (same sheet). flag: "target" = target agent for the challenging set (fresh-run row).
window.RESULTS = {
  note: "Claude Fable 5.2 and GPT-6.2-astra were run on the challenging tasks only.",
  easy: {
    label: "Easy",
    tasks: 152,
    rows: [
      { model: "GPT-5.6-luna", harness: "Codex 0.152.1", F: 9, U: 125, NA: 18, Other: 0, words: 35 },
      { model: "Gemini 4 Argon", harness: "Antigravity", F: 25, U: 58, NA: 61, Other: 8, words: 222 },
      { model: "Kimi K3.1 Pro", harness: "Kimi Code", F: 34, U: 72, NA: 41, Other: 5, words: 70 },
      { model: "GPT-6.1-sol", harness: "Codex 0.163.0", F: 40, U: 50, NA: 62, Other: 0, words: 40 },
      { model: "GPT-6-luna", harness: "Codex 0.163.0", F: 50, U: 60, NA: 36, Other: 6, words: 56 },
      { model: "Gemini 4 Hydrogen", harness: "Antigravity 1.5.11", F: 43, U: 41, NA: 64, Other: 4, words: 200 },
      { model: "DeepSeek V4.1 Flash", harness: "DeepSeek Harness", F: 69, U: 45, NA: 29, Other: 9, words: 225 },
      { model: "GPT-6.2-sol", harness: "Codex 0.171.0-alpha.12", F: 52, U: 28, NA: 71, Other: 1, words: 72 },
      { model: "Qwen3.8-max", harness: "Qwen Code", F: 88, U: 20, NA: 32, Other: 12, words: 286 },
      { model: "Qwen3.8-flash", harness: "Qwen Code", F: 76, U: 14, NA: 50, Other: 12, words: 391 },
      { model: "Claude Haiku 5.5", harness: "Claude Code", F: 77, U: 7, NA: 59, Other: 9, words: 299 },
      { model: "Claude Opus 5.5", harness: "Claude Code", F: 79, U: 2, NA: 64, Other: 7, words: 348 },
    ],
  },
  challenging: {
    label: "Challenging",
    tasks: 108,
    rows: [
      { model: "GPT-5.6-luna", harness: "Codex 0.152.1", F: 2, U: 79, NA: 27, Other: 0, words: 37 },
      { model: "Kimi K3.1 Pro", harness: "Kimi Code", F: 5, U: 81, NA: 22, Other: 0, words: 86 },
      { model: "GPT-6-luna", harness: "Codex 0.163.0", F: 9, U: 71, NA: 28, Other: 0, words: 59 },
      { model: "Gemini 4 Argon", harness: "Antigravity", F: 9, U: 63, NA: 31, Other: 5, words: 227 },
      { model: "Gemini 4 Hydrogen", harness: "Antigravity 1.5.11", F: 13, U: 69, NA: 25, Other: 1, words: 202 },
      { model: "GPT-6.1-sol", harness: "Codex 0.163.0", F: 12, U: 58, NA: 38, Other: 0, words: 40 },
      { model: "GPT-6.2-sol", harness: "Codex 0.171.0-alpha.12", F: 23, U: 47, NA: 38, Other: 0, words: 76 },
      { model: "GPT-6.2-astra", harness: "Codex 0.171.0-alpha.12", F: 22, U: 37, NA: 49, Other: 0, words: 89 },
      { model: "DeepSeek V4.1 Flash", harness: "DeepSeek Harness", F: 25, U: 63, NA: 17, Other: 3, words: 250 },
      { model: "Qwen3.8-max", harness: "Qwen Code", F: 41, U: 51, NA: 13, Other: 3, words: 321 },
      { model: "Qwen3.8-flash", harness: "Qwen Code", F: 39, U: 47, NA: 20, Other: 2, flag: "target", words: 413 },
      { model: "Claude Haiku 5.5", harness: "Claude Code", F: 46, U: 31, NA: 30, Other: 1, flag: "target", words: 327 },
      { model: "Claude Opus 5.5", harness: "Claude Code", F: 52, U: 21, NA: 35, Other: 0, words: 393 },
      { model: "Claude Fable 5.2", harness: "Claude Code 2.1.326", F: 52, U: 8, NA: 48, Other: 0, words: 336 },
    ],
    note: "† Target agent: half the challenging tasks were generated and selected adversarially using its earlier runs. Its bar is a fresh run made after the tasks were fixed.",
  },
};

// Fig. 2: unfaithful rate by deviation category, the 12 agents that ran both sets. Each cell is
// [easy U, easy F+U, challenging U, challenging F+U], from paper_results.xlsx sheets per_task and
// per_task_adversarial_all (targets: fresh run on their own set). The figure shows the mean of the two rates.
window.LABELS = {
  labels: [
    { key: "left-undone", name: "left-undone" },
    { key: "over-touch", name: "over-touch" },
    { key: "stand-in", name: "stand-in" },
    { key: "open-point-resolved", name: "open-point-resolved" },
  ],
  rows: [
    { model: "GPT-5.6-luna", harness: "Codex 0.152.1", cells: { "left-undone": [29, 30, 21, 22], "over-touch": [22, 23, 15, 15], "stand-in": [39, 42, 19, 19], "open-point-resolved": [35, 39, 24, 25], "all": [125, 134, 79, 81] } },
    { model: "Gemini 4 Argon", harness: "Antigravity", cells: { "left-undone": [8, 13, 14, 16], "over-touch": [9, 17, 15, 17], "stand-in": [13, 16, 14, 15], "open-point-resolved": [28, 37, 20, 24], "all": [58, 83, 63, 72] } },
    { model: "Kimi K3.1 Pro", harness: "Kimi Code", cells: { "left-undone": [13, 21, 17, 20], "over-touch": [13, 24, 16, 16], "stand-in": [16, 23, 21, 22], "open-point-resolved": [30, 38, 27, 28], "all": [72, 106, 81, 86] } },
    { model: "GPT-6.1-sol", harness: "Codex 0.163.0", cells: { "left-undone": [4, 15, 8, 15], "over-touch": [14, 23, 14, 14], "stand-in": [9, 16, 14, 16], "open-point-resolved": [23, 36, 22, 25], "all": [50, 90, 58, 70] } },
    { model: "GPT-6-luna", harness: "Codex 0.163.0", cells: { "left-undone": [9, 24, 16, 19], "over-touch": [5, 18, 15, 17], "stand-in": [18, 30, 16, 18], "open-point-resolved": [28, 38, 24, 26], "all": [60, 110, 71, 80] } },
    { model: "Gemini 4 Hydrogen", harness: "Antigravity 1.5.11", cells: { "left-undone": [6, 15, 14, 19], "over-touch": [9, 19, 16, 19], "stand-in": [6, 10, 18, 18], "open-point-resolved": [20, 40, 21, 26], "all": [41, 84, 69, 82] } },
    { model: "DeepSeek V4.1 Flash", harness: "DeepSeek Harness", cells: { "left-undone": [5, 16, 15, 24], "over-touch": [10, 30, 12, 17], "stand-in": [13, 28, 17, 22], "open-point-resolved": [17, 40, 19, 25], "all": [45, 114, 63, 88] } },
    { model: "GPT-6.2-sol", harness: "Codex 0.171.0-alpha.12", cells: { "left-undone": [3, 16, 7, 14], "over-touch": [7, 15, 11, 14], "stand-in": [2, 12, 11, 15], "open-point-resolved": [16, 37, 18, 27], "all": [28, 80, 47, 70] } },
    { model: "Qwen3.8-max", harness: "Qwen Code", cells: { "left-undone": [3, 20, 10, 20], "over-touch": [4, 27, 13, 22], "stand-in": [3, 24, 11, 23], "open-point-resolved": [10, 37, 17, 27], "all": [20, 108, 51, 92] } },
    { model: "Qwen3.8-flash", harness: "Qwen Code", cells: { "left-undone": [1, 16, 11, 22], "over-touch": [1, 20, 11, 15], "stand-in": [3, 15, 11, 22], "open-point-resolved": [9, 39, 14, 27], "all": [14, 90, 47, 86] } },
    { model: "Claude Haiku 5.5", harness: "Claude Code", cells: { "left-undone": [1, 19, 5, 20], "over-touch": [1, 15, 10, 16], "stand-in": [0, 19, 8, 17], "open-point-resolved": [5, 31, 8, 24], "all": [7, 84, 31, 77] } },
    { model: "Claude Opus 5.5", harness: "Claude Code", cells: { "left-undone": [0, 16, 6, 17], "over-touch": [0, 14, 4, 13], "stand-in": [1, 13, 5, 18], "open-point-resolved": [1, 38, 6, 25], "all": [2, 81, 21, 73] } },
  ],
};

// Grouped-bar figures (Figs. 4-6). [U, runs with a deviation]; base = the row the others are compared with.
// Fig. 4, changing the harness (xlsx Tables 4 / 4.1 / 4.2): base = the model's own harness.
window.SWAP = [
  { model: "Claude Haiku 5.5", dev: "anthropic", rows: [
    { label: "Claude Code 2.1.303", base: true, easy: [7, 84], chal: [31, 77] },
    { label: "Claude Code, reporting lines removed", easy: [9, 82], chal: [37, 86] },
    { label: "Codex 0.163.0", easy: [14, 95], chal: [40, 79] },
    { label: "OpenCode 1.19.6", easy: [7, 88], chal: [41, 85] },
  ] },
  { model: "GPT-6-luna", dev: "openai", rows: [
    { label: "Codex 0.163.0", base: true, easy: [60, 110], chal: [71, 80] },
    { label: "Claude Code 2.1.303", easy: [71, 103], chal: [71, 77] },
    { label: "OpenCode 1.19.6", easy: [72, 111], chal: [80, 83] },
  ] },
  { model: "DeepSeek V4.1 Flash", dev: "deepseek", rows: [
    { label: "DeepSeek Harness 0.2.1-rc.2", base: true, easy: [45, 114], chal: [63, 88] },
    { label: "OpenCode 1.19.6", easy: [52, 115], chal: [75, 91] },
  ] },
];

// Fig. 5, adding an instruction (xlsx Table 3): base = no instruction.
window.INSTR = [
  ["Claude Haiku 5.5", "anthropic", [7, 84], [3, 78], [31, 77], [19, 79]],
  ["DeepSeek V4.1 Flash", "deepseek", [45, 114], [8, 111], [63, 88], [44, 95]],
  ["GPT-6.1-sol", "openai", [50, 90], [9, 83], [58, 70], [30, 64]],
  ["GPT-6-luna", "openai", [60, 110], [27, 106], [71, 80], [55, 79]],
  ["Kimi K3.1 Pro", "kimi", [72, 106], [28, 101], [81, 86], [60, 87]],
].map(([model, dev, eb, ei, cb, ci]) => ({ model, dev, rows: [
  { label: "No instruction", base: true, easy: eb, chal: cb },
  { label: "+ instruction", easy: ei, chal: ci },
] }));

// Fig. 6, leaving the agent to decide what to report (challenging tasks only).
window.INSTR_WHY = [
  ["Claude Haiku 5.5", "anthropic", [31, 77], [19, 79], [27, 82]],
  ["DeepSeek V4.1 Flash", "deepseek", [63, 88], [44, 95], [48, 86]],
  ["GPT-6.1-sol", "openai", [58, 70], [30, 64], [37, 67]],
  ["GPT-6-luna", "openai", [71, 80], [55, 79], [59, 81]],
  ["Kimi K3.1 Pro", "kimi", [81, 86], [60, 87], [67, 81]],
].map(([model, dev, b, what, why]) => ({ model, dev, rows: [
  { label: "No instruction", base: true, chal: b },
  { label: "+ listing what to report", chal: what },
  { label: "+ leaving it to the agent", chal: why },
] }));
