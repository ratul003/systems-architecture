import GithubLink from "./GithubLink";
import React from "react";

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
        <section className="pt-8 space-y-8 hero-section">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f43f5e] mb-4">
              Portfolio Case Study
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              <span className="gradient-heading">Systems Architecture</span>{" "}&amp;{" "}
              <br className="hidden md:block" />
              Platform Design
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-[#94a3b8] leading-relaxed">
            Two decisions that each had a single right answer — but neither was obvious until
            I did the work to rule out the alternatives. This is how I made the case and what we shipped.
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { label: "2 Major ADRs", icon: "◈" },
              { label: "Large-Scale Migration", icon: "◈" },
              { label: "6 Alternatives Evaluated", icon: "◈" },
              { label: "Significant Cost Avoided", icon: "◈" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium stat-glow"
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
        <section id="adr1" className="space-y-8">
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
               : a warehouse-native analytics layer that queries Snowflake directly without
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
                  body: "Data pipelines broke whenever Snowflake schema changed. A set of mirror tables required constant maintenance to stay in sync: schema drift created data gaps and analyst distrust.",
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
                  body: "Mixpanel data lived in a silo: impossible to join engagement metrics to ARR, experiment results, or Salesforce CRM data for account-level analysis.",
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
                  body: "Queries Snowflake directly: zero sync infrastructure, no ETL pipelines, no mirror tables to maintain.",
                },
                {
                  title: "ARR-Linked Metrics",
                  body: "Engagement data can be joined to ARR and Salesforce, enabling product-led growth analysis at the account level.",
                },
                {
                  title: "Cross-Product Joins",
                  body: "Unified analysis across Optimizely's product suite: experiment results, Content Management System, feature flags, and analytics in one query.",
                },
                {
                  title: "Opti on Opti",
                  body: "Optimizely's own product: internal dogfooding aligns vendor incentives with real usage and accelerates feature development.",
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
                  "All dashboards and metrics to be ported and validated",
                  "Team ramp-up on new query and modeling paradigms",
                  "Parallel-run period maintaining both platforms",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#f43f5e] mt-0.5 flex-shrink-0">·</span>
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
                  "All dashboards migrated with parity validation",
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

        {/* Personal decision narrative */}
        <div className="rounded-xl p-6 space-y-3" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}>
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#f43f5e]">My recommendation</h3>
          <p className="text-sm text-[#94a3b8] leading-relaxed">
            Mixpanel was working. This migration was my recommendation to leadership: not a mandate from above.
            I made the case on three grounds: sync fragility was degrading trust in numbers at the board level;
            per-user pricing had a non-linear cost curve that was about to get expensive; and the structural inability
            to join behavioural data to ARR meant we could never build a real PLG motion on top of Mixpanel.
            The full parallel-run across all dashboards was my design: no stakeholder lost visibility during migration.
          </p>
        </div>

        {/* ─── BEFORE / AFTER ARCHITECTURE ─── */}
        <section id="architecture" className="space-y-6">
          <SectionLabel label="Architecture" />
          <h2 className="text-2xl font-bold text-white">Before &amp; After</h2>
          <p className="text-[#94a3b8] text-sm max-w-xl">
            The fundamental problem was a mirror. Snowflake was the source of truth, but Mixpanel
            needed its own copy. Every schema change broke the sync; every broken sync broke a dashboard;
            every broken dashboard eroded trust in the numbers. Removing the mirror removed the problem.
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
                  { node: "Mirror tables", note: "Sync layer requiring constant maintenance", highlight: true },
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

        {/* ─── MULTI-TOOL REPORTING ─── */}
        <section className="space-y-6">
          <SectionLabel label="ADR-001b" />
          <h2 className="text-2xl font-bold text-white">Why OA + PowerBI coexist</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            When I migrated to OA, the obvious question was: why keep PowerBI at all? The answer is
            that they answer different questions for different people at different speeds. I kept both
            because collapsing them would have made each audience worse off, not better.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>OA: Optimizely Analytics</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Audience", value: "Product Managers, Analytics" },
                  { label: "Cadence", value: "Daily / real-time exploration" },
                  { label: "Strengths", value: "Behavioural cohorts, funnel analysis, cross-product joins, warehouse-native" },
                  { label: "Dashboards", value: "Multi-tier dashboards: usage, adoption, Opal, PSAT" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-[#64748b] font-medium w-24 flex-shrink-0">{label}</span>
                    <span className="text-[#94a3b8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(242,200,17,0.07)", border: "1px solid rgba(242,200,17,0.2)" }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(242,200,17,0.15)", color: "#F2C811" }}>PowerBI: Business Intelligence</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Audience", value: "Sales, CS, Finance, Executive" },
                  { label: "Cadence", value: "Weekly / monthly reporting" },
                  { label: "Strengths", value: "Revenue modelling, contract overages, ARR forecasting, board-ready formatting" },
                  { label: "Reports", value: "BI reports: overages, Opal billing, DXP forecasts" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-[#64748b] font-medium w-24 flex-shrink-0">{label}</span>
                    <span className="text-[#94a3b8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b] mb-2">Why both</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              OA is for when a PM asks "which accounts stopped using experiments after their first month?" — it joins
              behavioural cohorts to ARR in one live Snowflake query. PowerBI is for when Finance asks "how much
              does this customer owe us in overages?" — formatted, auditable, integrated with contract data.
              I tried to route both needs through OA. Finance said the pivot tables weren&apos;t good enough.
              They were right. Two tools it is.
            </p>
          </div>
        </section>

        <Divider />

        {/* ─── ADR 2 ─── */}
        <section id="adr2" className="space-y-8">
          <SectionLabel label="ADR-002" />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Cloud Migration Evaluation
            </h2>
            <p className="text-[#94a3b8]">
              Optimizely Data Platform: Snowflake on AWS → BigQuery on GCP
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
                <span className="text-white font-semibold">Multi-TB</span> compressed data
              </span>
              <span>
                <span className="text-white font-semibold">Many</span> per-customer databases
              </span>
              <span>
                <span className="text-white font-semibold">3 core platform services</span> affected
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
                      cost: "Very High",
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
                      cost: "Low",
                      complexity: "Medium",
                      costColor: "#34d399",
                      complexityColor: "#fbbf24",
                      recommended: false,
                      fallback: true,
                    },
                    {
                      num: "3",
                      name: "Weekly Full Parquet",
                      approach: "Scheduled full Parquet export to BigQuery",
                      cost: "High",
                      complexity: "Low",
                      costColor: "#f43f5e",
                      complexityColor: "#34d399",
                      recommended: false,
                    },
                    {
                      num: "4",
                      name: "Materialized Views",
                      approach: "Snowflake materialized views replicated to BQ",
                      cost: "Medium",
                      complexity: "Medium",
                      costColor: "#fbbf24",
                      complexityColor: "#fbbf24",
                      recommended: false,
                    },
                    {
                      num: "5",
                      name: "ECO Caching",
                      approach: "Egress Cost Optimizer caching layer",
                      cost: "Medium",
                      complexity: "Medium",
                      costColor: "#fbbf24",
                      complexityColor: "#fbbf24",
                      recommended: false,
                    },
                    {
                      num: "6",
                      name: "Service Rewrite",
                      approach: "Rewrite core platform services as BQ-native services",
                      cost: "Lowest",
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
        <section id="cost" className="space-y-6">
          <SectionLabel label="Cost Model" />
          <h2 className="text-2xl font-bold text-white">Egress Dominates</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            At this data scale, data transfer costs account for 80–90% of total migration cost.
            This asymmetry drove the evaluation toward architectures that minimize data movement.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "AWS Egress",
                value: "High",
                unit: "Primary cost driver",
                note: "Charged per GB leaving AWS",
                highlight: true,
              },
              {
                label: "Snowflake Cross-Cloud",
                value: "High",
                unit: "Compounding cost",
                note: "On top of cloud egress fees",
                highlight: true,
              },
              {
                label: "BigQuery Storage",
                value: "Low",
                unit: "At-rest cost",
                note: "Relatively cheap once data is in GCP",
                highlight: false,
              },
              {
                label: "BigQuery Query",
                value: "Variable",
                unit: "On-demand",
                note: "Charged per TB scanned on-demand",
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-5 space-y-2"
                style={{
                  background: item.highlight ? "rgba(244,63,94,0.07)" : "rgba(255,255,255,0.03)",
                  border: item.highlight ? "1px solid rgba(244,63,94,0.2)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-xs text-[#64748b] font-medium">{item.label}</p>
                <p className="text-2xl font-bold" style={{ color: item.highlight ? "#f43f5e" : "#e2e8f0" }}>
                  {item.value}
                </p>
                <p className="text-xs text-[#64748b]">{item.unit}</p>
                <p className="text-xs" style={{ color: item.highlight ? "#fda4af" : "#64748b" }}>{item.note}</p>
              </div>
            ))}
          </div>

          {/* Egress dominance */}
          <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">
              Cost Breakdown · Full Export Scenario
            </h3>
            <div className="space-y-3">
              {[
                { label: "AWS Egress", note: "Dominant cost: charged per GB, multiplied by full export volume", pct: 89 },
                { label: "Snowflake Cross-Cloud Transfer", note: "Additional fee charged on top of AWS egress for cross-cloud movement", pct: 11 },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-sm gap-4">
                    <span className="text-[#94a3b8]">{row.label}</span>
                    <span className="text-white font-semibold text-xs flex-shrink-0">{row.pct}% of total</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.pct > 50 ? "#f43f5e" : "rgba(244,63,94,0.4)" }} />
                  </div>
                  <p className="text-xs text-[#64748b]">{row.note}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748b]">
              Full weekly export scenario: egress alone dominates the cost model. Approaches that minimise data movement across cloud boundaries dramatically reduce ongoing operational cost.
            </p>
          </div>
        </section>

        {/* ─── ARCHITECTURAL CONSTRAINTS ─── */}
        <section id="constraints" className="space-y-6">
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
                body: "BigQuery Data Transfer Service only supports tables, not Snowflake secure views. Customer data is exposed exclusively via secure views: the primary connector for GCP cannot read it. Any migration must handle this by materializing data upstream.",
                severity: "high",
              },
              {
                title: "Per-Customer Database Sprawl",
                body: "The Optimizely Data Platform uses a per-customer database pattern with many separate customer databases. Each represents an independent orchestration unit: a naive export would require many parallel jobs, dramatically increasing coordination complexity and failure surface area.",
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
        <section id="recommendation" className="space-y-6">
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
                  Alt 6: Service Rewrite (Lowest ongoing cost)
                </h3>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Rewrite the three core platform services to operate natively on BigQuery. By
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
                  Alt 2: Iceberg Tables (Low ongoing cost)
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
                  "Incremental egress: only changed rows cross clouds",
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
              The significant cost difference between the cheapest and most expensive alternatives
              justifies the engineering investment. Alt 6 eliminates the architectural debt of
              maintaining dual-cloud query paths and resolves the secure view constraint as a
              first-class concern rather than a workaround. Alt 2 is recommended only if
              delivery timeline constraints make a phased service rewrite infeasible in the
              near term.
            </p>
          </div>
        </section>

        {/* ─── TECH STACK ─── */}
        <section id="stack" className="space-y-6">
          <SectionLabel label="Tech Stack" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {["Snowflake", "BigQuery", "AWS", "GCP", "dbt", "Python", "Optimizely Analytics", "NetSpring", "Segment", "Power BI"].map((tag) => (
              <SAToolCard key={tag} name={tag} />
            ))}
          </div>
          <div className="mt-3">
            <span style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "20px", padding: "6px 14px", fontSize: "0.82rem", color: "#fda4af", fontWeight: 600 }}>Architecture Decision Records</span>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer
          className="pt-8 pb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="space-y-4">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#64748b", marginRight: "4px" }}>Portfolio</span>
              {[
                { label: "Product Intelligence Platform", href: "https://product-intelligence-platform.vercel.app", color: "#6366f1" },
                { label: "Data Engineering Foundation", href: "https://data-engineering-foundation.vercel.app", color: "#10b981" },
                { label: "Experimentation Science", href: "https://experimentation-science.vercel.app", color: "#f59e0b" },
              ].map(({ label, href, color }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.79rem", fontWeight: 500, color: "#94a3b8", textDecoration: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "7px", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {label}
                </a>
              ))}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Written case study: all architecture decisions, cost models, and constraints described from first-hand evaluation work at Optimizely. No proprietary data reproduced.</div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Wahid Tawsif Ratul</p>
              <p className="text-xs text-[#64748b]">Product Analytics Engineer · Optimizely</p>
            </div>
          </div>
          <GithubLink />
        </footer>

      </div>
    </main>
  );
}

