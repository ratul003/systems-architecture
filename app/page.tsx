"use client";
import React, { useState, useEffect, useRef } from "react";

// ── Data Constants ────────────────────────────────────────────────────────────

const WIN_METRICS = [
  { metric: "100+", label: "Weekly active users",         sub: "Analysts, product managers, Finance, Customer Success across all dashboard tiers", color: "#f43f5e", delay: 0   },
  { metric: "0",    label: "Data loss events",            sub: "Append-only RAW layer: full audit trail since migration", color: "#34d399", delay: 100 },
  { metric: "<2s",  label: "Query latency P95",           sub: "Warehouse-native: no sync overhead, no mirror tables",    color: "#38bdf8", delay: 200 },
  { metric: "6",    label: "Alternatives evaluated",      sub: "Five rejected on cost or constraint · one recommended",   color: "#fbbf24", delay: 300 },
  { metric: "89%",  label: "Of full-export cost is egress", sub: "The asymmetry that drove every architecture decision",  color: "#a5b4fc", delay: 400 },
];

const TIMELINE_MILESTONES = [
  {
    phase: "Discovery", color: "#f43f5e", icon: "◉",
    desc: "Board deck shows two numbers for the same metric. Sync failures are accumulating. MTU cost curve is about to get expensive. The platform works - but not well enough.",
    outcomes: ["Sync fragility documented", "Cost model started", "Stakeholder trust declining"],
  },
  {
    phase: "Analysis", color: "#fbbf24", icon: "◈",
    desc: "Six migration approaches evaluated. Cost model built from first principles. The 89% egress asymmetry discovered. Five alternatives ruled out one by one on constraint or cost.",
    outcomes: ["89% egress cost identified", "Secure view constraint found", "Architecture Decision Records drafted"],
  },
  {
    phase: "Decision", color: "#a5b4fc", icon: "◆",
    desc: "Decision Record 001 approved: Mixpanel out, the in-house analytics platform in. Decision Record 002 approved: Service Rewrite primary, Iceberg fallback. Both decisions challenged. Both held.",
    outcomes: ["2 decisions approved by leadership", "Engineering roadmap set", "Parallel-run period designed"],
  },
  {
    phase: "Migration", color: "#38bdf8", icon: "◇",
    desc: "Parallel-run period with both platforms live simultaneously. All dashboards rebuilt and validated. No stakeholder loses access at any point. Zero downtime.",
    outcomes: ["Zero-downtime parallel run", "All dashboards rebuilt + validated", "Parity confirmed"],
  },
  {
    phase: "Production", color: "#34d399", icon: "◉",
    desc: "Mixpanel decommissioned. The in-house analytics platform is the single source. 100+ weekly active users from day one. Zero data loss events since launch.",
    outcomes: ["100+ weekly active users from day one", "0 data loss events", "Board deck: one number, one source"],
  },
];

const COST_COMPARISON = [
  { name: "Weekly Full Parquet Export",          verdict: "REJECTED", relCost: 100, color: "#f43f5e", note: "89% is AWS egress: non-viable at this data volume" },
  { name: "Scheduled Parquet + ECO Hybrid",      verdict: "REJECTED", relCost: 88,  color: "#f43f5e", note: "ECO reduces cache-miss cost: doesn't fix the architecture" },
  { name: "ECO Caching Layer Only",              verdict: "REJECTED", relCost: 80,  color: "#f43f5e", note: "Optimises a broken pattern: doesn't change it" },
  { name: "Materialized Views via BQ DTS",       verdict: "REJECTED", relCost: 68,  color: "#f43f5e", note: "Hard block: BQ DTS cannot read Snowflake secure views" },
  { name: "Iceberg Tables (incremental)",        verdict: "FALLBACK",  relCost: 22,  color: "#fbbf24", note: "Secure view materialization still unsolved upstream" },
  { name: "Service Rewrite (BigQuery-native)",   verdict: "PRIMARY",   relCost: 4,   color: "#34d399", note: "Eliminates cross-cloud egress entirely: cost goes to near-zero" },
];

const DECISION_MATRIX = {
  criteria: ["Egress Cost", "Secure View", "Eng. Effort", "LT Cost Trend", "Removes Root Cause"],
  rows: [
    {
      num: 1, name: "Full Export",         verdict: "REJECTED", verdictColor: "#f43f5e",
      cells: [
        { text: "Very High",   rating: "bad"  },
        { text: "OK",          rating: "good" },
        { text: "Low",         rating: "good" },
        { text: "Grows",       rating: "bad"  },
        { text: "No",          rating: "bad"  },
      ],
    },
    {
      num: 3, name: "Weekly Parquet",      verdict: "REJECTED", verdictColor: "#f43f5e",
      cells: [
        { text: "Very High",   rating: "bad"  },
        { text: "OK",          rating: "good" },
        { text: "Low",         rating: "good" },
        { text: "Grows",       rating: "bad"  },
        { text: "No",          rating: "bad"  },
      ],
    },
    {
      num: 5, name: "ECO Caching",         verdict: "REJECTED", verdictColor: "#f43f5e",
      cells: [
        { text: "Reduced",     rating: "mid"  },
        { text: "OK",          rating: "good" },
        { text: "Medium",      rating: "mid"  },
        { text: "Still Grows", rating: "bad"  },
        { text: "No",          rating: "bad"  },
      ],
    },
    {
      num: 4, name: "Mat. Views (BQ DTS)", verdict: "REJECTED", verdictColor: "#f43f5e",
      cells: [
        { text: "Medium",      rating: "mid"  },
        { text: "BLOCKED",     rating: "bad"  },
        { text: "Medium",      rating: "mid"  },
        { text: "Stable",      rating: "mid"  },
        { text: "No",          rating: "bad"  },
      ],
    },
    {
      num: 2, name: "Iceberg Tables",      verdict: "FALLBACK",  verdictColor: "#fbbf24",
      cells: [
        { text: "Low",         rating: "good" },
        { text: "Partial",     rating: "mid"  },
        { text: "Medium",      rating: "mid"  },
        { text: "Stable",      rating: "good" },
        { text: "Partial",     rating: "mid"  },
      ],
    },
    {
      num: 6, name: "Service Rewrite",     verdict: "PRIMARY",   verdictColor: "#34d399",
      cells: [
        { text: "Near Zero",   rating: "good" },
        { text: "Eliminated",  rating: "good" },
        { text: "Very High",   rating: "bad"  },
        { text: "Best",        rating: "good" },
        { text: "Yes",         rating: "good" },
      ],
    },
  ],
};

const STORY_CHAPTERS = [
  { label: "Ch01", title: "The Problem",          desc: "Two things were broken",                      href: "#problem"   },
  { label: "Ch02", title: "The Analysis",         desc: "How I ruled out 5 of 6",                     href: "#analysis"  },
  { label: "Ch03", title: "The Decision",         desc: "What shipped and why it held",                href: "#decision"  },
  { label: "Ch04", title: "Patterns That Travel", desc: "Not platform-specific",                       href: "#patterns"  },
];

const BEFORE_DIMS = [
  { label: "Sync reliability",   score: 2, color: "#ef4444", desc: "Schema changes broke pipelines weekly; sync failures created silent data gaps"              },
  { label: "Query flexibility",  score: 2, color: "#ef4444", desc: "No joins to ARR, experiments, or Salesforce: behavioural data lived in a silo"             },
  { label: "Stakeholder trust",  score: 3, color: "#ef4444", desc: "Two systems, two numbers; board reporting required manual reconciliation every cycle"        },
  { label: "Cost scalability",   score: 3, color: "#ef4444", desc: "MTU pricing scales with user count, not value: a non-linear curve about to get expensive"   },
  { label: "Analysis speed",     score: 2, color: "#ef4444", desc: "Days to reconcile data before any meaningful analysis could begin"                          },
  { label: "Cross-product view", score: 1, color: "#ef4444", desc: "No unified view across products: each product's behavioural data was an island"             },
];

const AFTER_DIMS = [
  { label: "Sync reliability",   score: 9, color: "#34d399", desc: "Zero sync layer: Snowflake is the single source; no mirror tables or sync jobs to break"        },
  { label: "Query flexibility",  score: 9, color: "#34d399", desc: "ARR joins, experiment joins, cross-product cohorts: one live Snowflake query, no ETL"           },
  { label: "Stakeholder trust",  score: 9, color: "#34d399", desc: "One number, one source: board-level reporting from the same warehouse as the product data"      },
  { label: "Cost scalability",   score: 8, color: "#34d399", desc: "Warehouse compute scales with query volume, not active user headcount"                           },
  { label: "Analysis speed",     score: 9, color: "#34d399", desc: "Analysts query directly: no export wait, no reconciliation, no gap-filling before analysis"     },
  { label: "Cross-product view", score: 9, color: "#34d399", desc: "Unified cohorts across Experimentation, CMS, Feature Flags, and the AI agent in a single query"        },
];

const ALT_DETAILS = [
  {
    num: 1, name: "Full Export", approach: "Weekly full Parquet dump from Snowflake to GCS",
    verdict: "REJECTED", verdictColor: "#f43f5e", cost: "Very High", complexity: "Low",
    reason: "At this data volume, AWS egress costs alone account for 89% of the total monthly cost model. Full export means moving the entire dataset every week: the per-GB charge multiplied by total compressed data, indefinitely. The cost model was non-viable before a single line of engineering was written.",
    constraint: "Data volume × egress rate = rejection before engineering begins",
    learn: null,
  },
  {
    num: 2, name: "Dynamic Iceberg Tables", approach: "Native incremental refresh via Snowflake Iceberg to BigLake",
    verdict: "FALLBACK", verdictColor: "#fbbf24", cost: "Low", complexity: "Medium",
    reason: "Only changed rows cross the cloud boundary on each refresh: dramatically better than full export. The unresolved constraint is secure view materialization. Customer data is exposed only through Snowflake secure views, which Iceberg tables must materialize upstream. For a per-customer database pattern, this adds non-trivial orchestration complexity.",
    constraint: "Secure view materialization required for per-customer database pattern",
    learn: { term: "How Iceberg tables work", body: "Apache Iceberg is an open table format that enables incremental, transactionally consistent snapshots. Snowflake can expose its internal storage as an Iceberg table, which BigQuery can then read via BigLake: meaning only the delta (changed rows) crosses the cloud boundary on each refresh, not the full dataset." },
  },
  {
    num: 3, name: "Weekly Full Parquet", approach: "Scheduled full Parquet export from Snowflake to BigQuery",
    verdict: "REJECTED", verdictColor: "#f43f5e", cost: "High", complexity: "Low",
    reason: "Same egress cost problem as Alt 1, with added scheduling coordination across many customer databases. Full-export approaches all converge on the same ceiling: you pay to move everything every time, regardless of what changed.",
    constraint: "Same root cause as Alt 1: full export is always egress-dominated",
    learn: null,
  },
  {
    num: 4, name: "Materialized Views", approach: "Snowflake materialized views to BigQuery via Data Transfer Service",
    verdict: "REJECTED", verdictColor: "#f43f5e", cost: "Medium", complexity: "Medium",
    reason: "The BigQuery Data Transfer Service only supports Snowflake tables, not secure views. Customer data in the customer data platform (CDP) is exposed exclusively through secure views. This hits a hard incompatibility before data movement even starts.",
    constraint: "BQ Data Transfer Service cannot read Snowflake secure views",
    learn: { term: "What are Snowflake Secure Views?", body: "Secure views in Snowflake hide the underlying SQL definition from consumers, unlike standard views. This is used for customer data isolation: each customer's database is exposed only via a secure view that enforces row-level access control. The BigQuery Data Transfer Service can replicate standard tables, but not secure views, because it cannot execute the view's hidden SQL against the source database." },
  },
  {
    num: 5, name: "ECO Caching", approach: "Egress Cost Optimizer caching layer at the cloud boundary",
    verdict: "REJECTED", verdictColor: "#f43f5e", cost: "Medium", complexity: "Medium",
    reason: "ECO reduces cost on frequently-accessed data by caching at the boundary. It doesn't eliminate cross-cloud movement: it makes the most expensive pattern slightly cheaper. A caching layer still requires sync infrastructure, still breaks on schema changes, and still exposes egress cost on cache misses.",
    constraint: "Reduces the cost of a broken architecture: doesn't change the architecture",
    learn: null,
  },
  {
    num: 6, name: "Service Rewrite", approach: "Rewrite core platform services as BigQuery-native",
    verdict: "PRIMARY", verdictColor: "#34d399", cost: "Lowest ongoing", complexity: "High",
    reason: "The only approach that eliminates cross-cloud egress entirely. By rewriting the three core platform services to operate natively on BigQuery, Snowflake exits the serving layer: and with it go the egress cost and the secure view constraint, permanently. This is the only option with an improving long-term cost curve.",
    constraint: "Highest upfront engineering investment; phased delivery across three service teams",
    learn: null,
  },
];

