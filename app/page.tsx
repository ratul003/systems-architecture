import GithubLink from "./GithubLink";

export default function Home() {
  return (
    <main className="min-h-screen text-[#e2e8f0]" style={{ backgroundColor: "#0a0a0f" }}>
      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        style={{
          backgroundColor: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-sm font-semibold tracking-widest uppercase text-[#f43f5e]">
          Systems Architecture
        </span>
        <span className="hidden sm:block text-sm text-[#94a3b8]">
          Wahid Tawsif Ratul&nbsp;&nbsp;·&nbsp;&nbsp;Product Analytics Engineer
        </span>
        <span className="sm:hidden text-xs text-[#94a3b8]">Wahid T. Ratul</span>
      </nav>

      <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 space-y-24">

        {/* ─── HERO ─── */}
        <section className="pt-8 space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f43f5e] mb-4">
              Portfolio Case Study
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              Systems Architecture &amp;{" "}
              <br className="hidden md:block" />
              Platform Design
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-[#94a3b8] leading-relaxed">
            Architecture decisions at scale — migrating analytics platforms, evaluating cloud
            infrastructure, and designing for operational resilience at Optimizely.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { label: "2 Major ADRs", icon: "◈" },
              { label: "23 TB Migration Scope", icon: "◈" },
              { label: "6 Alternatives Evaluated", icon: "◈" },
              { label: "$8K/week Egress Avoided", icon: "◈" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#fda4af",
                }}
              >
                <span className="text-[#f43f5e] text-xs">{stat.icon}</span>
                {stat.label}
              </div>
            ))}
          </div>
        </section>

        {/* ─── DIVIDER ─── */}
        <Divider />

        {/* ─── ADR 1 ─── */}
        <section className="space-y-8">
          <SectionLabel label="ADR-001" />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Analytics Platform Migration
            </h2>
            <p className="text-[#94a3b8]">
              Mixpanel → Optimizely Analytics (NetSpring)
            </p>
          </div>

          {/* ADR Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdrCard title="Context" accent={false}>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Mixpanel was the primary product analytics tool, but as data volume and team
                complexity grew, it hit operational ceilings that blocked deeper analysis.
              </p>
            </AdrCard>
            <AdrCard title="Decision" accent={true}>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Migrate to{" "}
                <span className="text-[#fda4af] font-medium">
                  Optimizely Analytics (NetSpring)
                </span>{" "}
                — a warehouse-native analytics layer that queries Snowflake directly without
                any data sync.
              </p>
            </AdrCard>
          </div>

          {/* Problems */}
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Drivers for Change
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Sync Fragility",
                  body: "Data pipelines broke whenever Snowflake schema changed. The REPORTING.MIXPANEL.* mirror (15 prepared tables) required constant maintenance to stay in sync.",
                },
                {
                  title: "Data Discrepancies",
                  body: "Divergence between Snowflake and Mixpanel numbers eroded analyst trust and created ambiguity in board-level reporting.",
                },
                {
                  title: "MTU Licensing Cost",
                  body: "Monthly Tracked User pricing scaled poorly. As the active user base grew, licensing costs scaled disproportionately before any additional analytics value was captured.",
                },
                {
                  title: "No Warehouse Joins",
                  body: "Mixpanel data lived in a silo — impossible to join engagement metrics to ARR, experiment results, or Salesforce CRM data for account-level analysis.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] flex-shrink-0" />
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                  <p className="text-sm text-[#64748b] pl-3.5 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Drivers */}
          <div
            className="rounded-xl p-6 space-y-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Why Optimizely Analytics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Warehouse-Native",
                  body: "Queries Snowflake directly — zero sync infrastructure, no ETL pipelines, no mirror tables to maintain.",
                },
                {
                  title: "ARR-Linked Metrics",
                  body: "Engagement data can be joined to ARR and Salesforce, enabling product-led growth analysis at the account level.",
                },
                {
                  title: "Cross-Product Joins",
                  body: "Unified analysis across Optimizely's product suite — experiment results, CMS, feature flags, and analytics in one query.",
                },
                {
                  title: "Opti on Opti",
                  body: "Optimizely's own product — internal dogfooding aligns vendor incentives with real usage and accelerates feature development.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#34d399" }}
                    />
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                  <p className="text-sm text-[#64748b] pl-3.5 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trade-offs & Outcome */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-6 space-y-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
                Trade-offs Accepted
              </h3>
              <ul className="space-y-2">
                {[
                  "Migration effort to rebuild the reporting layer",
                  "96 dashboards and 100 metrics to be ported",
                  "Team ramp-up on new query and modeling paradigms",
                  "Parallel-run period maintaining both platforms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#f43f5e] mt-0.5 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: "rgba(52,211,153,0.05)",
                border: "1px solid rgba(52,211,153,0.15)",
              }}
            >
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#34d399]">
                Outcome
              </h3>
              <ul className="space-y-2">
                {[
                  "Single source of truth for all product analytics",
                  "96 dashboards migrated, 100 metrics defined",
                  "Board-level reporting on ARR-linked engagement",
                  "AI feature adoption tracking across accounts",
                  "Cross-product cohort analysis now possible",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#34d399" }} className="mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── BEFORE / AFTER ARCHITECTURE ─── */}
        <section className="space-y-6">
          <SectionLabel label="Architecture" />
          <h2 className="text-2xl font-bold text-white">Before &amp; After</h2>
          <p className="text-[#94a3b8] text-sm max-w-xl">
            Eliminating the sync layer simplified the data flow and removed the primary source of
            data quality issues.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(244,63,94,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Before</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}
                >
                  Legacy
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { node: "Segment", note: "Event collection" },
                  { node: "↓", note: "" },
                  { node: "Mixpanel", note: "Analytics (siloed)", highlight: true },
                  { node: "↓", note: "" },
                  { node: "REPORTING.MIXPANEL.*", note: "15 mirror tables (sync burden)", highlight: true },
                  { node: "↓", note: "" },
                  { node: "Snowflake", note: "Warehouse (separate)" },
                  { node: "", note: "No joins to ARR / Salesforce", dim: true },
                ].map((row, i) =>
                  row.node === "↓" ? (
                    <div key={i} className="text-center text-[#64748b] text-sm">↓</div>
                  ) : (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-2"
                      style={{
                        background: row.highlight
                          ? "rgba(244,63,94,0.08)"
                          : row.dim
                          ? "transparent"
                          : "rgba(255,255,255,0.04)",
                        border: row.highlight
                          ? "1px solid rgba(244,63,94,0.2)"
                          : row.dim
                          ? "none"
                          : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {row.node && (
                        <p
                          className="text-sm font-mono font-semibold"
                          style={{ color: row.highlight ? "#f43f5e" : "#e2e8f0" }}
                        >
                          {row.node}
                        </p>
                      )}
                      {row.note && (
                        <p className="text-xs text-[#64748b] mt-0.5">{row.note}</p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* After */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(52,211,153,0.2)",
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">After</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}
                >
                  Current
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { node: "Segment", note: "Event collection" },
                  { node: "↓", note: "" },
                  { node: "Snowflake", note: "Single source of truth", highlight: true },
                  { node: "↓", note: "" },
                  { node: "Optimizely Analytics", note: "Warehouse-native (no sync)", highlight: true },
                  { node: "↓", note: "" },
                  { node: "Power BI + dbt", note: "Dashboards & modeled metrics" },
                  { node: "", note: "+ ARR · Salesforce · Experiment joins", dim: false, green: true },
                ].map((row, i) =>
                  row.node === "↓" ? (
                    <div key={i} className="text-center text-[#64748b] text-sm">↓</div>
                  ) : (
                    <div
                      key={i}
                      className="rounded-lg px-3 py-2"
                      style={{
                        background: row.highlight
                          ? "rgba(52,211,153,0.08)"
                          : row.green
                          ? "rgba(52,211,153,0.04)"
                          : "rgba(255,255,255,0.04)",
                        border: row.highlight
                          ? "1px solid rgba(52,211,153,0.2)"
                          : row.green
                          ? "1px solid rgba(52,211,153,0.1)"
                          : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {row.node && (
                        <p
                          className="text-sm font-mono font-semibold"
                          style={{ color: row.highlight ? "#34d399" : "#e2e8f0" }}
                        >
                          {row.node}
                        </p>
                      )}
                      {row.note && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: row.green ? "#34d399" : "#64748b" }}
                        >
                          {row.note}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ─── ADR 2 ─── */}
        <section className="space-y-8">
          <SectionLabel label="ADR-002" />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Cloud Migration Evaluation
            </h2>
            <p className="text-[#94a3b8]">
              ODP: Snowflake on AWS → BigQuery on GCP
            </p>
          </div>

          {/* Context callout */}
          <div
            className="rounded-xl p-5 space-y-2"
            style={{
              background: "rgba(244,63,94,0.06)",
              border: "1px solid rgba(244,63,94,0.15)",
            }}
          >
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#f43f5e]">
              Migration Scope
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-[#94a3b8]">
              <span>
                <span className="text-white font-semibold">~23 TB</span> compressed data
              </span>
              <span>
                <span className="text-white font-semibold">Hundreds</span> of per-customer
                databases (PROD_XXXX_WEB pattern)
              </span>
              <span>
                <span className="text-white font-semibold">sobek / lilo / hubble</span> services
                affected
              </span>
            </div>
          </div>

          {/* Alternatives comparison table */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Alternatives Evaluated
            </h3>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-[#64748b]">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-[#64748b]">
                      Alternative
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-[#64748b]">
                      Approach
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-[#64748b]">
                      Monthly Cost
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-[#64748b]">
                      Complexity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      num: "1",
                      name: "Full Export",
                      approach: "Weekly full Parquet dump to GCS",
                      cost: "~$8,700",
                      complexity: "Low",
                      costColor: "#f43f5e",
                      complexityColor: "#34d399",
                      recommended: false,
                      rejected: true,
                    },
                    {
                      num: "2",
                      name: "Dynamic Iceberg Tables",
                      approach: "Native incremental refresh via Snowflake Iceberg",
                      cost: "~$2,600",
                      complexity: "Medium",
                      costColor: "#fbbf24",
                      complexityColor: "#fbbf24",
                      recommended: false,
                      fallback: true,
                    },
                    {
                      num: "3",
                      name: "Weekly Full Parquet",
                      approach: "Scheduled full Parquet export to BigQuery",
                      cost: "~$6,200",
                      complexity: "Low",
                      costColor: "#f43f5e",
                      complexityColor: "#34d399",
                      recommended: false,
                    },
                    {
                      num: "4",
                      name: "Materialized Views",
                      approach: "Snowflake materialized views replicated to BQ",
                      cost: "~$4,100",
                      complexity: "Medium",
                      costColor: "#fbbf24",
                      complexityColor: "#fbbf24",
                      recommended: false,
                    },
                    {
                      num: "5",
                      name: "ECO Caching",
                      approach: "Egress Cost Optimizer caching layer",
                      cost: "~$3,400",
                      complexity: "Medium",
                      costColor: "#fbbf24",
                      complexityColor: "#fbbf24",
                      recommended: false,
                    },
                    {
                      num: "6",
                      name: "Service Rewrite",
                      approach: "Rewrite sobek/lilo/hubble as BQ-native services",
                      cost: "~$2,100",
                      complexity: "High",
                      costColor: "#34d399",
                      complexityColor: "#f43f5e",
                      recommended: true,
                    },
                  ].map((row) => (
                    <tr
                      key={row.num}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        background: row.recommended
                          ? "rgba(52,211,153,0.06)"
                          : row.fallback
                          ? "rgba(251,191,36,0.04)"
                          : row.rejected
                          ? "rgba(244,63,94,0.04)"
                          : "transparent",
                      }}
                    >
                      <td className="px-4 py-3 text-[#64748b] font-mono">{row.num}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{row.name}</span>
                          {row.recommended && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
                            >
                              PRIMARY
                            </span>
                          )}
                          {row.fallback && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded font-semibold"
                              style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
                            >
                              FALLBACK
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#94a3b8]">{row.approach}</td>
                      <td className="px-4 py-3 font-mono font-semibold" style={{ color: row.costColor }}>
                        {row.cost}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: row.complexityColor }}>
                        {row.complexity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── COST MODEL ─── */}
        <section className="space-y-6">
          <SectionLabel label="Cost Model" />
          <h2 className="text-2xl font-bold text-white">Egress Dominates</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            At 23 TB scale, data transfer costs account for 80–90% of total migration cost.
            This asymmetry drove the evaluation toward architectures that minimize data movement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "AWS Egress",
                value: "$0.085–$0.09",
                unit: "per GB",
                note: "Primary cost driver",
                highlight: true,
              },
              {
                label: "Snowflake Cross-Cloud",
                value: "$0.09–$0.155",
                unit: "per TB",
                note: "On top of AWS egress",
                highlight: true,
              },
              {
                label: "BigQuery Storage",
                value: "$0.02",
                unit: "per GB/month",
                note: "Relatively cheap at rest",
                highlight: false,
              },
              {
                label: "BigQuery Query",
                value: "$6.25",
                unit: "per TB scanned",
                note: "On-demand pricing",
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-5 space-y-2"
                style={{
                  background: item.highlight
                    ? "rgba(244,63,94,0.07)"
                    : "rgba(255,255,255,0.03)",
                  border: item.highlight
                    ? "1px solid rgba(244,63,94,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs text-[#64748b] font-medium">{item.label}</p>
                <p
                  className="text-2xl font-bold font-mono"
                  style={{ color: item.highlight ? "#f43f5e" : "#e2e8f0" }}
                >
                  {item.value}
                </p>
                <p className="text-xs text-[#64748b]">{item.unit}</p>
                <p className="text-xs" style={{ color: item.highlight ? "#fda4af" : "#64748b" }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* Egress dominance bar */}
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Weekly Export Cost Breakdown · Full Export Scenario
            </h3>
            <div className="space-y-3">
              {[
                { label: "AWS Egress (11.5 TB × $0.085/GB)", amount: "$977", pct: 89 },
                { label: "Snowflake Cross-Cloud Transfer", amount: "$120", pct: 11 },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#94a3b8]">{row.label}</span>
                    <span className="text-white font-mono font-semibold">{row.amount}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${row.pct}%`,
                        background: row.pct > 50 ? "#f43f5e" : "rgba(244,63,94,0.4)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748b]">
              Full weekly export at 11.5 TB scope: ~$8,000 in egress alone. Annualised: ~$416,000.
            </p>
          </div>
        </section>

        {/* ─── ARCHITECTURAL CONSTRAINTS ─── */}
        <section className="space-y-6">
          <SectionLabel label="Constraints" />
          <h2 className="text-2xl font-bold text-white">Architectural Constraints</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            Several hard constraints narrowed the viable solution space before any cost modeling
            was applied.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Secure View Incompatibility",
                body: "BigQuery Data Transfer Service only supports tables, not Snowflake secure views. Customer data is exposed exclusively via secure views — the primary connector for GCP cannot read it. Any migration must handle this by materializing data upstream.",
                severity: "high",
              },
              {
                title: "Per-Customer Database Sprawl",
                body: "ODP uses a PROD_XXXX_WEB naming pattern with hundreds of separate customer databases. Each represents an independent orchestration unit — a naive export would require hundreds of parallel jobs, dramatically increasing coordination complexity and failure surface area.",
                severity: "high",
              },
              {
                title: "Incremental vs Full Export",
                body: "Full weekly exports eliminate incremental complexity but multiply egress cost. Incremental approaches (Iceberg, CDC) reduce ongoing cost but require change tracking, schema evolution handling, and more complex failure recovery procedures.",
                severity: "medium",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-5 space-y-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border:
                    item.severity === "high"
                      ? "1px solid rgba(244,63,94,0.2)"
                      : "1px solid rgba(251,191,36,0.2)",
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        item.severity === "high" ? "#f43f5e" : "#fbbf24",
                    }}
                  />
                  <h3 className="text-sm font-semibold text-white leading-tight">{item.title}</h3>
                </div>
                <p className="text-sm text-[#64748b] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── RECOMMENDATION ─── */}
        <section className="space-y-6">
          <SectionLabel label="Recommendation" />
          <h2 className="text-2xl font-bold text-white">Final Recommendation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "rgba(52,211,153,0.06)",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}
                >
                  Primary
                </span>
                <h3 className="text-white font-semibold">
                  Alt 6 — Service Rewrite (~$2,100/month)
                </h3>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Rewrite sobek, lilo, and hubble services to operate natively on BigQuery. By
                eliminating Snowflake as the serving layer entirely, this approach removes
                all cross-cloud egress and the secure view constraint in one architectural
                move.
              </p>
              <ul className="space-y-1.5">
                {[
                  "Eliminates ongoing cross-cloud egress cost",
                  "Resolves secure view incompatibility permanently",
                  "Enables GCP-native tooling (Dataflow, Pub/Sub)",
                  "Long-term lowest operational cost",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#34d399" }} className="flex-shrink-0 mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#64748b] pt-1">
                Caveat: Highest upfront engineering investment. Requires phased delivery
                across the three service teams.
              </p>
            </div>

            {/* Fallback */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "rgba(251,191,36,0.04)",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase"
                  style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
                >
                  Fallback
                </span>
                <h3 className="text-white font-semibold">
                  Alt 2 — Iceberg Tables (~$2,600/month)
                </h3>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Dynamic Iceberg Tables allow Snowflake to expose data as open table format
                that BigQuery can read natively via BigLake. Incremental refreshes mean
                only changed data crosses the cloud boundary.
              </p>
              <ul className="space-y-1.5">
                {[
                  "No service rewrites required",
                  "Incremental egress — only changed rows cross clouds",
                  "Retains Snowflake as authoritative warehouse",
                  "Faster time-to-delivery than full service rewrite",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#fbbf24" }} className="flex-shrink-0 mt-0.5">◆</span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#64748b] pt-1">
                Caveat: Secure view materialization must still be solved. Iceberg tables
                require careful schema evolution management.
              </p>
            </div>
          </div>

          {/* Reasoning */}
          <div
            className="rounded-xl p-6 space-y-3"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Decision Rationale
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
              The $6,600/month difference between the cheapest and most expensive alternatives
              justifies engineering investment. Alt 6 eliminates the architectural debt of
              maintaining dual-cloud query paths and resolves the secure view constraint as a
              first-class concern rather than a workaround. Alt 2 is recommended only if
              delivery timeline constraints make a phased service rewrite infeasible in the
              near term.
            </p>
          </div>
        </section>

        {/* ─── TECH STACK ─── */}
        <section className="space-y-6">
          <SectionLabel label="Tech Stack" />
          <div className="flex flex-wrap gap-3">
            {[
              "Snowflake",
              "BigQuery",
              "AWS",
              "GCP",
              "dbt",
              "Python",
              "Optimizely Analytics",
              "NetSpring",
              "Segment",
              "Power BI",
              "Architecture Decision Records",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          className="pt-8 pb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Wahid Tawsif Ratul</p>
            <p className="text-xs text-[#64748b]">Product Analytics Engineer · Optimizely</p>
          </div>
          <GithubLink />
        </footer>

      </div>
    </main>
  );
}

/* ── Reusable sub-components ── */

function Divider() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.3), transparent)" }}
    />
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-bold tracking-[0.2em] uppercase px-2 py-1 rounded"
        style={{
          color: "#f43f5e",
          background: "rgba(244,63,94,0.1)",
          border: "1px solid rgba(244,63,94,0.2)",
        }}
      >
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function AdrCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-5 space-y-3"
      style={{
        background: accent ? "rgba(244,63,94,0.06)" : "rgba(255,255,255,0.03)",
        border: accent
          ? "1px solid rgba(244,63,94,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h3
        className="text-xs font-semibold tracking-[0.15em] uppercase"
        style={{ color: accent ? "#f43f5e" : "#64748b" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