/* ── Reusable sub-components ── */

function Divider() {
  return <div className="divider-gradient" />;
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
      className="rounded-xl p-5 space-y-3 card-hover"
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

// ── Tool logos ────────────────────────────────────────────────────────────────

const SA_TOOLS: Record<string, { color: string; category: string; svg: React.ReactNode }> = {
  Snowflake: {
    color: "#29B5E8", category: "Data Warehouse",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><line x1="12" y1="2" x2="12" y2="22" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="22" y2="12" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2.5" fill="#29B5E8"/></svg>,
  },
  BigQuery: {
    color: "#4285F4", category: "GCP Analytics",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M4 6h16v12H4z" stroke="#4285F4" strokeWidth="1.8" fill="#4285F4" fillOpacity="0.12"/><path d="M8 10h8M8 14h5" stroke="#4285F4" strokeWidth="1.8" strokeLinecap="round"/><circle cx="18" cy="18" r="3" fill="#4285F4" fillOpacity="0.3" stroke="#4285F4" strokeWidth="1.5"/><path d="M20 20l2 2" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  AWS: {
    color: "#FF9900", category: "Cloud (source)",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M7 14c-1.7-.5-3-2-3-3.8C4 8.3 5.8 6.5 8 6.5c.3 0 .5 0 .8.1A5 5 0 0 1 18 9c1.1 0 2 .9 2 2s-.9 2-2 2H7z" stroke="#FF9900" strokeWidth="1.6" fill="#FF9900" fillOpacity="0.1"/><path d="M6 18l2-2 2 2M14 18l2-2 2 2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  GCP: {
    color: "#34A853", category: "Cloud (target)",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="9" stroke="#34A853" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#34A853" fillOpacity="0.3"/></svg>,
  },
  dbt: {
    color: "#FF694B", category: "Transformation",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#FF694B" strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 7L12 12L20 7" stroke="#FF694B" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/><line x1="12" y1="12" x2="12" y2="22" stroke="#FF694B" strokeWidth="1.8" opacity="0.5"/></svg>,
  },
  Python: {
    color: "#3776AB", category: "Scripting",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M12 2C9 2 8 3.5 8 5v3h4.5v1H5.5C3.5 9 2 10.5 2 13s1.4 4 3.5 4H7v-2.5C7 12.5 8.5 11 11 11h6c2 0 3-1.2 3-3V5c0-2-1.5-3-8-3Z" fill="#3776AB" fillOpacity="0.8"/><circle cx="10" cy="5.5" r="1" fill="white"/><path d="M12 22c3 0 4-1.5 4-3v-3h-4.5v-1h6.5c2 0 3.5-1.5 3.5-4s-1.4-4-3.5-4H17v2.5C17 11.5 15.5 13 13 13H7c-2 0-3 1.2-3 3v3c0 2 1.5 3 8 3Z" fill="#FFD43B" fillOpacity="0.9"/><circle cx="14" cy="18.5" r="1" fill="#3776AB"/></svg>,
  },
  "Optimizely Analytics": {
    color: "#6366f1", category: "Product Analytics",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="9" stroke="#6366f1" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="#6366f1" opacity="0.25"/><circle cx="12" cy="12" r="1.5" fill="#6366f1"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  Segment: {
    color: "#52BD94", category: "Event Collection",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M18 7H10a5 5 0 0 0 0 10h3" stroke="#52BD94" strokeWidth="2" strokeLinecap="round"/><path d="M6 17h8a5 5 0 0 0 0-10H9" stroke="#52BD94" strokeWidth="2" strokeLinecap="round" opacity="0.55"/><circle cx="18" cy="7" r="2" fill="#52BD94"/><circle cx="6" cy="17" r="2" fill="#52BD94" opacity="0.55"/></svg>,
  },
  "Power BI": {
    color: "#F2C811", category: "Business Intelligence",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="14" y="4" width="6" height="16" rx="1.5" fill="#F2C811"/><rect x="8" y="9" width="5" height="11" rx="1.5" fill="#F2C811" opacity="0.7"/><rect x="2" y="14" width="5" height="6" rx="1.5" fill="#F2C811" opacity="0.4"/></svg>,
  },
  NetSpring: {
    color: "#f43f5e", category: "OA Engine",
    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="3" y="3" width="8" height="8" rx="2" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" strokeWidth="1.5"/><rect x="13" y="3" width="8" height="8" rx="2" fill="#f43f5e" fillOpacity="0.1" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6"/><rect x="3" y="13" width="8" height="8" rx="2" fill="#f43f5e" fillOpacity="0.1" stroke="#f43f5e" strokeWidth="1.5" opacity="0.6"/><rect x="13" y="13" width="8" height="8" rx="2" fill="#f43f5e" fillOpacity="0.05" stroke="#f43f5e" strokeWidth="1.5" opacity="0.4"/></svg>,
  },
};

function SAToolCard({ name }: { name: string }) {
  const t = SA_TOOLS[name];
  if (!t) return (
    <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "6px 14px", fontSize: "0.88rem", color: "#94a3b8" }}>{name}</span>
  );
  return (
    <div className="card-hover" style={{ background: `${t.color}10`, border: `1px solid ${t.color}28`, borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column" as const, gap: "10px" }}>
      <div style={{ width: "28px", height: "28px" }}>{t.svg}</div>
      <div>
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#e2e8f0" }}>{name}</div>
        <div style={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: t.color, marginTop: "3px" }}>{t.category}</div>
      </div>
    </div>
  );
}