const PIPELINE_NODES = [
  {
    id: "segment", label: "Segment", sub: "Event Collection", color: "#52BD94",
    icon: "◉",
    desc: "Every user interaction from 8 product surfaces emits a Track(), Identify(), or Group() call through the Segment SDK. This is the entry point: nothing enters the warehouse that hasn't passed through here first.",
    metrics: [
      { k: "Events/week",        v: "696K+"    },
      { k: "Ingestion latency",  v: "<100ms"   },
      { k: "Product surfaces",   v: "8"        },
      { k: "Data loss",          v: "0 events" },
    ],
    ai: [
      "Predictive Traits: ML-scored user properties (churn probability, LTV, activation likelihood) computed from event history",
      "Audience AI: natural language audience builder that resolves plain-English descriptions into SQL segment conditions",
      "Protocols: AI-assisted schema anomaly detection flags unexpected event shape changes before they reach the warehouse",
    ],
  },
  {
    id: "protocols", label: "Protocols", sub: "Validation Gate", color: "#f59e0b",
    icon: "◈",
    desc: "The schema enforcement layer. Malformed events (wrong types, missing required fields, unexpected properties) are blocked here before touching the warehouse. This gate is what keeps RAW clean and the audit trail trustworthy.",
    metrics: [
      { k: "Schema coverage",          v: "100%"    },
      { k: "Gate evaluation",          v: "<1ms"    },
      { k: "Malformed events to RAW",  v: "0"       },
      { k: "Blocking mode",            v: "Active"  },
    ],
    ai: [
      "AI-suggested schema rules generated automatically from historical event pattern analysis",
      "Computed Traits with ML scoring applied at ingestion time: user properties computed before hitting Snowflake",
      "Anomaly detection flags schema drift and volume drops in real time, before downstream dashboards go silent",
    ],
  },
  {
    id: "raw", label: "Snowflake RAW", sub: "Immutable Landing", color: "#29B5E8",
    icon: "◆",
    desc: "The append-only landing zone. Every event is preserved exactly as received: no transformation, no enrichment, no deletion. RAW is the audit trail. If any downstream transformation breaks, you replay from here. Zero data loss is a structural guarantee, not a monitoring goal.",
    metrics: [
      { k: "Write pattern",       v: "Append-only"  },
      { k: "Data loss events",    v: "0"            },
      { k: "Retention",           v: "Full history" },
      { k: "Replay capability",   v: "Yes"          },
    ],
    ai: [
      "Snowflake Cortex ML.ANOMALY_DETECTION: flags unusual drops in event volume before they surface as silent dashboard failures",
      "Snowpark Python UDFs: custom transformation logic running inside Snowflake without data movement",
      "Document AI: extract structured data from PDFs and images stored alongside event data in Snowflake stages",
    ],
  },
  {
    id: "dbt", label: "dbt Transform", sub: "Staging → Mart", color: "#FF694B",
    icon: "◇",
    desc: "Three transformation layers: Staging (rename, cast, deduplicate), Intermediate (business logic, identity resolution, cross-source joins), Mart (final analytical shape). Every model is tested, documented, and version-controlled. 488K jobs run per week with 100% test coverage.",
    metrics: [
      { k: "dbt jobs/week",     v: "488K"   },
      { k: "Test coverage",     v: "100%"   },
      { k: "Model layers",      v: "3"      },
      { k: "Avg run time",      v: "<8 min" },
    ],
    ai: [
      "dbt Copilot: AI-generated model scaffolding from plain-language business logic descriptions, tests and docs included",
      "Semantic Layer: define metrics once in dbt, query from the Analytics Platform, Power BI, or any AI agent without duplication or drift",
      "Auto-documentation: AI-generated column and model descriptions from SQL patterns, synced to dbt Explorer",
    ],
  },
  {
    id: "reporting", label: "REPORTING", sub: "Curated Analytics", color: "#6366f1",
    icon: "◉",
    desc: "The consumption-ready layer. ARR joins, identity resolution, and cross-product cohorts are pre-computed and materialized. The in-house analytics platform queries this layer directly via Snowflake: no ETL, no sync, no mirror tables. Sub-2-second query latency for 100+ weekly active users.",
    metrics: [
      { k: "Query latency P95",     v: "<2s"        },
      { k: "ARR join availability", v: "Yes"        },
      { k: "Identity resolution",   v: "MCID + userId" },
      { k: "Sync overhead",         v: "None"       },
    ],
    ai: [
      "Cortex Analyst: ask business questions in plain English, get SQL executed directly against Snowflake",
      "ML.FORECAST: 90-day experiment adoption and engagement forecasting natively in SQL, no Python pipeline needed",
      "CORTEX.COMPLETE(): call LLMs (Llama 3, Mistral) from SQL for summarization, scoring, and text extraction",
    ],
  },
  {
    id: "consumers", label: "Consumers", sub: "Dashboards + AI Agents", color: "#f43f5e",
    icon: "◈",
    desc: "Three consumer tiers on the same Snowflake data: the in-house analytics platform for product analytics (product managers, daily exploration), Power BI for business intelligence (Finance, weekly reporting), and AI Agent workflows for analytics (board prep, Customer Success alerts, roadmap analysis). 100+ weekly active users across all three tiers.",
    metrics: [
      { k: "Weekly active users",  v: "100+"  },
      { k: "Dashboard tiers",      v: "4"     },
      { k: "Teams served",         v: "8+"    },
      { k: "Stakeholder groups",   v: "3"     },
    ],
    ai: [
      "AI Agent workflows: 4-persona analytics workflows for board prep, roadmap analysis, Customer Success risk alerts, and sales call prep",
      "Cortex Search: RAG over experiment hypotheses and product documentation stored natively in Snowflake",
      "PowerBI AI: anomaly detection and smart narrative generation on revenue and contract BI reports",
    ],
  },
];

const AI_STACK = [
  {
    tool: "Snowflake Cortex",
    color: "#29B5E8",
    tagline: "AI built into the warehouse: no data movement, no external APIs, no separate vector database",
    capabilities: [
      {
        name: "Cortex Analyst",
        tag: "NL to SQL",
        desc: "Natural language interface directly over Snowflake tables. Ask a business question in plain English, get SQL executed against your warehouse. No separate vector DB, no data export, no latency penalty.",
        code: `SELECT SNOWFLAKE.CORTEX.COMPLETE(
  'llama3-70b',
  'Which accounts have high experiment volume
   but declining qualified rates this month?'
) AS insight
FROM REPORTING.DIM_ACCOUNT
LIMIT 10;`,
      },
      {
        name: "ML.FORECAST",
        tag: "Time-Series",
        desc: "Native time-series forecasting on any Snowflake table or view. Built a 90-day experiment adoption forecast for PM planning directly from the REPORTING layer, no Python pipeline required.",
        code: `SELECT *
FROM TABLE(
  SNOWFLAKE.ML.FORECAST(
    INPUT_DATA => SYSTEM$REFERENCE(
      'VIEW', 'V_WEEKLY_ADOPTION'),
    TIMESTAMP_COLNAME => 'WEEK',
    TARGET_COLNAME    => 'QUALIFIED_RATE',
    SERIES_COLNAME    => 'PRODUCT',
    FORECASTING_PERIODS => 12
  )
);`,
      },
      {
        name: "ML.ANOMALY_DETECTION",
        tag: "Observability",
        desc: "Automatic anomaly detection on ingestion pipelines. Flags unexpected drops in daily event volume before they surface as silent dashboard failures or broken data gaps.",
        code: `SELECT EVENT_DATE, EVENT_COUNT,
       IS_ANOMALY, PERCENTILE
FROM TABLE(
  SNOWFLAKE.ML.DETECT_ANOMALIES(
    INPUT_DATA => SYSTEM$REFERENCE(
      'VIEW', 'V_DAILY_EVENT_VOLUME'),
    TIMESTAMP_COLNAME => 'EVENT_DATE',
    TARGET_COLNAME    => 'EVENT_COUNT'
  )
)
WHERE IS_ANOMALY = TRUE;`,
      },
    ],
  },
  {
    tool: "Segment AI",
    color: "#52BD94",
    tagline: "AI that turns raw event streams into predictive signals before they reach the warehouse",
    capabilities: [
      {
        name: "Predictive Traits",
        tag: "Lead Scoring",
        desc: "ML-powered user scoring built from event history: churn probability, predicted LTV, activation likelihood. Scores are computed in Segment, then synced to both Snowflake and Salesforce every 24 hours.",
        code: `// Predictive Trait definition
{
  "type": "prediction",
  "name": "p_qualified_experiment_next30d",
  "model": "likelihood_of_conversion",
  "feature_window": "90d",
  "sync_destinations": [
    "snowflake",
    "salesforce"
  ],
  "refresh_cadence": "24h"
}`,
      },
      {
        name: "Computed Traits",
        tag: "Feature Engineering",
        desc: "SQL-defined user properties computed over the live event stream: experiment count, feature usage frequency, days since last engagement. Used as feature inputs for downstream ML models.",
        code: `-- Computed Trait: experiments_last_30d
SELECT
  user_id,
  COUNT(DISTINCT experiment_id)
    AS experiments_last_30d
FROM EVENTS
WHERE event = 'Experiment Started'
  AND timestamp > DATEADD('day',-30,NOW())
GROUP BY 1`,
      },
      {
        name: "Audience AI",
        tag: "Natural Language Segments",
        desc: "Describe an audience in plain English. 'Enterprise accounts running 5+ experiments with declining qualified rate' resolves to structured SQL conditions automatically, no SQL authoring required.",
        code: `// NL input to auto-resolved segment:
{
  "conditions": [
    {
      "trait": "account_tier",
      "operator": "equals",
      "value": "enterprise"
    },
    {
      "trait": "experiments_last_30d",
      "operator": "gte", "value": 5
    },
    {
      "trait": "qualified_rate_wow_change",
      "operator": "lt", "value": -0.20
    }
  ]
}`,
      },
    ],
  },
  {
    tool: "dbt AI",
    color: "#FF694B",
    tagline: "AI that writes, tests, documents, and governs your transformation layer",
    capabilities: [
      {
        name: "dbt Copilot",
        tag: "Code Generation",
        desc: "Describe the business logic you need in plain English. Get a starter model back with tests, documentation, and lineage annotations already applied. Cuts model authoring time significantly.",
        code: `-- Copilot prompt:
-- "Qualified experiments per account per week,
--  joined to ARR tier for product-led growth analysis"

-- Generated model:
WITH base AS (
  SELECT
    a.account_id, a.arr_tier,
    DATE_TRUNC('week', e.created_at) AS week,
    COUNT(DISTINCT e.experiment_id)  AS qualified
  FROM {{ ref('int_experiment_results') }} e
  JOIN {{ ref('dim_account') }} a
    USING (account_id)
  WHERE e.qualified_flag = TRUE
  GROUP BY 1, 2, 3
)
SELECT * FROM base`,
      },
      {
        name: "Semantic Layer",
        tag: "Metric Governance",
        desc: "Define metrics once in dbt. Query the same definition from the Analytics Platform, Power BI, or Cortex Analyst. No duplication, no drift between tools. The metric lives in code, not in each dashboard.",
        code: `# metrics.yml
metrics:
  - name: qualified_experiment_rate
    label: "Qualified Experiment Rate"
    type: ratio
    type_params:
      numerator: qualified_experiments
      denominator: total_experiments
    filter: |
      {{ Dimension('experiment__product') }}
        != 'Internal Test'
    meta:
      owner: analytics
      sla: "refreshed every 4h"`,
      },
      {
        name: "Auto-Documentation",
        tag: "Knowledge Graph",
        desc: "AI-generated column and model descriptions inferred from SQL patterns. Every model in the REPORTING layer has business-readable documentation synced to dbt Explorer and queryable by Cortex Analyst.",
        code: `# AI-generated for mart_experiment_qualified_rate:
description: >-
  Calculates the ratio of experiments that reached
  the qualified threshold (minimum impression volume
  + conversion signal) out of all experiments started
  in the period. Primary metric for product manager adoption
  reporting: measures quality, not just quantity.
  Used in board decks, Customer Success risk scoring, and
  the Analytics Platform product dashboards.`,
      },
    ],
  },
];

const ARCH_INDUSTRY_MAP = [
  {
    sector: "B2B SaaS",
    subsector: "The platform: Reference implementation",
    color: "#f43f5e",
    warehouseTool: "Snowflake + Analytics Platform (warehouse-native query layer)",
    biTool: "PowerBI: Finance, Sales, Executive: contract reporting, ARR forecasting, board decks",
    primaryMetric: "Qualified experiment rate, feature adoption (last 30 days), ARR-linked engagement by account",
    cloudMigration: "Snowflake on AWS to BigQuery on GCP. Egress cost dominates the full-export cost model. Service rewrite is the only approach that removes it entirely.",
    biSplit: "The Analytics Platform for product managers: behavioural cohorts, funnel analysis, cross-product joins. Power BI for Finance: contract overages, ARR, board decks. Finance said no to pivot tables in the Analytics Platform. They were right.",
    compliance: "Standard enterprise SaaS: SOC 2 Type II, data processor agreements. No sector-specific data residency constraints.",
    isReference: true,
  },
  {
    sector: "FinTech",
    subsector: "Payments · Lending · Wealth Management",
    color: "#6366f1",
    warehouseTool: "Redshift or Snowflake + Amplitude or Heap: same analytics silo problem, different vendor names",
    biTool: "Tableau or PowerBI: risk and compliance reporting is always separate; auditors don't use Amplitude",
    primaryMetric: "Transaction conversion rate, activation funnel by product tier, credit utilisation by engagement cohort",
    cloudMigration: "Multi-cloud egress costs compound with PCI DSS data residency requirements. Cross-cloud movement of payment data often requires explicit regulatory approval: the constraint is legal as well as financial.",
    biSplit: "Product analytics for growth and PM teams (funnel, cohort, feature adoption). Dedicated compliance BI for audit and regulatory reporting: must be separate. Auditors require auditable, formatted outputs, not Amplitude dashboards.",
    compliance: "PCI DSS Level 1 for payment data. SOX for public companies. GDPR and CCPA with data residency constraints. Egress decisions are regulatory as much as financial.",
  },
  {
    sector: "Healthcare",
    subsector: "Digital Health · EHR · Care Navigation",
    color: "#10b981",
    warehouseTool: "Snowflake Healthcare Edition (BAA in place) or AWS HealthLake + HIPAA-eligible analytics layer",
    biTool: "Tableau Health or PowerBI with HIPAA workspace: billing and revenue cycle must be separate from clinical analytics",
    primaryMetric: "Care pathway completion rate, appointment no-show prediction, patient activation by engagement cohort",
    cloudMigration: "PHI cannot cross cloud boundaries without a Business Associate Agreement covering every processor in the chain. This eliminates most multi-cloud egress approaches before cost is even modelled: compliance is the hard wall, not cost.",
    biSplit: "Clinical analytics for care teams (patient outcomes, pathway adherence, intervention tracking). Operational BI for billing and administration (revenue cycle, payer performance). These audiences have incompatible tooling requirements.",
    compliance: "HIPAA BAA required for all data processors. PHI residency mandated by most hospital systems. HITRUST certification preferred. SOC 2 is table stakes. Compliance eliminates options before architecture can.",
  },
  {
    sector: "E-commerce",
    subsector: "Retail · Marketplace · DTC",
    color: "#fbbf24",
    warehouseTool: "BigQuery (GA4 natural fit) or Snowflake + dbt to Looker. Server-side pixel is replacing third-party cookies across the industry.",
    biTool: "Looker or PowerBI: merchandising margin, sell-through, and supplier performance always land in a BI tool Finance controls",
    primaryMetric: "Revenue per session, cart abandonment rate, product recommendation CTR, LTV by acquisition channel",
    cloudMigration: "GA4 exports natively to BigQuery, creating a GCP-first architecture by default. Cross-cloud egress is often avoided not by deliberate planning, but by following the GA4 path. The real migration challenge is cookie deprecation forcing server-side event tracking.",
    biSplit: "Product and growth analytics for marketing and product teams (funnel, A/B tests, attribution). Financial reporting for merchandising and finance (margin, sell-through, supplier). Different cadence, different audience, always a different tool.",
    compliance: "GDPR and CCPA consent requirements dominate. Cookie deprecation forces server-side pixel architecture. Consent banners affect data completeness and must be modelled explicitly in analysis.",
  },
  {
    sector: "Media / DTC",
    subsector: "Streaming · Publishing · Subscription",
    color: "#a78bfa",
    warehouseTool: "Snowflake or BigQuery + Piano Analytics or Amplitude. First-party data strategy is now a competitive differentiator.",
    biTool: "Looker or PowerBI for subscription finance: MRR, ARR, churn cohorts are investor-facing and must be separate from editorial",
    primaryMetric: "Content consumption depth, subscription conversion rate, LTV by acquisition channel, churn by engagement tier",
    cloudMigration: "Third-party pixel deprecation is forcing a server-side, first-party data architecture industry-wide. When done correctly, this creates a cloud-agnostic event pipeline: and egress costs follow the same math as any warehouse migration.",
    biSplit: "Editorial analytics for content teams (Chartbeat, Piano: real-time consumption signals). Subscription finance for CFO and investor reporting (MRR, ARR, churn). These have incompatible formatting and latency requirements.",
    compliance: "GDPR, CCPA, and emerging state privacy laws. Cookie phase-out invalidates legacy attribution models. First-party consent architecture is now regulatory infrastructure.",
  },
  {
    sector: "Logistics",
    subsector: "Freight · Last-Mile · Fleet Operations",
    color: "#38bdf8",
    warehouseTool: "Snowflake or BigQuery + Grafana or Superset for real-time operational signals, layered with warehouse analytics for deeper analysis",
    biTool: "PowerBI or Tableau: executive KPI reporting is weekly, formatted, investor-ready, and latency-insensitive",
    primaryMetric: "On-time delivery rate, driver utilisation, route optimisation success rate, cost-per-mile by segment",
    cloudMigration: "IoT telemetry (GPS, sensor data) creates very high egress volumes. Edge processing: reducing what leaves the device: is the logistics-specific lever. Once data hits the cloud, the same egress math applies as any other migration.",
    biSplit: "Operational dashboards for dispatch and fleet managers (real-time, latency-critical: Grafana, Superset). Executive KPI reporting for leadership and investors (weekly, formatted: PowerBI). Different SLAs, different tools: no compromise.",
    compliance: "Driver privacy regulations govern biometric and location data. GDPR for European operations. IoT data minimisation as both regulatory requirement and cost lever. Retention limits for route telemetry vary by jurisdiction.",
  },
];

