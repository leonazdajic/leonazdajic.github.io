/**
 * Interactive ApiCon demo ([data-demo]).
 *
 * A simplified, client-side replica of a validation run using illustrative
 * sample data only (generic market and item names, no real product, price or
 * market data). Markets are "fetched" with limited concurrency, then the
 * deviations are listed ranked by severity.
 *
 * The demo is a collapsed <details>; opening it starts the first run.
 * Under prefers-reduced-motion the run completes instantly.
 */

type Severity = "critical" | "warning" | "cosmetic";

interface Market {
  name: string;
  critical: number;
  warning: number;
  cosmetic: number;
}

interface Deviation {
  severity: Severity;
  market: string;
  item: string;
  field: string;
  reference: string;
  api: string;
}

const MARKETS: Market[] = [
  { name: "Market A", critical: 0, warning: 3, cosmetic: 2 },
  { name: "Market B", critical: 1, warning: 4, cosmetic: 1 },
  { name: "Market C", critical: 0, warning: 2, cosmetic: 3 },
  { name: "Market D", critical: 2, warning: 5, cosmetic: 0 },
  { name: "Market E", critical: 0, warning: 1, cosmetic: 2 },
  { name: "Market F", critical: 1, warning: 3, cosmetic: 1 },
];

const DEVIATIONS: Deviation[] = [
  { severity: "critical", market: "Market D", item: "Service 07", field: "Availability", reference: "Offered", api: "Missing" },
  { severity: "critical", market: "Market B", item: "Service 12", field: "Feature list", reference: "5 features", api: "4 features" },
  { severity: "warning", market: "Market F", item: "Service 03", field: "Name", reference: "Route Planner", api: "Route planner" },
  { severity: "warning", market: "Market D", item: "Service 21", field: "Description", reference: "Version 3", api: "Version 2" },
  { severity: "warning", market: "Market A", item: "Service 09", field: "Model mapping", reference: "3 models", api: "2 models" },
  { severity: "cosmetic", market: "Market C", item: "Service 05", field: "Name", reference: "Eco Assist", api: "Eco Assist␣" },
];

const CONCURRENCY = 3;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function initDemo(): void {
  const root = document.querySelector<HTMLElement>("[data-demo]");
  if (!root) return;

  const runBtn = root.querySelector<HTMLButtonElement>("[data-demo-run]");
  const marketBody = root.querySelector<HTMLElement>("[data-demo-markets]");
  const devWrap = root.querySelector<HTMLElement>("[data-demo-deviations]");
  const devBody = root.querySelector<HTMLElement>("[data-demo-rows]");
  const status = root.querySelector<HTMLElement>("[data-demo-status]");
  const stat = (key: string) => root.querySelector<HTMLElement>(`[data-stat="${key}"]`);
  if (!runBtn || !marketBody || !devWrap || !devBody || !status) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---- Build market rows once ----
  const rows = MARKETS.map((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th scope="row">${m.name}</th>
      <td><span class="demo__state" data-state="queued">Queued</span></td>
      <td class="demo__col-progress"><span class="demo__progress"><span></span></span></td>
      <td class="mono" data-c="critical">–</td>
      <td class="mono" data-c="warning">–</td>
      <td class="mono" data-c="cosmetic">–</td>`;
    marketBody.appendChild(tr);
    return { market: m, tr };
  });

  const setState = (tr: HTMLElement, state: string, label: string, progress: number) => {
    const badge = tr.querySelector<HTMLElement>(".demo__state");
    const bar = tr.querySelector<HTMLElement>(".demo__progress > span");
    if (badge) {
      badge.dataset.state = state;
      badge.textContent = label;
    }
    if (bar) bar.style.transform = `scaleX(${progress})`;
  };

  const setCounts = (tr: HTMLElement, m: Market | null) => {
    (["critical", "warning", "cosmetic"] as const).forEach((key) => {
      const cell = tr.querySelector<HTMLElement>(`[data-c="${key}"]`);
      if (!cell) return;
      cell.textContent = m ? String(m[key]) : "–";
      cell.classList.toggle("is-critical", key === "critical" && !!m && m.critical > 0);
    });
  };

  let done = 0;
  let deviations = 0;
  let critical = 0;
  let startTime = 0;
  let timer = 0;

  const renderStats = () => {
    const s = stat("markets");
    if (s) s.textContent = `${done}/${MARKETS.length}`;
    const d = stat("deviations");
    if (d) d.textContent = String(deviations);
    const c = stat("critical");
    if (c) c.textContent = String(critical);
  };

  const renderTime = () => {
    const t = stat("time");
    if (t) t.textContent = `${((performance.now() - startTime) / 1000).toFixed(1)} s`;
  };

  const reset = () => {
    done = 0;
    deviations = 0;
    critical = 0;
    rows.forEach(({ tr }) => {
      setState(tr, "queued", "Queued", 0);
      setCounts(tr, null);
    });
    devWrap.hidden = true;
    devBody.innerHTML = "";
    renderStats();
    const t = stat("time");
    if (t) t.textContent = "0.0 s";
  };

  const finishMarket = (tr: HTMLElement, m: Market) => {
    setState(tr, "done", "Done", 1);
    setCounts(tr, m);
    done += 1;
    deviations += m.critical + m.warning + m.cosmetic;
    critical += m.critical;
    renderStats();
  };

  const showDeviations = () => {
    devBody.innerHTML = DEVIATIONS.map(
      (d) => `
        <tr>
          <td><span class="sev sev--${d.severity}">${d.severity}</span></td>
          <td>${d.market}</td>
          <td>${d.item}</td>
          <td>${d.field}</td>
          <td class="mono">${d.reference}</td>
          <td class="mono demo__api">${d.api}</td>
        </tr>`,
    ).join("");
    const subtitle = root.querySelector<HTMLElement>("[data-demo-subtitle]");
    if (subtitle) {
      subtitle.textContent = `showing ${DEVIATIONS.length} of ${deviations} deviations · ranked by impact`;
    }
    devWrap.hidden = false;
  };

  const runMarket = async (tr: HTMLElement, m: Market) => {
    setState(tr, "fetching", "Fetching API…", 0.45);
    await wait(550 + Math.random() * 650);
    setState(tr, "comparing", "Comparing…", 0.8);
    await wait(350 + Math.random() * 300);
    finishMarket(tr, m);
  };

  const run = async () => {
    runBtn.disabled = true;
    reset();
    startTime = performance.now();

    if (reducedMotion.matches) {
      rows.forEach(({ tr, market }) => finishMarket(tr, market));
    } else {
      status.textContent = "Running — fetching markets in parallel…";
      timer = window.setInterval(renderTime, 100);
      const queue = [...rows];
      const worker = async () => {
        while (queue.length > 0) {
          const next = queue.shift();
          if (next) await runMarket(next.tr, next.market);
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
      window.clearInterval(timer);
    }

    renderTime();
    showDeviations();
    status.textContent = `Done. ${deviations} deviations in ${MARKETS.length} markets, ${critical} critical — report ready for review.`;
    runBtn.disabled = false;
    runBtn.textContent = "Run again";
  };

  runBtn.addEventListener("click", () => {
    void run();
  });

  // The demo is a collapsed <details>: opening it starts the first run
  if (root instanceof HTMLDetailsElement) {
    let started = false;
    root.addEventListener("toggle", () => {
      if (!root.open || started) return;
      started = true;
      void run();
    });
  }
}