const NAV_SECTIONS = [
  { id: "problem",      label: "Problem"      },
  { id: "architecture", label: "Architecture" },
  { id: "pipeline",     label: "Pipeline"     },
  { id: "journey",      label: "Journey"      },
  { id: "analysis",     label: "Analysis"     },
  { id: "decision",     label: "Decision"     },
  { id: "patterns",     label: "Patterns"     },
  { id: "ai",           label: "AI Layer"     },
  { id: "stack",        label: "Stack"        },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen text-[#e2e8f0]" style={{ backgroundColor: "#0a0a0f" }}>
      <SectionNav />
      <ReadingProgress />

      {/* NAV */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10"
        style={{ backgroundColor: "rgba(10,10,15,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-sm font-semibold tracking-widest uppercase text-[#f43f5e]">Systems Architecture</span>
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <span className="text-sm font-semibold text-white">Wahid Tawsif Ratul</span>
          <span className="text-xs text-[#f43f5e]">Data Scientist · Product Manager</span>
        </div>
        <span className="sm:hidden text-xs text-[#94a3b8]">Wahid T. Ratul</span>
      </nav>

      <div className="mx-auto max-w-5xl px-6 md:px-10 py-16 space-y-24">

        {/* ─── HERO ─── */}
        <section className="pt-8 space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#f43f5e] mb-4">Portfolio Case Study</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white">
              <span className="gradient-heading">Systems Architecture</span>{" "}&amp;{" "}
              <br className="hidden md:block" />Platform Design
            </h1>
          </div>
          <p className="max-w-2xl text-lg text-[#94a3b8] leading-relaxed">
            The Q3 board deck had two numbers for the same metric. Both technically defensible,
            neither wrong — which made the disagreement impossible to resolve and the numbers impossible to trust.
          </p>
          <p className="max-w-2xl text-[#64748b] leading-relaxed">
            This is how I made that question structurally impossible to ask: the cost model that ruled out
            five migration approaches, the two architecture decisions that held under challenge, and what
            I got wrong along the way.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              { label: "100+ Weekly Active Users",  icon: "◈" },
              { label: "0 Data Loss Events",        icon: "◈" },
              { label: "6 Alternatives Evaluated",  icon: "◈" },
              { label: "89% Egress in Full Export", icon: "◈" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", color: "#fda4af" }}>
                <span className="text-[#f43f5e] text-xs">{stat.icon}</span>
                {stat.label}
              </div>
            ))}
          </div>
        </section>

        {/* ─── OWNERSHIP ─── */}
        <OwnershipCard />

        {/* ─── WIN SHOWCASE ─── */}
        <WinShowcase />

        {/* ─── STORY ARC ─── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(244,63,94,0.025)" }}>
          <div style={{ display: "flex" }}>
            {STORY_CHAPTERS.map((ch, i) => (
              <a key={ch.label} href={ch.href} className="card-hover" style={{ flex: 1, padding: "20px 24px", textDecoration: "none", borderRight: i < STORY_CHAPTERS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", display: "block" }}>
                <p style={{ fontSize: "0.58rem", fontWeight: 700, color: "#f43f5e", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "4px" }}>{ch.label}</p>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#f1f5f9", marginBottom: "2px" }}>{ch.title}</p>
                <p style={{ fontSize: "0.67rem", color: "#6b7280", lineHeight: 1.4 }}>{ch.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* ─── Migration Journey Timeline ─── */}
        <section id="journey" className="space-y-6">
          <SectionLabel label="The Journey" />
          <h2 className="text-2xl font-bold text-white">From Broken to Production in Five Phases</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            The migration wasn't a single decision. It was five distinct phases, each with its own deliverable.
            Click any phase to see what happened and what it produced.
          </p>
          <MigrationTimeline />
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════
            Ch01: The Problem
        ═══════════════════════════════════════════════════════ */}
        <section id="problem" className="space-y-8">
          <ChapterBadge ch="01" title="The Problem" desc="Two things were broken" />

          <BoardDeckMockup />

          <div className="space-y-4 max-w-2xl">
            <p className="text-[#94a3b8] leading-relaxed">
              The board deck for Q3 had two numbers for the same metric. One from Mixpanel, one from Snowflake.
              Both were technically defensible: different moments in the sync cycle, different aggregation windows.
              Neither was wrong. That was the problem.
            </p>
            <p className="text-[#94a3b8] leading-relaxed">
              When two authoritative sources disagree, analysts stop trusting both. They start adding footnotes.
              The footnotes proliferate. Executives start asking which number to use. The answer is always
              "it depends." That answer destroys credibility at the board level.
            </p>
            <p className="text-[#94a3b8] leading-relaxed">
              The migration wasn't about picking the in-house analytics platform over Mixpanel. It was about making
              the question impossible to ask: one warehouse, one number, no sync cycle, no fork.
            </p>
            <PullQuote text="It wasn't about picking one tool over another. It was about making the question impossible to ask." />
          </div>

          <SectionLabel label="Decision Record 001" />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Analytics Platform Migration</h2>
            <p className="text-[#94a3b8]">Mixpanel to the in-house analytics platform: warehouse-native product analytics</p>
          </div>

          <div className="space-y-2">
            {[
              { num: "01", title: "Sync Fragility",     body: "Data pipelines broke whenever Snowflake schema changed. Mirror tables required constant maintenance: schema drift created data gaps and analyst distrust that accumulated over months."  },
              { num: "02", title: "Data Discrepancies", body: "Divergence between Snowflake and Mixpanel numbers eroded analyst trust. Board-level reporting required a manual reconciliation pass before every presentation."                        },
              { num: "03", title: "MTU Licensing Cost", body: "Monthly Tracked User pricing scaled with headcount, not with analytical value. As the active user base grew, licensing costs outpaced what the platform was actually delivering."        },
              { num: "04", title: "No Warehouse Joins", body: "Mixpanel data lived in a silo. Joining engagement metrics to ARR, experiment results, or Salesforce CRM data for account-level product-led growth analysis was structurally impossible."             },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: "20px", padding: "18px 22px", borderRadius: "12px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
                <span style={{ fontSize: "3.2rem", fontWeight: 900, lineHeight: 1, flexShrink: 0, color: "rgba(244,63,94,0.12)", fontFamily: "monospace", marginTop: "-2px", userSelect: "none" as const }}>
                  {item.num}
                </span>
                <div style={{ paddingTop: "4px" }}>
                  <p style={{ fontSize: "0.92rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{item.title}</p>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <ChapterSummary points={[
            "Two authoritative sources for the same metric is worse than one imperfect source. Disagreement at the data layer becomes disagreement at the board level.",
            "The architectural fix was structural, not operational: remove the sync layer entirely, not tune it. One warehouse, one source, the discrepancy becomes structurally impossible.",
          ]} />
        </section>

        {/* ─── Architecture: Before / After ─── */}
        <section id="architecture" className="space-y-6">
          <SectionLabel label="Architecture" />
          <h2 className="text-2xl font-bold text-white">What Changed Across Six Dimensions</h2>
          <p className="text-[#94a3b8] text-sm max-w-xl">
            Every dimension that scored below 4 before the migration scored above 8 after it.
            Toggle between eras to see the shift: the bars animate on switch.
          </p>
          <BeforeAfterToggle />

          <h3 className="text-lg font-semibold text-white pt-6">The 3-Layer Warehouse Architecture</h3>
          <p className="text-[#94a3b8] text-sm max-w-xl">
            Every analytic query resolves against one of three layers. Hover any layer to explore its tables and contract.
          </p>
          <WarehouseArchDiagram />

          <h3 className="text-lg font-semibold text-white pt-4">The Technical Shift</h3>
          <p className="text-[#94a3b8] text-sm max-w-xl">
            The fundamental problem was a mirror. Snowflake was the source of truth, but Mixpanel needed its own copy.
            Every schema change broke the sync. Removing the mirror removed the problem.
            <LearnMore term="What is warehouse-native analytics?" body="A warehouse-native analytics tool queries your data warehouse directly, rather than requiring you to sync or export data into a separate analytics database. The in-house analytics platform connects directly to Snowflake and runs queries against your existing tables in real time: no ETL pipeline, no mirror tables, no sync cycle, no version skew." />
          </p>
          <Objection
            question="Why not just fix the sync instead of replacing Mixpanel entirely?"
            answer="I considered it. The sync broke because Mixpanel's data model requires a copy of the warehouse data on its own infrastructure — that architecture is what makes schema changes catastrophic. You can make the sync more resilient: better error handling, schema evolution rules, automatic retries. But you can't make it impossible to fail, because the mirror is the failure mode. Fixing the sync would have been months of engineering to end up with a more robust version of the thing that was structurally wrong."
          />

          <p className="text-[#94a3b8] text-sm max-w-2xl">
            Here&apos;s what the full data architecture looked like before and after: every product source, every tool, every layer, end to end.
          </p>
          <DataFlowDiagram />
        </section>

        {/* ─── Pipeline Flow Diagram ─── */}
        <section id="pipeline" className="space-y-6">
          <SectionLabel label="Pipeline" />
          <h2 className="text-2xl font-bold text-white">The Platform, End to End</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            Six layers, each with a distinct contract. Click any node to see what it does, the metrics it holds,
            and the AI capabilities built into it. The platform serves 100+ weekly active users from a single
            Snowflake account with sub-2-second query latency and zero data loss.
          </p>
          <PipelineFlowDiagram />
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════
            Ch02: The Analysis
        ═══════════════════════════════════════════════════════ */}
        <section id="analysis" className="space-y-8">
          <ChapterBadge ch="02" title="The Analysis" desc="How I ruled out 5 of 6" />

          <div className="space-y-3 max-w-2xl">
            <p className="text-[#94a3b8] leading-relaxed">
              I built a cost model before writing a single recommendation. Six approaches to the same question:
              how do you move multi-terabyte datasets across cloud boundaries without paying for the privilege
              indefinitely? The answer wasn't in the vendor documentation. It was in the math.
            </p>
            <p className="text-[#94a3b8] leading-relaxed">
              Four alternatives died on first contact with the constraints. One became the fallback.
              One became the architecture. Here's how each one failed - or didn't.
            </p>
            <PullQuote text="Four alternatives died on first contact with the constraints." />
          </div>

          {/* ADR-001b */}
          <SectionLabel label="Decision Record 001b" />
          <h2 className="text-2xl font-bold text-white">Why the Analytics Platform + Power BI Coexist</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            Migrating to the in-house analytics platform raised an obvious question: why keep Power BI at all? The answer is that they solve
            structurally different problems for structurally different audiences. Collapsing them would have made
            each audience worse off.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>Analytics Platform</span>
              <div className="space-y-2 pt-1">
                {[
                  { label: "Audience",   value: "Product Managers, Analytics"                                              },
                  { label: "Cadence",    value: "Daily / real-time exploration"                                            },
                  { label: "Strengths",  value: "Behavioural cohorts, funnel analysis, cross-product joins, warehouse-native" },
                  { label: "Dashboards", value: "Usage, adoption, AI Agent, PSAT: multi-tier by stakeholder"            },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-[#64748b] font-medium w-24 flex-shrink-0">{label}</span>
                    <span className="text-[#94a3b8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(242,200,17,0.07)", border: "1px solid rgba(242,200,17,0.2)" }}>
              <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(242,200,17,0.15)", color: "#F2C811" }}>PowerBI: Business Intelligence</span>
              <div className="space-y-2 pt-1">
                {[
                  { label: "Audience",  value: "Sales, Customer Success, Finance, Executive"                              },
                  { label: "Cadence",   value: "Weekly / monthly reporting"                                                },
                  { label: "Strengths", value: "Revenue modelling, contract overages, ARR forecasting, board formatting"   },
                  { label: "Reports",   value: "Overages, AI Agent billing, DXP forecasts: revenue and contracts"        },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3 text-sm">
                    <span className="text-[#64748b] font-medium w-24 flex-shrink-0">{label}</span>
                    <span className="text-[#94a3b8]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "rgba(242,200,17,0.05)", border: "1px solid rgba(242,200,17,0.18)", borderRadius: "12px", padding: "22px 26px", position: "relative" as const }}>
            <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "rgba(242,200,17,0.14)", lineHeight: 1, position: "absolute" as const, top: "10px", left: "18px", fontFamily: "Georgia, serif" }}>&ldquo;</div>
            <div style={{ paddingLeft: "32px" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F2C811", fontStyle: "italic", lineHeight: 1.45, marginBottom: "8px" }}>
                The pivot tables aren&apos;t good enough.
              </p>
              <p style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "14px" }}>— Finance, after the first Analytics Platform demo</p>
              <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.65 }}>
                I spent a week trying to prove otherwise. They were right. The Analytics Platform is for when a product manager asks
                &ldquo;which accounts stopped using experiments after their first month?&rdquo; — joins, cohorts,
                live Snowflake queries. Power BI is for when Finance asks &ldquo;how much does this customer owe
                us in overages?&rdquo; — formatted, auditable, ARR-linked. Two tools, two audiences, one warehouse.
              </p>
            </div>
          </div>

          {/* Decision Record 002 */}
          <SectionLabel label="Decision Record 002" />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Cloud Migration Evaluation</h2>
            <p className="text-[#94a3b8]">The customer data platform (CDP): Snowflake on AWS to BigQuery on GCP</p>
          </div>

          <div className="rounded-xl p-5 space-y-2" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-[#f43f5e]">Migration Scope</p>
            <div className="flex flex-wrap gap-6 text-sm text-[#94a3b8]">
              <span><span className="text-white font-semibold">Multi-TB</span> compressed data</span>
              <span><span className="text-white font-semibold">Many</span> per-customer databases</span>
              <span><span className="text-white font-semibold">3 core platform services</span> affected</span>
            </div>
          </div>
          <Objection
            question="Why not just use the native BigQuery connector for Snowflake?"
            answer="The BigQuery Data Transfer Service supports Snowflake tables. The problem: the customer data platform (CDP) exposes all customer data exclusively through Snowflake secure views — not tables. Secure views hide the underlying SQL definition, and BQ DTS cannot execute against them. This eliminates the native connector before cost or complexity is even modelled. The constraint is architectural: it's a hard incompatibility, not a trade-off."
          />

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#64748b]">Evaluation Matrix</h3>
              <p className="text-sm text-[#94a3b8]">
                Six alternatives scored across five criteria. The pattern is visible immediately: every full-export
                approach fails on egress cost; the hard constraint kills materialized views; Service Rewrite is the
                only option that scores well on what matters long-term, at the cost of engineering effort.
              </p>
              <DecisionMatrix />
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-[#64748b]">Alternatives Evaluated</h3>
              <p className="text-sm text-[#94a3b8]">
                Select any alternative to see the evaluation: why it was considered, what constraint killed it,
                and what the cost model showed.
              </p>
              <AdrExplorer />
            </div>
          </div>
        </section>

        {/* ─── Cost Model ─── */}
        <section id="cost" className="space-y-6">
          <SectionLabel label="Cost Model" />
          <h2 className="text-2xl font-bold text-white">Egress Dominates</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            At this data scale, data transfer costs account for 80-90% of total migration cost.
            This asymmetry drove the entire evaluation toward architectures that minimise data movement.
            <LearnMore term="What is egress cost?" body="Cloud providers charge for data leaving their network ('egress'). AWS charges per GB leaving the region. Snowflake charges an additional fee for cross-cloud data movement on top of that. When you export a multi-terabyte dataset every week, these two charges compound: the per-GB rate multiplied by total volume, every week, indefinitely. This is why full-export approaches fail the cost model before engineering effort is even considered." />
          </p>

          <CostComparisonChart />
        </section>

        {/* ─── Constraints ─── */}
        <section id="constraints" className="space-y-6">
          <SectionLabel label="Constraints" />
          <h2 className="text-2xl font-bold text-white">Hard Constraints</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            These narrowed the viable solution space before any cost modelling was applied.
            They weren't trade-offs to optimise: they were walls that eliminated options entirely.
          </p>
          <div className="space-y-2">
            {[
              { title: "Secure View Incompatibility",  tag: "CRITICAL",   col: "#f43f5e", body: "BigQuery Data Transfer Service only supports tables, not Snowflake secure views. Customer data is exposed exclusively via secure views: the primary GCP connector cannot read it. Any migration must handle this by materializing data upstream first." },
              { title: "Per-Customer Database Sprawl", tag: "CRITICAL",   col: "#f43f5e", body: "The customer data platform (CDP) uses a per-customer database pattern with many separate customer databases. Each represents an independent orchestration unit: a naive export would require many parallel jobs, dramatically increasing coordination complexity and failure surface area." },
              { title: "Incremental vs Full Export",   tag: "TRADE-OFF",  col: "#fbbf24", body: "Full weekly exports eliminate incremental complexity but multiply egress cost. Incremental approaches (Iceberg, CDC) reduce ongoing cost but require change tracking, schema evolution handling, and more complex failure recovery procedures." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", borderRadius: "10px", overflow: "hidden", border: `1px solid ${item.col}22` }}>
                <div style={{ width: "4px", flexShrink: 0, background: item.col }} />
                <div style={{ padding: "16px 20px", flex: 1, background: "rgba(255,255,255,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.12em", color: item.col, background: `${item.col}15`, padding: "2px 7px", borderRadius: "4px" }}>{item.tag}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#e2e8f0" }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <ChapterSummary points={[
            "89% of full-export migration cost is AWS egress — not engineering, not tooling. Every patch approach optimised around this asymmetry. Only the service rewrite removed it.",
            "Two hard constraints (secure view incompatibility, per-customer database pattern) eliminated options before cost was even modelled. Constraints are walls, not trade-offs.",
          ]} />
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════
            Ch03: The Decision
        ═══════════════════════════════════════════════════════ */}
        <section id="decision" className="space-y-8">
          <ChapterBadge ch="03" title="The Decision" desc="What shipped and why it held" />

          <div className="space-y-3 max-w-2xl">
            <p className="text-[#94a3b8] leading-relaxed">
              The right answer in each case was the one that removed the problem rather than optimised around it.
              For Decision Record 001: eliminate the sync layer. The mirror was the failure mode — remove it, remove the failure.
              For Decision Record 002: eliminate the serving layer that required cross-cloud movement. Patch approaches (caching,
              materialized views, ECO) all optimise a broken architecture without changing it.
            </p>
            <p className="text-[#94a3b8] leading-relaxed">
              Both decisions were challenged. Both held. The parallel-run strategy for Decision Record 001 meant no stakeholder
              lost access during the migration. The phased recommendation for Decision Record 002 gave engineering a fallback
              path if service rewrite timelines slipped.
            </p>
            <PullQuote text="The right answer was the one that removed the problem, not the one that optimised around it." />
          </div>

          <SectionLabel label="Decision Record 001" />
          <h2 className="text-2xl font-bold text-white">Why the Analytics Platform</h2>

          <div className="space-y-2">
            {[
              { title: "Warehouse-Native",    body: "Queries Snowflake directly: zero sync infrastructure, no ETL pipelines, no mirror tables to maintain. The data the Analytics Platform reads is the data that exists. No version skew possible."             },
              { title: "ARR-Linked Metrics",  body: "Engagement data can be joined to ARR and Salesforce in a single Snowflake query, enabling product-led growth analysis at the account level that Mixpanel couldn't support."             },
              { title: "Cross-Product Joins", body: "Unified analysis across the product suite: experiment results, CMS, feature flags, and AI agent credit usage in one query without any data movement."                             },
              { title: "Dogfooding",          body: "The analytics platform is one of the company's own products: internal dogfooding creates a direct feedback loop from analytics usage to product development. Every gap in the Analytics Platform I found as an analyst, I could report directly." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", alignItems: "baseline", gap: "16px", padding: "14px 20px", borderRadius: "10px", background: "rgba(52,211,153,0.04)", borderTop: "1px solid rgba(52,211,153,0.1)", borderRight: "1px solid rgba(52,211,153,0.1)", borderBottom: "1px solid rgba(52,211,153,0.1)", borderLeft: "3px solid #34d399" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#34d399", flexShrink: 0, minWidth: "160px" }}>{item.title}</span>
                <span style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.65 }}>{item.body}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">Trade-offs Accepted</h3>
              <ul className="space-y-2">
                {["Migration effort to rebuild the reporting layer", "All dashboards and metrics to be ported and validated", "Team ramp-up on new query and modelling paradigms", "Parallel-run period maintaining both platforms"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span className="text-[#f43f5e] mt-0.5 flex-shrink-0">·</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-6 space-y-3" style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#34d399]">Outcome</h3>
              <ul className="space-y-2">
                {["Single source of truth for all product analytics", "All dashboards migrated with parity validation", "Board-level reporting on ARR-linked engagement", "AI feature adoption tracking across accounts", "Cross-product cohort analysis now possible"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#34d399" }} className="mt-0.5 flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl p-6 space-y-3" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.2)" }}>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#f43f5e]">My recommendation</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Mixpanel was working. This migration was my recommendation to leadership: not a mandate from above.
              I made the case on three grounds: sync fragility was degrading trust in numbers at the board level;
              per-user pricing had a non-linear cost curve that was about to get expensive; and the structural inability
              to join behavioural data to ARR meant we could never build a real product-led growth motion on top of Mixpanel.
              The full parallel-run across all dashboards was my design: no stakeholder lost visibility during migration.
            </p>
          </div>

          {/* Decision Record 002 Recommendation */}
          <SectionLabel label="Decision Record 002" />
          <h2 className="text-2xl font-bold text-white">Final Recommendation</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.25)" }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>Primary</span>
                <h3 className="text-white font-semibold">Alt 6: Service Rewrite</h3>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Rewrite the three core platform services to operate natively on BigQuery. By eliminating Snowflake as
                the serving layer entirely, this removes all cross-cloud egress and the secure view constraint in one move.
              </p>
              <ul className="space-y-1.5">
                {["Eliminates ongoing cross-cloud egress cost", "Resolves secure view incompatibility permanently", "Enables GCP-native tooling (Dataflow, Pub/Sub)", "Long-term lowest operational cost"].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#34d399" }} className="flex-shrink-0 mt-0.5">✓</span>{point}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#64748b] pt-1">Caveat: Highest upfront engineering investment. Requires phased delivery across three service teams.</p>
            </div>
            <div className="rounded-xl p-6 space-y-4" style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-2 py-1 rounded tracking-widest uppercase" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>Fallback</span>
                <h3 className="text-white font-semibold">Alt 2: Iceberg Tables</h3>
              </div>
              <p className="text-sm text-[#94a3b8] leading-relaxed">
                Dynamic Iceberg Tables allow Snowflake to expose data as open table format that BigQuery can read natively.
                Incremental refreshes mean only changed data crosses the cloud boundary.
              </p>
              <ul className="space-y-1.5">
                {["No service rewrites required", "Incremental egress: only changed rows cross clouds", "Retains Snowflake as authoritative warehouse", "Faster time-to-delivery than full service rewrite"].map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                    <span style={{ color: "#fbbf24" }} className="flex-shrink-0 mt-0.5">◆</span>{point}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#64748b] pt-1">Caveat: Secure view materialization must still be solved. Iceberg tables require careful schema evolution management.</p>
            </div>
          </div>

          <div className="rounded-xl p-6 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-[#64748b]">Decision Rationale</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed max-w-3xl">
              The significant cost difference between the cheapest and most expensive alternatives justifies the engineering investment.
              Alt 6 eliminates the architectural debt of maintaining dual-cloud query paths and resolves the secure view constraint
              as a first-class concern rather than a workaround. Alt 2 is recommended only if delivery timeline constraints
              make a phased service rewrite infeasible in the near term.
            </p>
          </div>

          {/* Platform Impact */}
          <SectionLabel label="Platform in Production" />
          <h3 className="text-xl font-bold text-white">Serving the Organisation</h3>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            The migration didn't just fix the technical problem. It expanded what was possible.
            The platform now serves 100+ weekly active users across 8+ teams with sub-2-second query latency
            and zero data loss events since launch.
          </p>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
              {[
                { v: "100+", l: "Weekly Active Users",  sub: "Analysts, product managers, Finance, Customer Success, Sales, Exec" },
                { v: "0",    l: "Data Loss Events",     sub: "Append-only RAW: full audit trail guaranteed" },
                { v: "<2s",  l: "Query Latency P95",    sub: "Warehouse-native: no sync, no ETL overhead" },
                { v: "8+",   l: "Teams Served",         sub: "Product, Customer Success, Finance, Sales, Marketing, Exec" },
                { v: "4",    l: "Dashboard Tiers",      sub: "Customer Success · Product · Executive · Board deck" },
              ].map((m) => (
                <div key={m.l} style={{ flex: "1 1 140px" }}>
                  <div style={{ fontSize: "2.4rem", fontWeight: 900, color: "#f43f5e", fontFamily: "monospace", lineHeight: 1 }}>{m.v}</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e2e8f0", marginTop: "6px" }}>{m.l}</div>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "3px", lineHeight: 1.5 }}>{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <WrongAbout />
          {/* Retrospective */}
          <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.18)", borderRadius: "16px", padding: "28px 32px", borderLeft: "4px solid #6366f1" }}>
            <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#6366f1", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: "18px" }}>Six Months Later</p>
            <div className="space-y-5">
              <div className="space-y-2">
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#e2e8f0" }}>The fallback path was never activated.</p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>
                  Decision Record 002 named Iceberg Tables as the fallback if Service Rewrite timelines slipped. They didn&apos;t.
                  All three service teams delivered on schedule. The fallback is still sitting in the decision record, unused.
                  Writing it was the right call — it gave engineering a credible off-ramp and made the primary
                  recommendation easier to approve.
                </p>
              </div>
              <div className="space-y-2">
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#e2e8f0" }}>Analytics Platform adoption outgrew the original scope.</p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>
                  I planned for three tiers: product managers, Customer Success, and Executive. Finance and Sales found the dashboards before
                  I finished building them. I had to extend the tier model twice post-launch. The informal exploration
                  use case I hadn&apos;t designed for became the highest-frequency one. 100+ weekly active users wasn&apos;t
                  a target — it&apos;s what showed up.
                </p>
              </div>
              <div className="space-y-2">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 8px", borderRadius: "4px", background: "rgba(244,63,94,0.15)", color: "#f43f5e", letterSpacing: "0.1em" }}>CLOSE CALL</span>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#e2e8f0" }}>Three days before decommission, a 4% discrepancy surfaced.</p>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.75 }}>
                  The qualified experiment rate was 4% lower in the Analytics Platform than in Mixpanel. I found it three days before
                  the planned shutdown. If I had stayed on schedule, it would have appeared in the next board
                  deck — the same place the original problem started. I delayed decommission by two weeks, traced
                  it to a windowing definition mismatch masked by sync lag, and validated every metric before
                  pulling the plug. The hardest part of the migration wasn&apos;t technical. It was definitional.
                </p>
              </div>
            </div>
          </div>
          <ChapterSummary points={[
            "Both decisions were challenged. Both held. Decision Record 001 shipped with a zero-downtime parallel run; Decision Record 002's primary recommendation (service rewrite) delivered on schedule: the fallback was never activated.",
            "Six months later: Analytics Platform adoption exceeded the planned scope, and the hardest part of decommissioning Mixpanel was aligning metric definitions, not the technical migration itself.",
          ]} />
        </section>

        <Divider />

        {/* ══════════════════════════════════════════════════════
            Ch04: Patterns That Travel
        ═══════════════════════════════════════════════════════ */}
        <section id="patterns" className="space-y-8">
          <ChapterBadge ch="04" title="Patterns That Travel" desc="Not platform-specific" />
          <p className="max-w-2xl text-[#94a3b8] leading-relaxed">
            These weren&apos;t platform-specific problems. The same architectural pressures appear across every
            industry that runs a data-heavy product: analytics siloing, cloud migration cost modelling, and the
            audience-based BI split. The platform names swap out. The pattern doesn&apos;t.
          </p>
          <IndustryAdapter />
        </section>

        {/* ─── AI Layer ─── */}
        <section id="ai" className="space-y-8">
          <SectionLabel label="AI Layer" />
          <h2 className="text-2xl font-bold text-white">What the Platform Enables</h2>
          <p className="text-[#94a3b8] text-sm max-w-2xl">
            The warehouse-native architecture wasn't just about fixing the sync problem. It created a foundation
            where AI capabilities in each layer of the stack could run directly against the data: no separate pipelines,
            no data export, no context loss between the event and the insight.
          </p>
          <AILayer />
        </section>

        {/* ─── TECH STACK ─── */}
        <section id="stack" className="space-y-6">
          <SectionLabel label="Tech Stack" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {["Snowflake", "BigQuery", "AWS", "GCP", "dbt", "Python", "Analytics Platform", "Segment", "Power BI"].map((tag) => (
              <SAToolCard key={tag} name={tag} />
            ))}
          </div>
          <div className="mt-3">
            <span style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: "20px", padding: "6px 14px", fontSize: "0.82rem", color: "#fda4af", fontWeight: 600 }}>
              Architecture Decision Records
            </span>
          </div>
        </section>

        {/* ─── CLOSING REFLECTION ─── */}
        <section className="space-y-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "48px" }}>
          <p style={{ fontSize: "0.58rem", fontWeight: 800, color: "#f43f5e", letterSpacing: "0.18em", textTransform: "uppercase" as const }}>The Real Lesson</p>
          <p className="text-[#94a3b8] leading-relaxed max-w-2xl" style={{ fontSize: "0.95rem" }}>
            The technical migration took eight weeks. Rebuilding stakeholder trust in the number took six months after that.
            I came into this thinking it was an architecture problem. It was. But the sync layer had become the physical form
            of something harder: two teams, two numbers, no agreed owner for the truth. Removing the mirror removed the symptom.
            Getting everyone to use one number required a different kind of work entirely.
          </p>
          <p className="text-[#94a3b8] leading-relaxed max-w-2xl" style={{ fontSize: "0.95rem" }}>
            Six months after launch, someone asked me why it took so long to notice the discrepancy.
            That question is worth more than the cost model. The answer: we noticed immediately.
            We just didn&apos;t have a mechanism to resolve it. That&apos;s what the warehouse-native architecture actually fixed:
            not the data pipeline, but the accountability gap underneath it.
          </p>
        </section>

        {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '40px 32px 56px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 5 }}>Wahid Tawsif Ratul</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2026 · Data Scientist · Product Manager</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {[
              { label: 'LinkedIn', href: 'https://linkedin.com/in/wahidratul112296', path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.64h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.59 22 11 22 14.4V21h-4v-5.86c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.52-2.25 3.1V21H9z' },
              { label: 'GitHub', href: 'https://github.com/ratul003', path: 'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z' },
              { label: 'Medium', href: 'https://medium.com/@wahidtratul', path: 'M2.5 5.5l1.7 2v9.7l-2 2.3h5.4l-2-2.3V8.4l4.9 11.1h.1l4.3-10.5v8.2l-1.3 1.3v.2h6.4v-.2l-1.3-1.3V6.9l1.3-1.3v-.1h-4.5L13 13.9 9.3 5.5z' },
              { label: 'Email', href: 'mailto:wahidtratul@gmail.com', path: '' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ color: '#64748b', display: 'inline-flex' }}>
                {s.label === 'Email' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </footer>

      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionNav() {
  const [active, setActive] = React.useState<string>("problem");
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).id); }); },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV_SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <nav aria-label="Section navigation" style={{ position: "fixed", right: "26px", top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: "5px" }} className="section-rail">
      {NAV_SECTIONS.map((s) => {
        const on = active === s.id;
        return (
          <a key={s.id} href={`#${s.id}`} aria-current={on ? "true" : undefined} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", textDecoration: "none", padding: "3px 0" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: on ? 700 : 500, color: on ? "#f43f5e" : "#4a4a68", whiteSpace: "nowrap", transition: "color .2s" }}>{s.label}</span>
            <span style={{ width: on ? "24px" : "12px", height: "3px", borderRadius: "2px", background: on ? "#f43f5e" : "#2a2a3a", boxShadow: on ? "0 0 8px rgba(244,63,94,0.4)" : "none", transition: "all .2s" }} />
          </a>
        );
      })}
    </nav>
  );
}

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, duration]);
  return val;
}

function AnimatedMetric({ metric, label, sub, color, delay, trigger }: { metric: string; label: string; sub: string; color: string; delay: number; trigger: boolean }) {
  const numMatch = metric.match(/\d+/);
  const numVal = numMatch ? parseInt(numMatch[0]) : 0;
  const counted = useCountUp(numVal, 1200, trigger);
  const display = numMatch ? metric.replace(/\d+/, String(counted)) : metric;
  return (
    <div style={{ opacity: trigger ? 1 : 0, transform: trigger ? "none" : "translateY(20px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`, background: `${color}0d`, border: `1px solid ${color}30`, borderRadius: "12px", padding: "20px 16px", position: "relative" as const, overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -8, right: -4, fontSize: "4rem", fontWeight: 900, color: `${color}08`, fontFamily: "monospace", lineHeight: 1, userSelect: "none" as const, pointerEvents: "none" as const }}>{display}</div>
      <div style={{ fontSize: "2.2rem", fontWeight: 800, color, lineHeight: 1, fontFamily: "monospace" }}>{display}</div>
      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginTop: "8px", lineHeight: 1.3 }}>{label}</div>
      <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "4px", lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function WinShowcase() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref}>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {WIN_METRICS.map((w) => (
          <AnimatedMetric key={w.label} {...w} trigger={visible} />
        ))}
      </div>
    </div>
  );
}

function MigrationTimeline() {
  const [active, setActive] = useState(0);
  const m = TIMELINE_MILESTONES[active];
  return (
    <div className="space-y-6">
      {/* Timeline strip */}
      <div style={{ position: "relative" as const }}>
        {/* Connecting line */}
        <div style={{ position: "absolute", top: "28px", left: "5%", right: "5%", height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 0 }} />
        {/* Progress line */}
        <div style={{ position: "absolute", top: "28px", left: "5%", width: `${(active / (TIMELINE_MILESTONES.length - 1)) * 90}%`, height: "2px", background: m.color, zIndex: 1, transition: "width 0.4s ease, background 0.3s ease", boxShadow: `0 0 8px ${m.color}60` }} />
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          {TIMELINE_MILESTONES.map((ms, i) => {
            const isActive = i === active;
            const isPast = i < active;
            return (
              <button key={ms.phase} onClick={() => setActive(i)} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: "0", flex: 1 }}>
                {/* Node circle */}
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", border: `2px solid ${isActive ? ms.color : isPast ? ms.color + "80" : "rgba(255,255,255,0.1)"}`, background: isActive ? `${ms.color}20` : isPast ? `${ms.color}0a` : "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: isActive ? `0 0 20px ${ms.color}40, 0 0 40px ${ms.color}18` : "none" }}>
                  <span style={{ fontSize: "1.1rem", color: isActive ? ms.color : isPast ? ms.color + "aa" : "#374151" }}>{ms.icon}</span>
                </div>
                {/* Phase label */}
                <span style={{ fontSize: "0.68rem", fontWeight: isActive ? 700 : 500, color: isActive ? ms.color : isPast ? "#64748b" : "#374151", letterSpacing: "0.05em", whiteSpace: "nowrap" as const, transition: "color 0.2s" }}>{ms.phase}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail card */}
      <div style={{ background: `${m.color}08`, border: `1px solid ${m.color}35`, borderRadius: "16px", padding: "24px", transition: "border-color 0.3s ease, background 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" as const }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
          <span style={{ fontSize: "1rem", fontWeight: 700, color: m.color }}>{m.phase}</span>
          <span style={{ fontSize: "0.62rem", color: "#374151", fontWeight: 600 }}>Phase {active + 1} of {TIMELINE_MILESTONES.length}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.75 }}>{m.desc}</p>
          <div>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, color: m.color, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "10px" }}>Outputs</p>
            <ul className="space-y-2">
              {m.outcomes.map((o) => (
                <li key={o} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.82rem", color: "#e2e8f0" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  {o}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              {active > 0 && <button onClick={() => setActive(active - 1)} style={{ fontSize: "0.72rem", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "none", color: "#64748b", cursor: "pointer" }}>← Prev</button>}
              {active < TIMELINE_MILESTONES.length - 1 && <button onClick={() => setActive(active + 1)} style={{ fontSize: "0.72rem", padding: "6px 14px", borderRadius: "20px", border: `1px solid ${m.color}55`, background: `${m.color}10`, color: m.color, cursor: "pointer" }}>Next phase →</button>}
              {active === TIMELINE_MILESTONES.length - 1 && <span style={{ fontSize: "0.72rem", padding: "6px 14px", color: "#34d399", fontWeight: 600 }}>✓ Platform in production</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WarehouseArchDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const layers = [
    {
      id: "raw", label: "RAW", badge: "Source Landing", color: "#29B5E8",
      contract: "Append-only. Every event preserved exactly as received. No transformation, no deletion.",
      tables: ["segment_tracks", "segment_identifies", "segment_groups", "fivetran_salesforce", "airbyte_zuora", "fivetran_marketo"],
      tag: "Immutable",
    },
    {
      id: "transform", label: "TRANSFORM", badge: "dbt Modelled", color: "#FF694B",
      contract: "Staging, intermediate, and mart models. Rename, cast, deduplicate, join, resolve identity.",
      tables: ["stg_segment_events", "stg_sfdc_accounts", "int_user_identity", "int_experiment_results", "int_ai_agent_usage", "mart_feature_adoption"],
      tag: "Tested + Documented",
    },
    {
      id: "reporting", label: "REPORTING", badge: "Consumer-Ready", color: "#6366f1",
      contract: "ARR-joined, identity-resolved, cross-product cohorts. The Analytics Platform, Power BI, and Cortex Analyst query here.",
      tables: ["mart_experiment_qualified", "dim_account_arr", "fct_events", "mart_ai_agent_billing", "mart_cs_health", "dim_user_identity"],
      tag: "<2s P95",
    },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: "0", minWidth: "600px" }}>
        {layers.map((layer, i) => {
          const isHov = hovered === layer.id;
          return (
            <React.Fragment key={layer.id}>
              <div
                onMouseEnter={() => setHovered(layer.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ flex: 1, padding: "20px 18px", borderRadius: i === 0 ? "12px 0 0 12px" : i === layers.length - 1 ? "0 12px 12px 0" : "0", border: `1px solid ${isHov ? layer.color + "55" : "rgba(255,255,255,0.07)"}`, borderLeft: i > 0 ? "none" : undefined, background: isHov ? `${layer.color}10` : "rgba(255,255,255,0.025)", transition: "all 0.2s ease", cursor: "default", boxShadow: isHov ? `0 0 24px ${layer.color}18` : "none" }}
              >
                {/* Top accent */}
                <div style={{ height: "3px", borderRadius: "2px", background: isHov ? layer.color : `${layer.color}40`, marginBottom: "16px", transition: "background 0.2s" }} />
                {/* Header */}
                <div style={{ marginBottom: "14px" }}>
                  <div style={{ fontSize: "0.58rem", fontWeight: 800, color: isHov ? layer.color : "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "4px" }}>{layer.badge}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: isHov ? layer.color : "#e2e8f0", fontFamily: "monospace", letterSpacing: "-0.02em" }}>{layer.label}</div>
                  <span style={{ fontSize: "0.55rem", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: `${layer.color}18`, color: layer.color, letterSpacing: "0.08em", display: "inline-block", marginTop: "6px" }}>{layer.tag}</span>
                </div>
                {/* Contract */}
                <p style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.6, marginBottom: "14px", minHeight: "56px" }}>{layer.contract}</p>
                {/* Tables */}
                <div className="space-y-1">
                  {layer.tables.map((t) => (
                    <div key={t} style={{ fontSize: "0.65rem", fontFamily: "monospace", color: isHov ? layer.color : "#4b5563", padding: "3px 8px", borderRadius: "4px", background: isHov ? `${layer.color}0a` : "transparent", transition: "all 0.15s ease" }}>{t}</div>
                  ))}
                </div>
              </div>
              {/* Arrow */}
              {i < layers.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", flexShrink: 0, background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                    <path d="M4 16h12M12 10l6 6-6 6" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <text x="12" y="8" fontSize="5" fill="rgba(255,255,255,0.15)" textAnchor="middle" fontFamily="monospace">dbt</text>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p style={{ fontSize: "0.65rem", color: "#374151", marginTop: "12px", textAlign: "center" as const }}>Hover any layer to explore its contract and tables</p>
    </div>
  );
}

function CostComparisonChart() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="space-y-5">
      {/* Big number callout */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", padding: "8px 0" }}>
        <span style={{ fontSize: "6rem", fontWeight: 900, color: "#f43f5e", lineHeight: 1, fontFamily: "monospace", letterSpacing: "-4px" }}>89%</span>
        <div style={{ paddingBottom: "10px" }}>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>of full-export cost is egress</p>
          <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>AWS charges per GB leaving the cloud, then Snowflake charges again for cross-cloud movement.<br />This asymmetry killed four of the six alternatives before engineering was even scoped.</p>
        </div>
      </div>

      {/* Animated bar chart */}
      <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "18px" }}>Relative Cost by Alternative (indexed to Full Export = 100)</p>
        <div className="space-y-3">
          {COST_COMPARISON.map((alt, i) => {
            const isHov = hovered === alt.name;
            const delay = i * 80;
            return (
              <div key={alt.name} onMouseEnter={() => setHovered(alt.name)} onMouseLeave={() => setHovered(null)}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: `${alt.color}18`, color: alt.color, letterSpacing: "0.08em", flexShrink: 0, minWidth: "60px", textAlign: "center" as const }}>{alt.verdict}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: isHov ? 700 : 500, color: isHov ? alt.color : "#94a3b8", transition: "color 0.15s" }}>{alt.name}</span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: alt.color, marginLeft: "auto", flexShrink: 0, fontFamily: "monospace" }}>{alt.relCost}</span>
                </div>
                <div style={{ height: "10px", background: "rgba(255,255,255,0.04)", borderRadius: "5px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: visible ? `${alt.relCost}%` : "0%", background: `linear-gradient(90deg, ${alt.color}, ${alt.color}bb)`, borderRadius: "5px", transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`, boxShadow: isHov ? `0 0 8px ${alt.color}80` : "none" }} />
                </div>
                {isHov && <p style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "3px", paddingLeft: "70px" }}>{alt.note}</p>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "16px", marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {[{ label: "Primary", color: "#34d399" }, { label: "Fallback", color: "#fbbf24" }, { label: "Rejected", color: "#f43f5e" }].map((v) => (
            <div key={v.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.65rem", color: "#64748b" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: v.color }} />
              {v.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearnMore({ term, body }: { term: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }}>
      <button onClick={() => setOpen(!open)} style={{ fontSize: "0.6rem", fontWeight: 800, color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", marginLeft: "6px", lineHeight: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", verticalAlign: "middle" }}>?</button>
      {open && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#111118", border: "1px solid rgba(244,63,94,0.25)", borderRadius: "10px", padding: "14px 16px", width: "280px", fontSize: "0.76rem", color: "#94a3b8", lineHeight: 1.65, zIndex: 100, boxShadow: "0 12px 32px rgba(0,0,0,0.5)", display: "block" }}>
          <p style={{ fontWeight: 700, color: "#f43f5e", marginBottom: "6px", fontSize: "0.72rem" }}>{term}</p>
          {body}
        </span>
      )}
    </span>
  );
}

function BeforeAfterToggle() {
  const [view, setView] = useState<"before" | "after">("before");
  const dims = view === "before" ? BEFORE_DIMS : AFTER_DIMS;
  return (
    <div className="space-y-5">
      <div style={{ display: "flex", gap: "8px" }}>
        {(["before", "after"] as const).map((v) => {
          const isActive = view === v;
          const col = v === "before" ? "#ef4444" : "#34d399";
          return (
            <button key={v} onClick={() => setView(v)} style={{ padding: "8px 20px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${isActive ? col + "55" : "rgba(255,255,255,0.1)"}`, background: isActive ? `${col}15` : "rgba(255,255,255,0.03)", color: isActive ? col : "#64748b", transition: "all 0.2s ease" }}>
              {v === "before" ? "Before (Mixpanel era)" : "After (Analytics Platform)"}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {dims.map((dim) => (
          <div key={dim.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "140px", flexShrink: 0, fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8" }}>{dim.label}</div>
            <div style={{ flex: 1, height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${dim.score * 10}%`, background: dim.color, borderRadius: "5px", transition: "width 0.5s ease, background-color 0.5s ease", opacity: 0.85 }} />
            </div>
            <div style={{ width: "32px", textAlign: "right", flexShrink: 0, fontSize: "0.72rem", fontWeight: 700, fontFamily: "monospace", color: dim.color }}>{dim.score}/10</div>
            <div style={{ flex: 2, fontSize: "0.72rem", color: "#64748b", lineHeight: 1.4, paddingLeft: "8px" }}>{dim.desc}</div>
          </div>
        ))}
      </div>
      {view === "after" && (
        <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
          <p style={{ fontSize: "0.82rem", color: "#34d399", fontWeight: 600 }}>Warehouse-native eliminated the sync layer: and with it, every score below 4.</p>
        </div>
      )}
    </div>
  );
}

function PipelineFlowDiagram() {
  const [active, setActive] = useState<string>(PIPELINE_NODES[0].id);
  const detail = PIPELINE_NODES.find((n) => n.id === active)!;

  return (
    <div className="space-y-6">
      {/* Flow diagram - horizontal with SVG arrows */}
      <div style={{ overflowX: "auto", paddingBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0", minWidth: "760px" }}>
          {PIPELINE_NODES.map((node, i) => {
            const isActive = active === node.id;
            return (
              <React.Fragment key={node.id}>
                {/* Node */}
                <button
                  onClick={() => setActive(node.id)}
                  style={{
                    flex: 1, padding: "20px 12px", cursor: "pointer", textAlign: "center",
                    background: isActive ? `${node.color}18` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? node.color + "70" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: "12px",
                    transition: "all 0.18s ease",
                    boxShadow: isActive ? `0 0 24px ${node.color}28, 0 4px 12px rgba(0,0,0,0.3)` : "none",
                    position: "relative" as const,
                    outline: "none",
                  }}
                >
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "2px", borderRadius: "0 0 2px 2px", background: isActive ? node.color : "transparent", transition: "background 0.18s ease" }} />
                  {/* Layer number */}
                  <div style={{ fontSize: "0.55rem", fontWeight: 800, color: isActive ? node.color : "#374151", marginBottom: "8px", letterSpacing: "0.12em", fontFamily: "monospace" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Icon circle */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: `2px solid ${isActive ? node.color : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", background: isActive ? `${node.color}20` : "rgba(255,255,255,0.03)", transition: "all 0.18s ease" }}>
                    <span style={{ fontSize: "0.85rem", color: isActive ? node.color : "#64748b" }}>{node.icon}</span>
                  </div>
                  <div style={{ fontSize: "0.79rem", fontWeight: 700, color: isActive ? node.color : "#e2e8f0", lineHeight: 1.2, marginBottom: "4px" }}>{node.label}</div>
                  <div style={{ fontSize: "0.6rem", color: isActive ? node.color : "#4b5563", fontWeight: 600, letterSpacing: "0.05em" }}>{node.sub}</div>
                </button>

                {/* Animated arrow connector */}
                {i < PIPELINE_NODES.length - 1 && (
                  <div style={{ flexShrink: 0, width: "40px", height: "80px", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, height: "1.5px", background: "rgba(255,255,255,0.08)" }} />
                    <svg style={{ position: "absolute", right: 0 }} width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <path d="M1 1l7 5-7 5" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flow-dot" style={{ background: node.color, animationDelay: `${i * 0.4}s` }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ background: `${detail.color}08`, border: `1px solid ${detail.color}35`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: detail.color, flexShrink: 0 }} />
          <span style={{ fontSize: "1rem", fontWeight: 700, color: detail.color }}>{detail.label}</span>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 500 }}>{detail.sub}</span>
          <span style={{ fontSize: "0.6rem", color: "#374151", marginLeft: "auto", fontStyle: "italic" }}>Click any node above to explore</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p style={{ fontSize: "0.86rem", color: "#94a3b8", lineHeight: 1.75 }}>{detail.desc}</p>
            <div>
              <p style={{ fontSize: "0.6rem", fontWeight: 700, color: detail.color, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "10px" }}>Layer Metrics</p>
              <div className="grid grid-cols-2 gap-2">
                {detail.metrics.map((m) => (
                  <div key={m.k} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: "4px" }}>{m.k}</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: detail.color, fontFamily: "monospace" }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: "0.6rem", fontWeight: 700, color: detail.color, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "10px" }}>AI Capabilities at This Layer</p>
            <ul className="space-y-3">
              {detail.ai.map((a, i) => {
                const colonIdx = a.indexOf(": ");
                const head = colonIdx > -1 ? a.slice(0, colonIdx) : a;
                const rest = colonIdx > -1 ? a.slice(colonIdx + 2) : "";
                return (
                  <li key={i} style={{ background: `${detail.color}0a`, border: `1px solid ${detail.color}22`, borderRadius: "8px", padding: "10px 14px" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: detail.color }}>{head}</span>
                    {rest && <span style={{ fontSize: "0.75rem", color: "#64748b" }}>: {rest}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdrExplorer() {
  const [activeAlt, setActiveAlt] = useState<number | null>(null);
  const active = activeAlt !== null ? ALT_DETAILS[activeAlt] : null;

  const costColor = (cost: string) => cost.startsWith("Low") ? "#34d399" : cost === "Medium" ? "#fbbf24" : "#f43f5e";
  const complexityColor = (c: string) => c === "Low" ? "#34d399" : c === "Medium" ? "#fbbf24" : "#f43f5e";

  const primaryIdx   = ALT_DETAILS.findIndex((a) => a.verdict === "PRIMARY");
  const fallbackIdx  = ALT_DETAILS.findIndex((a) => a.verdict === "FALLBACK");
  const rejectedIdxs = ALT_DETAILS.map((_, i) => i).filter((i) => ALT_DETAILS[i].verdict === "REJECTED");

  const AltButton = ({ i, size }: { i: number; size: "featured" | "mid" | "small" }) => {
    const alt = ALT_DETAILS[i];
    const isActive = activeAlt === i;
    const padding = size === "featured" ? "20px 24px" : size === "mid" ? "16px 20px" : "12px 14px";
    const nameSize = size === "featured" ? "1.05rem" : size === "mid" ? "0.92rem" : "0.82rem";
    return (
      <button onClick={() => setActiveAlt(activeAlt === i ? null : i)} style={{ width: "100%", background: isActive ? `${alt.verdictColor}12` : size === "featured" ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.025)", border: `1px solid ${isActive ? alt.verdictColor + "55" : size === "featured" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: size === "featured" ? "14px" : "10px", padding, textAlign: "left", cursor: "pointer", transition: "all 0.15s ease", boxShadow: isActive ? `0 0 20px ${alt.verdictColor}18` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: size === "small" ? "4px" : "8px" }}>
          <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>Alt {alt.num}</span>
          <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 7px", borderRadius: "4px", background: `${alt.verdictColor}18`, color: alt.verdictColor, letterSpacing: "0.1em" }}>{alt.verdict}</span>
        </div>
        <div style={{ fontSize: nameSize, fontWeight: 700, color: isActive ? alt.verdictColor : size === "featured" ? "#34d399" : "#c8d3e0", lineHeight: 1.2, marginBottom: "4px" }}>{alt.name}</div>
        {size !== "small" && <div style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.45 }}>{alt.approach}</div>}
      </button>
    );
  };

  return (
    <div className="space-y-3">
      <AltButton i={primaryIdx} size="featured" />
      <AltButton i={fallbackIdx} size="mid" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
        {rejectedIdxs.map((i) => <AltButton key={i} i={i} size="small" />)}
      </div>

      {active ? (
        <div style={{ background: `${active.verdictColor}08`, border: `1px solid ${active.verdictColor}30`, borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#64748b" }}>Alt {active.num}:</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{active.name}</h3>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: "6px", background: `${active.verdictColor}15`, color: active.verdictColor, letterSpacing: "0.1em", marginLeft: "auto" }}>{active.verdict}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "8px" }}>Why I evaluated it</p>
                <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.7 }}>{active.reason}</p>
              </div>
              {active.learn && (
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "12px 14px" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "6px" }}>Technical context</p>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{active.learn.term}</p>
                  <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.65 }}>{active.learn.body}</p>
                </div>
              )}
              <div style={{ background: `${active.verdictColor}0d`, border: `1px solid ${active.verdictColor}25`, borderRadius: "8px", padding: "12px" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: active.verdictColor, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "4px" }}>Key constraint</p>
                <p style={{ fontSize: "0.82rem", color: "#e2e8f0", fontWeight: 500 }}>{active.constraint}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "12px" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>Monthly Cost</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: costColor(active.cost) }}>{active.cost}</p>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "12px" }}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>Complexity</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color: complexityColor(active.complexity) }}>{active.complexity}</p>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "12px" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>Approach</p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.5 }}>{active.approach}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Select an alternative above to see the evaluation detail</p>
        </div>
      )}
    </div>
  );
}

function DecisionMatrix() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const ratingColor = (r: string) => r === "good" ? "#34d399" : r === "mid" ? "#fbbf24" : "#f43f5e";
  const ratingBg    = (r: string) => r === "good" ? "rgba(52,211,153,0.08)" : r === "mid" ? "rgba(251,191,36,0.08)" : "rgba(244,63,94,0.08)";

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", overflowX: "auto" }}>
      <table style={{ width: "100%", minWidth: "580px", borderCollapse: "separate", borderSpacing: "0" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0 16px 12px 0", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", width: "180px" }}>Alternative</th>
            {DECISION_MATRIX.criteria.map((c) => (
              <th key={c} style={{ textAlign: "center", padding: "0 6px 12px", fontSize: "0.6rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.05em", whiteSpace: "nowrap" as const }}>{c}</th>
            ))}
            <th style={{ textAlign: "right", padding: "0 0 12px 10px", fontSize: "0.6rem", fontWeight: 700, color: "#64748b" }}>Verdict</th>
          </tr>
        </thead>
        <tbody>
          {DECISION_MATRIX.rows.map((row, ri) => {
            const isHov = hoveredRow === ri;
            return (
              <tr
                key={row.num}
                onMouseEnter={() => setHoveredRow(ri)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ background: isHov ? `${row.verdictColor}08` : "transparent", transition: "background 0.15s ease", cursor: "default" }}
              >
                <td style={{ padding: "9px 16px 9px 0", borderTop: "1px solid rgba(255,255,255,0.05)", whiteSpace: "nowrap" as const }}>
                  <span style={{ fontSize: "0.6rem", color: "#4b5563", fontFamily: "monospace", marginRight: "6px" }}>Alt {row.num}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: isHov ? row.verdictColor : "#e2e8f0", transition: "color 0.15s" }}>{row.name}</span>
                </td>
                {row.cells.map((cell, ci) => (
                  <td key={ci} style={{ padding: "9px 6px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" as const }}>
                    <span style={{ display: "inline-block", fontSize: "0.64rem", fontWeight: 700, padding: "3px 7px", borderRadius: "5px", background: ratingBg(cell.rating), color: ratingColor(cell.rating), whiteSpace: "nowrap" as const }}>
                      {cell.text}
                    </span>
                  </td>
                ))}
                <td style={{ padding: "9px 0 9px 10px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "right" as const }}>
                  <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "3px 8px", borderRadius: "4px", background: `${row.verdictColor}18`, color: row.verdictColor, letterSpacing: "0.08em", whiteSpace: "nowrap" as const }}>{row.verdict}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: "0.62rem", color: "#374151", marginTop: "14px", textAlign: "center" as const }}>
        Service Rewrite wins on 4 of 5 criteria. Its only red cell is engineering effort — that cost justified the recommendation.
      </p>
    </div>
  );
}

function AILayer() {
  const [active, setActive] = useState(AI_STACK[0].tool);
  const tab = AI_STACK.find((t) => t.tool === active)!;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {AI_STACK.map((t) => (
          <button key={t.tool} onClick={() => setActive(t.tool)} style={{ padding: "8px 18px", borderRadius: "20px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${active === t.tool ? t.color + "55" : "rgba(255,255,255,0.1)"}`, background: active === t.tool ? `${t.color}15` : "rgba(255,255,255,0.03)", color: active === t.tool ? t.color : "#94a3b8", transition: "all 0.15s ease" }}>
            {t.tool}
          </button>
        ))}
      </div>

      {/* Tagline */}
      <p style={{ fontSize: "0.88rem", color: "#94a3b8", fontStyle: "italic", borderLeft: `3px solid ${tab.color}`, paddingLeft: "14px", lineHeight: 1.6 }}>
        {tab.tagline}
      </p>

      {/* Capability cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tab.capabilities.map((cap) => (
          <div key={cap.name} style={{ background: `${tab.color}06`, border: `1px solid ${tab.color}20`, borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: tab.color }}>{cap.name}</span>
              <span style={{ fontSize: "0.58rem", fontWeight: 800, padding: "2px 7px", borderRadius: "4px", background: `${tab.color}20`, color: tab.color, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{cap.tag}</span>
            </div>
            <p style={{ fontSize: "0.79rem", color: "#94a3b8", lineHeight: 1.65, flexGrow: 1 }}>{cap.desc}</p>
            <pre style={{ background: "#0a0a0f", border: `1px solid ${tab.color}20`, borderRadius: "8px", padding: "12px", fontFamily: "monospace", fontSize: "0.66rem", color: tab.color, lineHeight: 1.7, overflowX: "auto", margin: 0, whiteSpace: "pre" }}>
              {cap.code}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndustryAdapter() {
  const [selected, setSelected] = useState("B2B SaaS");
  const row = ARCH_INDUSTRY_MAP.find((r) => r.sector === selected)!;
  return (
    <div className="space-y-6">
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "20px" }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase" as const, marginBottom: "14px" }}>What transfers across industries</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f43f5e", marginBottom: "10px" }}>✗ What swaps</p>
            <ul className="space-y-2">
              {["Platform vendor and analytics tool names", "Primary product metric (conversion, activation, care pathway, etc.)", "Compliance regime (HIPAA, PCI DSS, GDPR: each sector has one)", "Cloud provider (often compliance-driven, not preference-driven)"].map((item) => (
                <li key={item} style={{ fontSize: "0.78rem", color: "#94a3b8", display: "flex", gap: "8px", lineHeight: 1.5 }}>
                  <span style={{ color: "#f43f5e", flexShrink: 0 }}>·</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#34d399", marginBottom: "10px" }}>✓ What stays</p>
            <ul className="space-y-2">
              {["Warehouse-native beats the sync-and-mirror pattern in every industry", "Egress cost dominates any full-export migration approach", "Product and finance teams always end up needing different tools", "Compliance constraint eliminates architecture options before cost is modelled"].map((item) => (
                <li key={item} style={{ fontSize: "0.78rem", color: "#94a3b8", display: "flex", gap: "8px", lineHeight: 1.5 }}>
                  <span style={{ color: "#34d399", flexShrink: 0 }}>·</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ARCH_INDUSTRY_MAP.map((r) => (
          <button key={r.sector} onClick={() => setSelected(r.sector)} style={{ padding: "8px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", border: `1px solid ${selected === r.sector ? r.color + "55" : "rgba(255,255,255,0.1)"}`, background: selected === r.sector ? `${r.color}15` : "rgba(255,255,255,0.03)", color: selected === r.sector ? r.color : "#94a3b8", transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: "6px" }}>
            {r.sector}
            {r.isReference && <span style={{ fontSize: "0.55rem", opacity: 0.65, fontWeight: 500 }}>ref</span>}
          </button>
        ))}
      </div>
      <div style={{ background: `${row.color}08`, border: `1px solid ${row.color}25`, borderRadius: "16px", padding: "24px", transition: "border-color 0.2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.05rem", fontWeight: 700, color: row.color }}>{row.sector}</span>
          <span style={{ fontSize: "0.72rem", color: "#64748b" }}>{row.subsector}</span>
          {row.isReference && <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: `${row.color}15`, color: row.color, marginLeft: "auto", letterSpacing: "0.08em" }}>REFERENCE</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Analytics layer",           value: row.warehouseTool  },
            { label: "BI tool",                   value: row.biTool         },
            { label: "Primary metric",            value: row.primaryMetric  },
            { label: "Cloud migration challenge", value: row.cloudMigration },
            { label: "Why two tools coexist",     value: row.biSplit        },
            { label: "Compliance constraint",     value: row.compliance     },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: row.color, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlowArrow({ label, color = "rgba(255,255,255,0.12)" }: { label?: string; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", padding: "4px 0", gap: "2px" }}>
      <div style={{ width: "1.5px", height: "18px", background: color }} />
      <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
        <path d="M1 1.5l4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label && <span style={{ fontSize: "0.57rem", color: "#4b5563", letterSpacing: "0.04em", textAlign: "center", maxWidth: "240px", marginTop: "2px" }}>{label}</span>}
    </div>
  );
}

function DataFlowDiagram() {
  const [view, setView] = useState<"before" | "after">("before");

  const products = [
    { name: "Experimentation", cloud: "GCP",   cloudCol: "#4285F4", col: "#6366f1" },
    { name: "CMS",             cloud: "Azure", cloudCol: "#0078D4", col: "#38bdf8" },
    { name: "Welcome",         cloud: "AWS",   cloudCol: "#FF9900", col: "#f59e0b" },
    { name: "Data Platform",   cloud: "AWS",   cloudCol: "#FF9900", col: "#34d399" },
    { name: "AI Agent",        cloud: "GCP",   cloudCol: "#34A853", col: "#a78bfa" },
  ];

  const thirdParty = [
    { name: "Salesforce", col: "#00A1E0" },
    { name: "Zendesk",    col: "#00949B" },
    { name: "NetSuite",   col: "#E84427" },
    { name: "Gainsight",  col: "#FF5F00" },
  ];

  return (
    <div className="space-y-3">
      <div style={{ display: "flex", gap: "8px" }}>
        {(["before", "after"] as const).map((v) => {
          const isActive = view === v;
          const col = v === "before" ? "#f43f5e" : "#34d399";
          return (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ padding: "7px 18px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: `1px solid ${isActive ? col + "55" : "rgba(255,255,255,0.08)"}`, background: isActive ? `${col}12` : "rgba(255,255,255,0.02)", color: isActive ? col : "#4b5563", transition: "all 0.18s ease" }}
            >
              {v === "before" ? "Before: Analytics Silo" : "After: Warehouse-Native"}
            </button>
          );
        })}
      </div>

      <div style={{ background: "rgba(255,255,255,0.018)", border: `1px solid ${view === "before" ? "rgba(244,63,94,0.18)" : "rgba(52,211,153,0.18)"}`, borderRadius: "16px", padding: "28px 20px 24px", transition: "border-color 0.3s ease", overflowX: "auto" }}>
        <p style={{ fontSize: "0.57rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" as const, textAlign: "center", marginBottom: "20px", color: view === "before" ? "rgba(244,63,94,0.45)" : "rgba(52,211,153,0.45)" }}>
          {view === "before" ? "Legacy architecture · Mixpanel era" : "Current architecture · Warehouse-native"}
        </p>

        <p style={{ fontSize: "0.55rem", fontWeight: 700, color: "#374151", letterSpacing: "0.12em", textTransform: "uppercase" as const, textAlign: "center", marginBottom: "8px" }}>
          Product Suite
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
          {products.map((p) => (
            <div key={p.name} style={{ background: `${p.col}0d`, border: `1px solid ${p.col}28`, borderRadius: "10px", padding: "8px 12px", textAlign: "center", minWidth: "80px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: p.col, marginBottom: "4px" }}>{p.name}</div>
              <div style={{ display: "inline-block", fontSize: "0.55rem", fontWeight: 700, padding: "1px 7px", borderRadius: "4px", background: `${p.cloudCol}18`, color: p.cloudCol }}>{p.cloud}</div>
            </div>
          ))}
        </div>

        <FlowArrow label="Segment SDK — identify / group / track" color="rgba(82,189,148,0.4)" />

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
          <div style={{ background: "rgba(82,189,148,0.1)", border: "1px solid rgba(82,189,148,0.28)", borderRadius: "12px", padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M18 7H10a5 5 0 0 0 0 10h3" stroke="#52BD94" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M6 17h8a5 5 0 0 0 0-10H9" stroke="#52BD94" strokeWidth="2.2" strokeLinecap="round" opacity="0.5"/>
              <circle cx="18" cy="7" r="2" fill="#52BD94"/>
              <circle cx="6" cy="17" r="2" fill="#52BD94" opacity="0.5"/>
            </svg>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#52BD94" }}>Segment</div>
              <div style={{ fontSize: "0.58rem", color: "#4b5563" }}>
                {view === "after" ? "Event collection + Protocols gate" : "Event collection"}
              </div>
            </div>
          </div>
        </div>

        {view === "before" ? (
          <>
            <div style={{ marginTop: "8px", display: "flex", gap: "12px", justifyContent: "center", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                <FlowArrow color="rgba(120,86,255,0.35)" />
                <div style={{ background: "rgba(120,86,255,0.1)", border: "1px solid rgba(120,86,255,0.28)", borderRadius: "12px", padding: "12px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#7856FF", marginBottom: "4px" }}>Mixpanel</div>
                  <div style={{ fontSize: "0.6rem", color: "#4b5563", marginBottom: "6px" }}>Behavioral analytics</div>
                  <span style={{ fontSize: "0.55rem", fontWeight: 800, padding: "2px 7px", borderRadius: "3px", background: "rgba(244,63,94,0.14)", color: "#f43f5e", letterSpacing: "0.06em" }}>ISOLATED</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", padding: "36px 8px 0" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.1rem", color: "#f43f5e", fontWeight: 900 }}>✕</div>
                  <div style={{ fontSize: "0.52rem", color: "rgba(244,63,94,0.6)", fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap" as const }}>No JOIN</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center", marginBottom: "3px" }}>
                  {thirdParty.map((t) => (
                    <span key={t.name} style={{ fontSize: "0.55rem", fontWeight: 600, padding: "2px 7px", borderRadius: "4px", background: `${t.col}18`, color: t.col, border: `1px solid ${t.col}25` }}>{t.name}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.55rem", color: "#374151", fontWeight: 600, marginBottom: "2px" }}>via Fivetran</div>
                <FlowArrow color="rgba(41,181,232,0.35)" />
                <div style={{ background: "rgba(41,181,232,0.1)", border: "1px solid rgba(41,181,232,0.28)", borderRadius: "12px", padding: "12px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#29B5E8", marginBottom: "4px" }}>Snowflake</div>
                  <div style={{ fontSize: "0.6rem", color: "#4b5563" }}>ARR · Salesforce · CRM</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "20px", background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.14)", borderRadius: "10px", padding: "12px 16px", maxWidth: "560px", margin: "20px auto 0", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              {["No ARR joins to behavioral data", "Schema changes break the sync", "Two sources · two board deck numbers"].map((txt) => (
                <span key={txt} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "#f43f5e" }}>
                  <span style={{ fontWeight: 800 }}>✕</span> {txt}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <FlowArrow label="Protocols rejects unplanned events at ingestion" color="rgba(251,191,36,0.4)" />

            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "4px" }}>
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "4px", paddingBottom: "2px" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                  {thirdParty.map((t) => (
                    <span key={t.name} style={{ fontSize: "0.55rem", fontWeight: 600, padding: "2px 6px", borderRadius: "3px", background: `${t.col}18`, color: t.col }}>{t.name}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.55rem", color: "#374151", fontWeight: 600 }}>Fivetran</div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <line x1="4" y1="0" x2="4" y2="10" stroke="rgba(41,181,232,0.3)" strokeWidth="1.5"/>
                  <path d="M1 7.5l3 3 3-3" stroke="rgba(41,181,232,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div style={{ background: "rgba(41,181,232,0.1)", border: "1px solid rgba(41,181,232,0.35)", borderRadius: "12px", padding: "12px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#29B5E8", marginBottom: "3px" }}>Snowflake RAW</div>
                <div style={{ fontSize: "0.58rem", color: "#4b5563" }}>Single landing zone · append-only</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "4px", paddingBottom: "2px" }}>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                  {[{ label: "GCP", col: "#4285F4" }, { label: "Azure", col: "#0078D4" }, { label: "AWS", col: "#FF9900" }].map((s) => (
                    <span key={s.label} style={{ fontSize: "0.55rem", fontWeight: 600, padding: "2px 6px", borderRadius: "3px", background: `${s.col}18`, color: s.col }}>{s.label}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.55rem", color: "#374151", fontWeight: 600 }}>RAW extracts</div>
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                  <line x1="4" y1="0" x2="4" y2="10" stroke="rgba(41,181,232,0.3)" strokeWidth="1.5"/>
                  <path d="M1 7.5l3 3 3-3" stroke="rgba(41,181,232,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            <FlowArrow label="dbt: staging → intermediate → mart" color="rgba(255,105,75,0.4)" />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
              <div style={{ background: "rgba(255,105,75,0.1)", border: "1px solid rgba(255,105,75,0.28)", borderRadius: "12px", padding: "10px 20px", display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#FF694B" strokeWidth="1.8" strokeLinejoin="round"/>
                  <path d="M4 7L12 12L20 7" stroke="#FF694B" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
                  <line x1="12" y1="12" x2="12" y2="22" stroke="#FF694B" strokeWidth="1.4" opacity="0.5"/>
                </svg>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FF694B" }}>dbt</div>
                  <div style={{ fontSize: "0.58rem", color: "#4b5563" }}>Transform layer · 100% test coverage</div>
                </div>
              </div>
            </div>

            <FlowArrow label="ARR-joined · identity-resolved · cross-product" color="rgba(99,102,241,0.4)" />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
              <div style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "12px", padding: "10px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#6366f1" }}>Reporting Layer</div>
                <div style={{ fontSize: "0.58rem", color: "#4b5563" }}>Consumer-ready · &lt;2s P95 · 100+ weekly active users</div>
              </div>
            </div>

            <FlowArrow color="rgba(255,255,255,0.1)" />

            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              {[
                { name: "Analytics Platform",   role: "product managers · product exploration",     col: "#6366f1" },
                { name: "Power BI",             role: "Finance · board reporting",      col: "#F2C811" },
                { name: "AI Agent",             role: "Agents · board prep · alerts",   col: "#a78bfa" },
              ].map((c) => (
                <div key={c.name} style={{ background: `${c.col}0d`, border: `1px solid ${c.col}28`, borderRadius: "10px", padding: "10px 16px", textAlign: "center", minWidth: "130px" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: c.col, marginBottom: "3px" }}>{c.name}</div>
                  <div style={{ fontSize: "0.57rem", color: "#374151" }}>{c.role}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.14)", borderRadius: "10px", padding: "12px 16px", maxWidth: "560px", margin: "20px auto 0", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
              {["One warehouse, one source of truth", "ARR + behavioral joins in SQL", "No sync layer, no version skew"].map((txt) => (
                <span key={txt} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "#34d399" }}>
                  <span style={{ fontWeight: 800 }}>✓</span> {txt}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Divider() { return <div className="divider-gradient" />; }

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", zIndex: 100, background: "rgba(255,255,255,0.04)" }}>
      <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #f43f5e, #fb7185)", transition: "width 0.08s linear", boxShadow: "0 0 10px rgba(244,63,94,0.5)" }} />
    </div>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <div style={{ padding: "6px 0 6px 22px", borderLeft: "3px solid rgba(244,63,94,0.45)", margin: "8px 0" }} className="max-w-2xl">
      <p style={{ fontSize: "1.12rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.55, letterSpacing: "-0.01em", fontStyle: "italic" }}>
        {text}
      </p>
    </div>
  );
}

function OwnershipCard() {
  const areas = [
    { label: "Cost Modeling",          note: "Egress asymmetry discovery" },
    { label: "Decision Records",        note: "DR 001 + DR 002, both approved" },
    { label: "Stakeholder Alignment",   note: "Product · Finance · Engineering" },
    { label: "Migration Sequencing",    note: "Parallel-run design, zero downtime" },
    { label: "Parity Validation",       note: "6-week sprint · all dashboards" },
  ];
  return (
    <div style={{ background: "rgba(244,63,94,0.03)", border: "1px solid rgba(244,63,94,0.12)", borderRadius: "14px", padding: "18px 22px", display: "flex", gap: "18px", alignItems: "flex-start", flexWrap: "wrap" as const }}>
      <div style={{ flexShrink: 0, minWidth: "90px" }}>
        <p style={{ fontSize: "0.57rem", fontWeight: 800, color: "#f43f5e", letterSpacing: "0.16em", textTransform: "uppercase" as const, marginBottom: "4px" }}>What I Owned</p>
        <p style={{ fontSize: "0.65rem", color: "#374151", lineHeight: 1.5 }}>My specific scope<br/>on this project</p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, flex: 1 }}>
        {areas.map((a) => (
          <div key={a.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(244,63,94,0.14)", borderRadius: "8px", padding: "7px 12px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "2px" }}>{a.label}</div>
            <div style={{ fontSize: "0.6rem", color: "#4b5563" }}>{a.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChapterSummary({ points }: { points: string[] }) {
  return (
    <div style={{ background: "rgba(244,63,94,0.04)", border: "1px solid rgba(244,63,94,0.12)", borderRadius: "12px", padding: "18px 22px" }}>
      <p style={{ fontSize: "0.58rem", fontWeight: 800, color: "#f43f5e", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: "12px" }}>What this chapter establishes</p>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {points.map((pt, i) => (
          <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: i < points.length - 1 ? "8px" : 0 }}>
            <span style={{ color: "#f43f5e", flexShrink: 0, marginTop: "3px", fontSize: "0.65rem" }}>◆</span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WrongAbout() {
  const items = [
    {
      wrong: "I thought parity validation would take two weeks.",
      right: "It took six. Every dashboard had edge cases I hadn't considered, and three had genuine data gaps that needed to be fixed before parity could be declared.",
    },
    {
      wrong: "I planned for product manager, Customer Success, and Executive tiers. That was the audience.",
      right: "Finance and Sales found the dashboards before the formal rollout. Extending the tier model mid-deployment was messier than it should have been.",
    },
    {
      wrong: "I assumed the technical migration was the finish line.",
      right: "The finish line was stakeholder trust. The numbers matched on day one. Getting every team to stop cross-checking Mixpanel took months longer than migrating the data.",
    },
  ];
  return (
    <div style={{ background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.14)", borderRadius: "14px", padding: "24px 28px" }}>
      <p style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fbbf24", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: "18px" }}>What I was wrong about</p>
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#fbbf24" }}>{i + 1}</span>
            </div>
            <div className="space-y-1.5">
              <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fbbf24", opacity: 0.65, textDecoration: "line-through" }}>{item.wrong}</p>
              <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.65 }}>{item.right}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardDeckMockup() {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "20px 24px", maxWidth: "480px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "1px", background: "#f43f5e" }} />
        <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#4b5563", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Q3 Board Deck · Slide 7</span>
      </div>
      <p style={{ fontSize: "0.68rem", fontWeight: 600, color: "#64748b", marginBottom: "14px", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Monthly Active Experimenters</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {[
          { source: "Mixpanel",  value: "1,247", color: "#f43f5e" },
          { source: "Snowflake", value: "1,189", color: "#38bdf8" },
        ].map(({ source, value, color }) => (
          <div key={source} style={{ background: `${color}0d`, border: `1px solid ${color}28`, borderRadius: "10px", padding: "14px 16px" }}>
            <p style={{ fontSize: "0.58rem", fontWeight: 800, color, letterSpacing: "0.12em", marginBottom: "6px" }}>{source.toUpperCase()}</p>
            <p style={{ fontSize: "2.1rem", fontWeight: 800, color, fontFamily: "monospace", lineHeight: 1 }}>{value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1rem", fontWeight: 800, color: "#64748b", flexShrink: 0 }}>?</span>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", fontStyle: "italic" }}>Which number goes in the board deck?</p>
      </div>
      <p style={{ fontSize: "0.62rem", color: "#374151", marginTop: "10px", textAlign: "center" as const }}>Both defensible. Neither wrong. That&apos;s the problem.</p>
    </div>
  );
}

function Objection({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{ background: open ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "14px 18px", cursor: "pointer", maxWidth: "600px", transition: "background 0.15s ease" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "#94a3b8", background: "rgba(255,255,255,0.07)", padding: "3px 8px", borderRadius: "4px", flexShrink: 0, letterSpacing: "0.1em", whiteSpace: "nowrap" as const }}>BUT WAIT —</span>
        <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", flex: 1, lineHeight: 1.45 }}>{question}</p>
        <span style={{ fontSize: "0.75rem", color: "#4b5563", flexShrink: 0, marginTop: "2px", display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
      </div>
      {open && (
        <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.75, marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {answer}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold tracking-[0.2em] uppercase px-2 py-1 rounded" style={{ color: "#f43f5e", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}>{label}</span>
      <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function ChapterBadge({ ch, title, desc }: { ch: string; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0, background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "0.62rem", fontWeight: 800, color: "#f43f5e", letterSpacing: "0.08em" }}>{ch}</span>
      </div>
      <div>
        <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#f43f5e", letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: "2px" }}>Chapter {ch}</p>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#ffffff", lineHeight: 1.15, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "3px" }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Tool logos ────────────────────────────────────────────────────────────────

const SA_TOOLS: Record<string, { color: string; category: string; svg: React.ReactNode }> = {
  Snowflake:              { color: "#29B5E8", category: "Data Warehouse",    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><line x1="12" y1="2" x2="12" y2="22" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="12" x2="22" y2="12" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="5.5" y1="5.5" x2="18.5" y2="18.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><line x1="18.5" y1="5.5" x2="5.5" y2="18.5" stroke="#29B5E8" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="2.5" fill="#29B5E8"/></svg> },
  BigQuery:               { color: "#4285F4", category: "GCP Analytics",     svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M4 6h16v12H4z" stroke="#4285F4" strokeWidth="1.8" fill="#4285F4" fillOpacity="0.12"/><path d="M8 10h8M8 14h5" stroke="#4285F4" strokeWidth="1.8" strokeLinecap="round"/><circle cx="18" cy="18" r="3" fill="#4285F4" fillOpacity="0.3" stroke="#4285F4" strokeWidth="1.5"/><path d="M20 20l2 2" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  AWS:                    { color: "#FF9900", category: "Cloud (source)",    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M7 14c-1.7-.5-3-2-3-3.8C4 8.3 5.8 6.5 8 6.5c.3 0 .5 0 .8.1A5 5 0 0 1 18 9c1.1 0 2 .9 2 2s-.9 2-2 2H7z" stroke="#FF9900" strokeWidth="1.6" fill="#FF9900" fillOpacity="0.1"/><path d="M6 18l2-2 2 2M14 18l2-2 2 2" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  GCP:                    { color: "#34A853", category: "Cloud (target)",    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="9" stroke="#34A853" strokeWidth="1.8"/><path d="M12 7v5l3 3" stroke="#34A853" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#34A853" fillOpacity="0.3"/></svg> },
  dbt:                    { color: "#FF694B", category: "Transformation",    svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#FF694B" strokeWidth="1.8" strokeLinejoin="round"/><path d="M4 7L12 12L20 7" stroke="#FF694B" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/><line x1="12" y1="12" x2="12" y2="22" stroke="#FF694B" strokeWidth="1.8" opacity="0.5"/></svg> },
  Python:                 { color: "#3776AB", category: "Scripting",         svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M12 2C9 2 8 3.5 8 5v3h4.5v1H5.5C3.5 9 2 10.5 2 13s1.4 4 3.5 4H7v-2.5C7 12.5 8.5 11 11 11h6c2 0 3-1.2 3-3V5c0-2-1.5-3-8-3Z" fill="#3776AB" fillOpacity="0.8"/><circle cx="10" cy="5.5" r="1" fill="white"/><path d="M12 22c3 0 4-1.5 4-3v-3h-4.5v-1h6.5c2 0 3.5-1.5 3.5-4s-1.4-4-3.5-4H17v2.5C17 11.5 15.5 13 13 13H7c-2 0-3 1.2-3 3v3c0 2 1.5 3 8 3Z" fill="#FFD43B" fillOpacity="0.9"/><circle cx="14" cy="18.5" r="1" fill="#3776AB"/></svg> },
  "Analytics Platform":   { color: "#6366f1", category: "Product Analytics", svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><circle cx="12" cy="12" r="9" stroke="#6366f1" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="#6366f1" opacity="0.25"/><circle cx="12" cy="12" r="1.5" fill="#6366f1"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/></svg> },
  Segment:                { color: "#52BD94", category: "Event Collection",  svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><path d="M18 7H10a5 5 0 0 0 0 10h3" stroke="#52BD94" strokeWidth="2" strokeLinecap="round"/><path d="M6 17h8a5 5 0 0 0 0-10H9" stroke="#52BD94" strokeWidth="2" strokeLinecap="round" opacity="0.55"/><circle cx="18" cy="7" r="2" fill="#52BD94"/><circle cx="6" cy="17" r="2" fill="#52BD94" opacity="0.55"/></svg> },
  "Power BI":             { color: "#F2C811", category: "Business Intel.",   svg: <svg viewBox="0 0 24 24" fill="none" width="28" height="28"><rect x="14" y="4" width="6" height="16" rx="1.5" fill="#F2C811"/><rect x="8" y="9" width="5" height="11" rx="1.5" fill="#F2C811" opacity="0.7"/><rect x="2" y="14" width="5" height="6" rx="1.5" fill="#F2C811" opacity="0.4"/></svg> },
};

function SAToolCard({ name }: { name: string }) {
  const t = SA_TOOLS[name];
  if (!t) return <span style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "6px 14px", fontSize: "0.88rem", color: "#94a3b8" }}>{name}</span>;
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
