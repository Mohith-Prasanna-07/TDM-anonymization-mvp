import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Shield,
  Database,
  Upload,
  Settings,
  Play,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Activity,
  Lock,
  ChevronRight,
  Layers,
  Send,
  LayoutDashboard,
  Boxes,
  Briefcase,
  Plug,
  Tags,
  SlidersHorizontal,
  ListChecks,
  History,
  TableProperties,
  Users,
  HelpCircle,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000";

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-slate-200 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}


const blueprintWorkspaces = [
  {
    name: "Claims Modernization",
    owner: "Priya Shah",
    environment: "DEV",
    description: "Workspace for claims source systems, sandbox schemas, masked data, and QA-ready pipelines.",
    domains: [
      {
        name: "Claims",
        asset: "Claims Core Asset",
        tables: ["patient_records", "appointments", "insurance_claims"],
        pipelines: ["Claims_Daily_Masking", "Claims_QA_Subset"],
      },
      {
        name: "Provider",
        asset: "Provider Reference Asset",
        tables: ["doctor_reference", "department_reference"],
        pipelines: ["Provider_Weekly_Masking"],
      },
    ],
  },
  {
    name: "Customer 360 QA",
    owner: "Alex Chen",
    environment: "QA",
    description: "Workspace for customer profile testing, contact masking, and regression-ready datasets.",
    domains: [
      {
        name: "Customer",
        asset: "Customer Golden Record",
        tables: ["customer_profile", "customer_contact", "customer_address"],
        pipelines: ["C360_Nightly_Masking"],
      },
      {
        name: "Preferences",
        asset: "Marketing Preference Asset",
        tables: ["email_preferences", "sms_preferences"],
        pipelines: ["Preference_Masking_Weekly"],
      },
    ],
  },
  {
    name: "Salesforce Sandbox",
    owner: "Maya Patel",
    environment: "UAT",
    description: "Workspace for CRM object extraction and masked sandbox refresh validation.",
    domains: [
      {
        name: "CRM",
        asset: "CRM Lead Asset",
        tables: ["account", "contact", "lead", "opportunity", "case"],
        pipelines: ["SFDC_Sandbox_Refresh"],
      },
    ],
  },
];

const blueprintConnections = [
  {
    name: "SQL_PROD_HEALTHCARE",
    type: "SQL Server",
    sourceType: "DB",
    connection: "sql-prod.company.com:1433/DDB",
    status: "Connected",
    purpose: "Production-like source metadata and schema discovery",
  },
  {
    name: "DBX_TDM_MASKED",
    type: "Databricks",
    sourceType: "Target",
    connection: "healthcare_catalog.patient_schema",
    status: "Connected",
    purpose: "Masked test data landing and execution orchestration",
  },
  {
    name: "SQL_QA_MASKED",
    type: "SQL Server",
    sourceType: "Target",
    connection: "sql-qa.company.com:1433/TDM_QA",
    status: "Draft",
    purpose: "QA target for project-specific sandbox outputs",
  },
  {
    name: "SFTP_MEMBER_FEED",
    type: "SFTP",
    sourceType: "File",
    connection: "sftp://feeds.company.com/inbound/member",
    status: "Connected",
    purpose: "Future file-based source ingestion",
  },
];

const blueprintPipelines = [
  {
    name: "Claims_Daily_Masking",
    workspace: "Claims Modernization",
    source: "SQL_PROD_HEALTHCARE",
    target: "DBX_TDM_MASKED",
    sandbox: "person_a_project_001_dev_schema",
    lastRun: "2026-06-12 08:30 AM",
    tables: ["patient_records", "appointments", "insurance_claims"],
    status: "Ready",
  },
  {
    name: "Patient_QA_Refresh",
    workspace: "Claims Modernization",
    source: "SQL_PROD_HEALTHCARE",
    target: "SQL_QA_MASKED",
    sandbox: "person_b_project_002_qa_schema",
    lastRun: "2026-06-11 09:15 PM",
    tables: ["patient_records", "insurance_claims"],
    status: "Draft",
  },
  {
    name: "Regression_Claims_Masking",
    workspace: "Customer 360 QA",
    source: "SQL_PROD_HEALTHCARE",
    target: "DBX_TDM_MASKED",
    sandbox: "person_c_project_003_regression_schema",
    lastRun: "Not executed yet",
    tables: ["patient_records", "appointments", "insurance_claims", "customer_profile"],
    status: "In Review",
  },
];

const maskedAssetSamples = [
  {
    asset: "Patient Records Masked Asset",
    workspace: "Claims Modernization",
    sandbox: "person_a_project_001_dev_schema",
    tables: ["patient_records", "appointments"],
    rows: "150",
    status: "Ready",
  },
  {
    asset: "Claims QA Masked Asset",
    workspace: "Claims Modernization",
    sandbox: "person_b_project_002_qa_schema",
    tables: ["patient_records", "insurance_claims"],
    rows: "250",
    status: "Ready",
  },
  {
    asset: "Regression Masked Asset",
    workspace: "Customer 360 QA",
    sandbox: "person_c_project_003_regression_schema",
    tables: ["patient_records", "appointments", "insurance_claims"],
    rows: "375",
    status: "Draft",
  },
];

function Button({ children, onClick, disabled, variant = "default", className = "", type = "button" }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

const sampleColumns = [
  { name: "customer_id", type: "string", pii: true, rule: "Hash" },
  { name: "full_name", type: "string", pii: true, rule: "Fake Value" },
  { name: "email", type: "string", pii: true, rule: "Fake Value" },
  { name: "phone_number", type: "string", pii: true, rule: "Fake Value" },
  { name: "date_of_birth", type: "date", pii: true, rule: "Date Shift" },
  { name: "city", type: "string", pii: false, rule: "No Masking" },
  { name: "account_balance", type: "decimal", pii: false, rule: "No Masking" },
];

const workflowSteps = [
  { id: 1, label: "Sandbox & Source", icon: Database },
  { id: 2, label: "Rule Configuration", icon: Settings },
  { id: 3, label: "Run Summary", icon: Play },
  { id: 4, label: "Review Output", icon: Eye },
];

const navGroups = [
  {
    group: "Main",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "data_inventory", label: "Data Inventory", icon: Boxes },
      { key: "workspaces", label: "Workspace", icon: Briefcase },
      { key: "metadata_versions", label: "Metadata Versions", icon: History },
    ],
  },
  {
    group: "Configure",
    items: [
      { key: "source_connections", label: "Source Connections", icon: Plug },
      { key: "data_classification", label: "Data Classification", icon: Tags },
      { key: "masking_rules", label: "Rule Configuration", icon: SlidersHorizontal },
      { key: "subsetting_rules", label: "Subsetting Rules", icon: ListChecks },
    ],
  },
  {
    group: "Execute",
    items: [
      { key: "create_pipeline", label: "Pipeline Workspace", icon: Play },
      { key: "existing_pipelines", label: "Existing Pipelines", icon: History },
      { key: "job_monitor", label: "Execution Monitor", icon: Activity },
      { key: "data_preview", label: "Masked Data Assets", icon: TableProperties },
    ],
  },
  {
    group: "Admin",
    items: [
      { key: "user_access", label: "User Access & Roles", icon: Users },
      { key: "configuration", label: "Configuration", icon: Settings },
    ],
  },
  {
    group: "Help",
    items: [{ key: "help", label: "Documentation", icon: HelpCircle }],
  },
];

function MetricCard({ icon: Icon, label, value, helper }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[13px] text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-[11px] text-slate-500">{helper}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-3">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@tdm.com");
  const [password, setPassword] = useState("Admin@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post("http://127.0.0.1:8000/auth/login", {
        email,
        password,
      });

      if (response.data.status === "SUCCESS") {
        onLogin(response.data.user);
      } else {
        setError(response.data.message || "Login failed.");
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Unable to connect to backend login API.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <div className="inline-flex rounded-3xl bg-white/10 p-4">
            <Shield className="h-10 w-10" />
          </div>

          <p className="mt-8 text-[13px] font-medium uppercase tracking-wide text-slate-400">
            TDM Secure Workspace
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Data Anonymization Control Center
          </h1>

          <p className="mt-5 max-w-xl text-[13px] leading-6 text-slate-300 md:text-[14px]">
            Sign in to access extraction, synthetic test data generation, anonymization,
            job monitoring, audit validation, role-based access, and assistant-driven TDM support.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Admin</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Full access to dashboards, data inventory, rule configuration, pipelines,
                monitoring, user access, and configuration.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Developer</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-400">
                Access to assigned workflows, data classification, masking, pipeline execution,
                preview, and job monitoring.
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-[13px] text-slate-500">Use demo credentials to enter the MVP.</p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setEmail("admin@tdm.com");
                  setPassword("Admin@123");
                }}
              >
                Use Admin
              </Button>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setEmail("developer@tdm.com");
                  setPassword("Dev@123");
                }}
              >
                Use Developer
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-[13px] font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
                  placeholder="admin@tdm.com"
                />
              </div>

              <div>
                <label className="text-[13px] font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
                  placeholder="Password"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                  {error}
                </div>
              )}

              <Button onClick={login} disabled={loading} className="w-full rounded-xl">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-[11px] text-slate-600">
              <p className="font-medium text-slate-800">Demo credentials</p>
              <p className="mt-2">Admin: admin@tdm.com / Admin@123</p>
              <p>Developer: developer@tdm.com / Dev@123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EnterpriseSideMenu({
  currentUser,
  activePage,
  setActivePage,
  isMenuCollapsed,
  setIsMenuCollapsed,
}) {
  const permissions = [
    ...(currentUser?.permissions || []),
    "workspaces",
    "metadata_versions",
    "source_connections",
    "existing_pipelines",
    "data_preview",
  ];

  const [openGroups, setOpenGroups] = useState({
    Main: false,
    Configure: false,
    Execute: false,
    Admin: false,
    Help: false,
  });

  useEffect(() => {
  if (isMenuCollapsed) {
    setOpenGroups({
      Main: false,
      Configure: false,
      Execute: false,
      Admin: false,
      Help: false,
    });
  }
}, [isMenuCollapsed]);

  const toggleGroup = (groupName) => {
    setOpenGroups((current) => ({
      ...current,
      [groupName]: !current[groupName],
    }));
  };

  const allowedNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => permissions.includes(item.key)),
    }))
    .filter((group) => group.items.length > 0);

  const flattenedItems = allowedNavGroups.flatMap((group) => group.items);

  if (isMenuCollapsed) {
    return (
      <aside className="w-full min-w-0 overflow-hidden rounded-3xl bg-slate-950 p-3 text-white shadow-sm lg:min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsMenuCollapsed(false)}
            className="rounded-xl bg-white/10 p-2.5 transition hover:bg-white/20"
            title="Expand menu"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>

          <div className="h-px w-full bg-white/10" />

          {flattenedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                title={item.label}
                className={`shrink-0 rounded-2xl p-3 transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full min-w-0 overflow-hidden rounded-3xl bg-slate-950 p-4 text-white shadow-sm lg:min-h-screen">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-2xl bg-white/10 p-3">
            <Layers className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] uppercase tracking-wide text-slate-400">
              TDM Platform
            </p>
            <h2 className="truncate text-lg font-semibold text-white">Control Panel</h2>
          </div>
        </div>

        <button
          onClick={() => setIsMenuCollapsed(true)}
          className="shrink-0 rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"
          title="Collapse menu"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          Signed in as
        </p>
        <p className="mt-1 truncate text-[13px] font-semibold text-white">
          {currentUser?.name}
        </p>
        <p className="mt-1 truncate text-[11px] capitalize text-slate-400">
          {currentUser?.role}
        </p>
      </div>

      <div className="mt-7 space-y-4">
        {allowedNavGroups.map((group) => {
          const isOpen = openGroups[group.group];

          return (
            <div key={group.group} className="rounded-2xl border border-white/10 bg-white/5">
              <button
                onClick={() => toggleGroup(group.group)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {group.group}
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="space-y-2 px-3 pb-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.key;

                    return (
                      <button
                        key={item.key}
                        onClick={() => setActivePage(item.key)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          isActive
                            ? "border-white bg-white text-slate-950"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`shrink-0 rounded-xl p-2 ${
                              isActive ? "bg-slate-100" : "bg-white/10"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium leading-5">{item.label}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[13px] font-medium text-white">Role-Based MVP</p>
        <p className="mt-2 text-[11px] leading-5 text-slate-400">
          Menu groups expand only when selected. Use the collapse button to keep
          the workspace focused.
        </p>
      </div>
    </aside>
  );
}

function PageHeader({ title, description, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl bg-white px-5 py-4 shadow-sm md:px-6 md:py-5"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-slate-900 p-3 text-white">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            TDM Modernization MVP
          </p>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
            {title}
          </h1>
          <p className="mt-1 max-w-3xl text-[12px] leading-5 text-slate-500 md:text-[13px]">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardSummary() {
  const [summary, setSummary] = useState({
    totalJobs: 0,
    latestStatus: "No Runs",
    latestRows: 0,
    outputAvailable: "No",
  });

  const fetchSummary = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/jobs/history");
      const jobs = response.data.jobs || [];

      if (jobs.length === 0) {
        setSummary({
          totalJobs: 0,
          latestStatus: "No Runs",
          latestRows: 0,
          outputAvailable: "No",
        });
        return;
      }

      const latestJob = jobs[0];

      setSummary({
        totalJobs: jobs.length,
        latestStatus: latestJob.status,
        latestRows: latestJob.rows_processed || 0,
        outputAvailable: latestJob.output_target ? "Yes" : "No",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard icon={Activity} label="Total Jobs" value={summary.totalJobs} helper="Backend session runs" />
      <MetricCard icon={CheckCircle2} label="Latest Status" value={summary.latestStatus} helper="Most recent job" />
      <MetricCard icon={Database} label="Latest Rows" value={summary.latestRows.toLocaleString()} helper="Rows processed" />
      <MetricCard icon={FileText} label="Masked Output" value={summary.outputAvailable} helper="CSV available" />
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="High-level view of pipeline activity, recent jobs, anonymization status, and output readiness."
        icon={LayoutDashboard}
      />
      <EnterpriseBlueprintMetrics />
      <DashboardSummary />
      <JobHistory />
    </div>
  );
}

function DataInventoryPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/datasets");
      setDatasets(response.data.datasets || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Inventory"
        description="View uploaded and generated datasets, detected schema, source type, and available columns."
        icon={Boxes}
      />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Available Datasets</h2>
              <p className="text-[13px] text-slate-500">Datasets exist for the current backend session.</p>
            </div>

            <Button variant="outline" className="rounded-xl" onClick={fetchDatasets}>
              Refresh
            </Button>
          </div>

          {loading && <p className="mt-5 text-[13px] text-slate-500">Loading datasets...</p>}

          {!loading && datasets.length === 0 && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[13px] text-slate-600">
              No datasets found. Go to Execute → Create Pipeline to upload or generate data.
            </div>
          )}

          {!loading && datasets.length > 0 && (
            <div className="mt-6 grid gap-4">
              {datasets.map((dataset) => (
                <div key={dataset.dataset_id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{dataset.filename}</p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Source: {dataset.source_type} · Uploaded:{" "}
                        {new Date(dataset.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                      {dataset.columns?.length || 0} columns
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(dataset.columns || []).map((column) => (
                      <span
                        key={column.name}
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          column.pii
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {column.name}: {column.rule}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



function MetadataVersionsPage() {
  const [sandboxes, setSandboxes] = useState([]);
  const [versions, setVersions] = useState([]);
  const [sourceDatabases, setSourceDatabases] = useState([]);
  const [selectedSandboxId, setSelectedSandboxId] = useState("");
  const [sourceMetadataDatabase, setSourceMetadataDatabase] = useState("healthcare_catalog.patient_schema");
  const [selectedTablesText, setSelectedTablesText] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [validationVersionId, setValidationVersionId] = useState("");
  const [driftMode, setDriftMode] = useState("additive");
  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [successorCreating, setSuccessorCreating] = useState(false);

  const selectedSandbox = sandboxes.find((sandbox) => sandbox.sandbox_id === selectedSandboxId);

  const fetchMetadataWorkspace = async () => {
    try {
      const [sandboxResponse, versionResponse, databaseResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/sandboxes`),
        axios.get(`${API_BASE_URL}/metadata/versions`),
        axios.get(`${API_BASE_URL}/source-metadata/databricks/databases`),
      ]);

      if (sandboxResponse.data.status === "SUCCESS") {
        setSandboxes(sandboxResponse.data.sandboxes || []);
      }

      if (versionResponse.data.status === "SUCCESS") {
        setVersions(versionResponse.data.versions || []);
      }

      if (databaseResponse.data.status === "SUCCESS") {
        const databases = databaseResponse.data.databases || [];
        setSourceDatabases(databases);
        if (databases.length > 0 && !databases.includes(sourceMetadataDatabase)) {
          setSourceMetadataDatabase(databases[0]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load metadata version workspace.");
    }
  };

  useEffect(() => {
    fetchMetadataWorkspace();
  }, []);

  useEffect(() => {
    const sandbox = sandboxes.find((item) => item.sandbox_id === selectedSandboxId);

    if (sandbox) {
      setSelectedTablesText((sandbox.selected_tables || []).join(", "));
    }
  }, [selectedSandboxId, sandboxes]);

  const createMetadataVersion = async () => {
    setMessage("");
    setError("");
    setValidationResult(null);

    if (!selectedSandboxId) {
      setError("Please select a sandbox/project first.");
      return;
    }

    const selectedTables = selectedTablesText
      .split(",")
      .map((table) => table.trim())
      .filter(Boolean);

    if (selectedTables.length === 0) {
      setError("Please enter at least one table for the metadata version.");
      return;
    }

    try {
      setCreating(true);

      const response = await axios.post(`${API_BASE_URL}/metadata/versions/from-sandbox`, {
        sandbox_id: selectedSandboxId,
        source_metadata_database: sourceMetadataDatabase,
        selected_tables: selectedTables,
        version_label: versionLabel.trim() || null,
        change_summary: "Project-specific source metadata snapshot created from sandbox.",
      });

      if (response.data.status === "SUCCESS") {
        setMessage(
          `Created metadata ${response.data.version.version_label} for ${response.data.version.project_id} and linked it to ${response.data.version.sandbox_schema}.`
        );
        setVersionLabel("");
        setValidationVersionId(response.data.version.metadata_version_id);
        await fetchMetadataWorkspace();
      } else {
        setError(response.data.message || "Failed to create metadata version.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to create metadata version.");
    } finally {
      setCreating(false);
    }
  };

  const validateDrift = async () => {
    setMessage("");
    setError("");

    if (!validationVersionId) {
      setError("Please select a metadata version to validate.");
      return;
    }

    try {
      setValidating(true);
      const response = await axios.post(
        `${API_BASE_URL}/metadata/versions/${validationVersionId}/validate-drift`,
        { drift_mode: driftMode }
      );

      if (response.data.status === "SUCCESS") {
        setValidationResult(response.data);
      } else {
        setError(response.data.message || "Failed to validate schema drift.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to validate schema drift.");
    } finally {
      setValidating(false);
    }
  };

  const createSuccessorVersion = async () => {
    if (!validationVersionId) return;

    try {
      setSuccessorCreating(true);
      const response = await axios.post(
        `${API_BASE_URL}/metadata/versions/${validationVersionId}/create-successor`,
        {
          drift_mode: driftMode,
          change_summary: "Successor metadata version created after schema drift mitigation.",
        }
      );

      if (response.data.status === "SUCCESS") {
        setMessage(
          `Created successor metadata ${response.data.new_version.version_label}. Previous version is preserved.`
        );
        setValidationVersionId(response.data.new_version.metadata_version_id);
        setValidationResult(null);
        await fetchMetadataWorkspace();
      } else {
        setError(response.data.message || "Failed to create successor version.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to create successor version.");
    } finally {
      setSuccessorCreating(false);
    }
  };

  const activeVersions = versions.filter((version) => version.status === "ACTIVE").length;
  const totalProjects = new Set(versions.map((version) => version.project_id).filter(Boolean)).size;
  const totalColumns = versions.reduce((sum, version) => sum + (version.column_count || 0), 0);

  const statusBadgeClass = (status) => {
    if (status === "BLOCKED") return "bg-rose-50 text-rose-700";
    if (status === "WARNING") return "bg-amber-50 text-amber-700";
    if (status === "PASSED" || status === "READY") return "bg-emerald-50 text-emerald-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metadata Versions"
        description="Show how different projects work on different versions of the same source metadata while preserving sandbox isolation and schema drift controls."
        icon={History}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={History} label="Metadata Versions" value={versions.length} helper="All saved source metadata snapshots" />
        <MetricCard icon={Briefcase} label="Projects Covered" value={totalProjects} helper="Independent project-level versions" />
        <MetricCard icon={Database} label="Columns Versioned" value={totalColumns} helper="Columns captured across versions" />
      </div>

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Project-Based Source Metadata Versioning</h2>
              <p className="mt-1 max-w-4xl text-[13px] text-slate-500">
                Each project/sandbox can hold its own source metadata version. Project #1 can run V1, Project #2 can run V2, and Project #3 can run V3, even when the selected tables overlap. Changes are scoped to the sandbox and version, not the shared source table.
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
              Versioned Metadata Repository
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Project Sandbox</label>
              <select
                value={selectedSandboxId}
                onChange={(event) => setSelectedSandboxId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="">Select sandbox</option>
                {sandboxes.map((sandbox) => (
                  <option key={sandbox.sandbox_id} value={sandbox.sandbox_id}>
                    {sandbox.project_id} — {sandbox.sandbox_schema}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Source Metadata</label>
              <select
                value={sourceMetadataDatabase}
                onChange={(event) => setSourceMetadataDatabase(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                {sourceDatabases.map((database) => (
                  <option key={database} value={database}>{database}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Version Label</label>
              <input
                value={versionLabel}
                onChange={(event) => setVersionLabel(event.target.value)}
                placeholder="Auto, e.g. V1"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={createMetadataVersion}
                disabled={creating}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                {creating ? "Creating..." : "Create Metadata Version"}
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[11px] font-medium text-slate-600">Tables in this metadata version</label>
            <textarea
              value={selectedTablesText}
              onChange={(event) => setSelectedTablesText(event.target.value)}
              rows={2}
              placeholder="patient_records, appointments, insurance_claims"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
            />
            {selectedSandbox && (
              <p className="mt-2 text-[11px] text-slate-500">
                Active sandbox: <span className="font-semibold text-slate-700">{selectedSandbox.sandbox_schema}</span> · Owner: {selectedSandbox.owner} · Target: {selectedSandbox.target_environment}
              </p>
            )}
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Schema Drift Validation & Mitigation</h2>
              <p className="mt-1 text-[13px] text-slate-500">
                New columns are treated as non-blocking additive drift. Missing, deleted, renamed, or structurally changed existing columns require intervention.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
              Additive = Allow · Breaking = Block
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Metadata Version</label>
              <select
                value={validationVersionId}
                onChange={(event) => {
                  setValidationVersionId(event.target.value);
                  setValidationResult(null);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="">Select version</option>
                {versions.map((version) => (
                  <option key={version.metadata_version_id} value={version.metadata_version_id}>
                    {version.version_label} — {version.project_id} — {version.sandbox_schema}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Drift Simulation</label>
              <select
                value={driftMode}
                onChange={(event) => setDriftMode(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="no_drift">No Drift</option>
                <option value="additive">Additive Drift — New columns added</option>
                <option value="breaking">Breaking Drift — Missing/Renamed column</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <Button onClick={validateDrift} disabled={validating} className="flex-1 rounded-xl">
                {validating ? "Validating..." : "Validate Drift"}
              </Button>
              <Button variant="outline" onClick={fetchMetadataWorkspace} className="rounded-xl">
                Refresh
              </Button>
            </div>
          </div>

          {validationResult && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">
                      {validationResult.version_label} · {validationResult.project_id} · {validationResult.sandbox_schema}
                    </p>
                    <p className="mt-1 text-[13px] text-slate-600">{validationResult.validation.summary}</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-medium ${statusBadgeClass(validationResult.validation.overall_status)}`}>
                    {validationResult.validation.overall_status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Decision</p>
                    <p className="mt-1 text-[13px] font-semibold text-slate-900">
                      {validationResult.validation.can_run ? "Pipeline can continue" : "Pipeline requires intervention"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Drift Type</p>
                    <p className="mt-1 text-[13px] font-semibold text-slate-900">{validationResult.validation.drift_type}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Mitigation Process</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-slate-600">
                    {(validationResult.validation.mitigation || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {!validationResult.validation.can_run && (
                  <div className="mt-4">
                    <Button
                      onClick={createSuccessorVersion}
                      disabled={successorCreating}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                      {successorCreating ? "Creating Successor..." : "Create Successor Metadata Version"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Table</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">New Columns</th>
                      <th className="px-4 py-3">Missing/Renamed</th>
                      <th className="px-4 py-3">Type Changes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(validationResult.validation.tables || []).map((table) => (
                      <tr key={table.table_name}>
                        <td className="px-4 py-3 font-medium text-slate-900">{table.table_name}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${statusBadgeClass(table.status)}`}>
                            {table.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{table.new_columns?.join(", ") || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{table.missing_columns?.join(", ") || "—"}</td>
                        <td className="px-4 py-3 text-slate-600">{table.type_changes?.length || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Saved Metadata Versions</h2>
              <p className="text-[13px] text-slate-500">
                Each row represents a project-specific metadata snapshot. New versions never overwrite previous versions.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              {activeVersions} Active
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Sandbox Schema</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Tables</th>
                  <th className="px-4 py-3">Columns</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {versions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                      No metadata versions created yet.
                    </td>
                  </tr>
                ) : (
                  versions.map((version) => (
                    <tr key={version.metadata_version_id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{version.version_label}</td>
                      <td className="px-4 py-3 text-slate-700">{version.project_id}</td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="block max-w-[260px] break-words font-medium">{version.sandbox_schema}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{version.target_environment}</td>
                      <td className="px-4 py-3 text-slate-700">{version.table_count}</td>
                      <td className="px-4 py-3 text-slate-700">{version.column_count}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${version.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {version.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SandboxManagerPage() {
  const [sandboxes, setSandboxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState("person_A");
  const [projectId, setProjectId] = useState("Project_001");
  const [targetEnvironment, setTargetEnvironment] = useState("DEV");
  const [selectedTablesText, setSelectedTablesText] = useState("patient_records, appointments");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchSandboxes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/sandboxes`);

      if (response.data.status === "SUCCESS") {
        setSandboxes(response.data.sandboxes || []);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Unable to load sandboxes from backend.");
    }
  };

  useEffect(() => {
    fetchSandboxes();
  }, []);

  const createSandbox = async () => {
    setMessage("");
    setError("");

    if (!owner.trim()) {
      setError("Please enter an owner.");
      return;
    }

    if (!projectId.trim()) {
      setError("Please enter a project ID.");
      return;
    }

    const selectedTables = selectedTablesText
      .split(",")
      .map((table) => table.trim())
      .filter(Boolean);

    try {
      setCreating(true);

      const response = await axios.post(`${API_BASE_URL}/sandboxes`, {
        owner: owner.trim(),
        project_id: projectId.trim(),
        target_environment: targetEnvironment,
        source_system: "SQL Server PROD",
        source_database: "DDB",
        source_schema: "dbo",
        selected_tables: selectedTables,
      });

      if (response.data.status === "SUCCESS") {
        const sandbox = response.data.sandbox;
        setMessage(`Created sandbox ${sandbox.sandbox_schema} for ${sandbox.owner}.`);
        await fetchSandboxes();
      } else {
        setError(response.data.message || "Failed to create sandbox.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to create sandbox."
      );
    } finally {
      setCreating(false);
    }
  };

  const totalSandboxes = sandboxes.length;
  const totalTables = sandboxes.reduce(
    (count, sandbox) => count + (sandbox.selected_tables?.length || 0),
    0
  );

  const tableUsage = sandboxes.reduce((acc, sandbox) => {
    (sandbox.selected_tables || []).forEach((table) => {
      acc[table] = (acc[table] || 0) + 1;
    });
    return acc;
  }, {});

  const overlappingTables = Object.entries(tableUsage)
    .filter(([, count]) => count > 1)
    .map(([table]) => table);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sandbox Manager"
        description="Create and monitor isolated schema-level sandboxes for users and projects. Overlapping source tables remain isolated by sandbox schema."
        icon={Layers}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={Layers}
          label="Sandboxes"
          value={totalSandboxes}
          helper="User/project schemas"
        />
        <MetricCard
          icon={Database}
          label="Registered Tables"
          value={totalTables}
          helper="Across all sandboxes"
        />
        <MetricCard
          icon={Shield}
          label="Overlapping Tables"
          value={overlappingTables.length}
          helper="Still isolated by schema"
        />
      </div>

      <Card className="rounded-3xl border border-indigo-100 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create Sandbox</h2>
              <p className="text-[13px] text-slate-500">
                Create a separate working schema for each person or project.
              </p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
Required · Schema-Level Isolation
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Owner</label>
              <input
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                placeholder="person_A"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Project ID</label>
              <input
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                placeholder="Project_001"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Target Environment</label>
              <select
                value={targetEnvironment}
                onChange={(event) => setTargetEnvironment(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="DEV">DEV</option>
                <option value="QA">QA</option>
                <option value="REGRESSION">REGRESSION</option>
                <option value="UAT">UAT</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Tables</label>
              <input
                value={selectedTablesText}
                onChange={(event) => setSelectedTablesText(event.target.value)}
                placeholder="patient_records, appointments"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={createSandbox} disabled={creating} className="rounded-xl">
              {creating ? "Creating..." : "Create Sandbox"}
            </Button>
            <Button variant="outline" onClick={fetchSandboxes} className="rounded-xl">
              Refresh
            </Button>
          </div>

          {message && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Existing Sandboxes</h2>
              <p className="text-[13px] text-slate-500">
                Each sandbox has its own schema, owner, project, tables, and isolation boundary.
              </p>
            </div>
            <Button variant="outline" onClick={fetchSandboxes} className="rounded-xl">
              Refresh Sandboxes
            </Button>
          </div>

          {loading && <p className="mt-5 text-[13px] text-slate-500">Loading sandboxes...</p>}

          {!loading && sandboxes.length === 0 && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[13px] text-slate-600">
              No sandboxes found. Create one here or from Create Pipeline → Source.
            </div>
          )}

          {!loading && sandboxes.length > 0 && (
            <div className="mt-6 grid gap-4">
              {sandboxes.map((sandbox) => {
                const overlappingForSandbox = (sandbox.selected_tables || []).filter((table) =>
                  overlappingTables.includes(table)
                );

                return (
                  <div key={sandbox.sandbox_id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 break-all leading-snug">{sandbox.sandbox_schema}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Owner: {sandbox.owner} · Project: {sandbox.project_id} · Target: {sandbox.target_environment}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Source: {sandbox.source_system} → {sandbox.source_database} → {sandbox.source_schema}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                        {sandbox.isolation_status || "ISOLATED"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(sandbox.selected_tables || []).length === 0 ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                          No tables registered
                        </span>
                      ) : (
                        sandbox.selected_tables.map((table) => (
                          <span
                            key={table}
                            className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                              overlappingTables.includes(table)
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {table}
                            {overlappingTables.includes(table) ? " · overlap" : ""}
                          </span>
                        ))
                      )}
                    </div>

                    {overlappingForSandbox.length > 0 && (
                      <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[11px] text-amber-800">
                        Overlap detected for {overlappingForSandbox.join(", ")}. This is allowed because changes are scoped to this sandbox schema.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function EnterpriseBlueprintMetrics() {
  const totalDomains = blueprintWorkspaces.reduce((sum, workspace) => sum + workspace.domains.length, 0);
  const sourceAssets = blueprintWorkspaces.reduce(
    (sum, workspace) => sum + workspace.domains.reduce((inner, domain) => inner + domain.tables.length, 0),
    0
  );
  const activePipelines = blueprintPipelines.length;
  const maskedAssets = maskedAssetSamples.length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard icon={Briefcase} label="Workspaces" value={blueprintWorkspaces.length} helper={`${totalDomains} business domains`} />
      <MetricCard icon={Database} label="Source Assets" value={sourceAssets} helper="Tables across domains" />
      <MetricCard icon={Shield} label="Masked Assets" value={maskedAssets} helper="Sandbox-scoped outputs" />
      <MetricCard icon={Activity} label="Pipelines" value={activePipelines} helper="Editable configurations" />
    </div>
  );
}

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState(blueprintWorkspaces);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState(blueprintWorkspaces[0]?.name || "");
  const [sandboxes, setSandboxes] = useState([]);
  const [loadingSandboxes, setLoadingSandboxes] = useState(false);
  const [workspaceMessage, setWorkspaceMessage] = useState("");
  const [workspaceError, setWorkspaceError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showExistingWorkspaceDetails, setShowExistingWorkspaceDetails] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceCreatedBy, setNewWorkspaceCreatedBy] = useState("Admin User");
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState("");
  const [newWorkspaceOwner, setNewWorkspaceOwner] = useState("");
  const [newWorkspaceEnvironment, setNewWorkspaceEnvironment] = useState("Dev");
  const [openDomainKeys, setOpenDomainKeys] = useState({});
  const [openSandboxIds, setOpenSandboxIds] = useState({});

  const selectedWorkspace =
    workspaces.find((workspace) => workspace.name === selectedWorkspaceName) ||
    workspaces[0];

  const fetchSandboxes = async () => {
    try {
      setLoadingSandboxes(true);
      const response = await axios.get(`${API_BASE_URL}/sandboxes`);

      if (response.data.status === "SUCCESS") {
        setSandboxes(response.data.sandboxes || []);
      }
    } catch (err) {
      console.error(err);
      setWorkspaceError("Unable to load sandbox schemas from backend.");
    } finally {
      setLoadingSandboxes(false);
    }
  };

  useEffect(() => {
    fetchSandboxes();
  }, []);

  const resetCreateWorkspaceForm = () => {
    setNewWorkspaceName("");
    setNewWorkspaceCreatedBy("Admin User");
    setNewWorkspaceDescription("");
    setNewWorkspaceOwner("");
    setNewWorkspaceEnvironment("Dev");
  };

  const createWorkspace = () => {
    setWorkspaceMessage("");
    setWorkspaceError("");

    const workspaceName = newWorkspaceName.trim();

    if (!workspaceName) {
      setWorkspaceError("Please enter a workspace name.");
      return;
    }

    if (workspaces.some((workspace) => workspace.name.toLowerCase() === workspaceName.toLowerCase())) {
      setWorkspaceError("A workspace with this name already exists.");
      return;
    }

    const workspace = {
      name: workspaceName,
      owner: newWorkspaceOwner.trim() || newWorkspaceCreatedBy.trim() || "Admin User",
      createdBy: newWorkspaceCreatedBy.trim() || "Admin User",
      date: new Date().toISOString().slice(0, 10),
      environment: newWorkspaceEnvironment,
      description:
        newWorkspaceDescription.trim() ||
        "Workspace created for source metadata, sandbox schemas, masked outputs, and pipeline execution.",
      status: "Active",
      domains: [],
      pipelines: [],
    };

    setWorkspaces((current) => [workspace, ...current]);
    setSelectedWorkspaceName(workspace.name);
    setShowExistingWorkspaceDetails(true);
    setWorkspaceMessage(`Workspace ${workspace.name} created successfully.`);
    setIsCreateOpen(false);
    resetCreateWorkspaceForm();
  };

  const toggleDomain = (domainName) => {
    const key = `${selectedWorkspace?.name || "workspace"}-${domainName}`;
    setOpenDomainKeys((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const isDomainOpen = (domainName) => {
    const key = `${selectedWorkspace?.name || "workspace"}-${domainName}`;
    return Boolean(openDomainKeys[key]);
  };

  const toggleSandbox = (sandboxId) => {
    setOpenSandboxIds((current) => ({
      ...current,
      [sandboxId]: !current[sandboxId],
    }));
  };

  const expandAllSandboxes = () => {
    const updated = {};
    sandboxes.forEach((sandbox) => {
      updated[sandbox.sandbox_id] = true;
    });
    setOpenSandboxIds(updated);
  };

  const collapseAllSandboxes = () => {
    setOpenSandboxIds({});
  };

  const totalDomains = workspaces.reduce((sum, workspace) => sum + workspace.domains.length, 0);
  const sourceAssets = workspaces.reduce(
    (sum, workspace) => sum + workspace.domains.reduce((inner, domain) => inner + domain.tables.length, 0),
    0
  );
  const maskedAssets = maskedAssetSamples.length;
  const totalSandboxTables = sandboxes.reduce(
    (count, sandbox) => count + (sandbox.selected_tables?.length || 0),
    0
  );

  const tableUsage = sandboxes.reduce((acc, sandbox) => {
    (sandbox.selected_tables || []).forEach((table) => {
      acc[table] = (acc[table] || 0) + 1;
    });
    return acc;
  }, {});

  const overlappingTables = Object.entries(tableUsage)
    .filter(([, count]) => count > 1)
    .map(([table]) => table);

  const environmentOptions = ["Dev", "UAT", "Production", "Sandbox"];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Workspace"
        description="One business container for domains, source assets, sandbox schemas, masked outputs, metadata versions, and pipelines."
        icon={Briefcase}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard icon={Briefcase} label="Workspaces" value={workspaces.length} helper={`${totalDomains} business domains`} />
        <MetricCard icon={Database} label="Source Assets" value={sourceAssets} helper="Tables across domains" />
        <MetricCard icon={Layers} label="Sandbox Schemas" value={sandboxes.length} helper={`${totalSandboxTables} registered tables`} />
        <MetricCard icon={Shield} label="Masked Assets" value={maskedAssets} helper="Sandbox-scoped outputs" />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Workspace Catalog</h2>
              <p className="text-xs text-slate-500">
                Create a new workspace or open an existing workspace to view domains and sandbox schemas.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowExistingWorkspaceDetails((current) => !current)}
                className="rounded-xl px-3 py-2 text-xs"
              >
                {showExistingWorkspaceDetails ? "Hide Existing Workspace" : "Existing Workspace"}
              </Button>
              <Button onClick={() => setIsCreateOpen(true)} className="rounded-xl px-3 py-2 text-xs">
                + Create Workspace
              </Button>
            </div>
          </div>

          {workspaceMessage && (
            <div className="mb-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              {workspaceMessage}
            </div>
          )}

          {workspaceError && (
            <div className="mb-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {workspaceError}
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[920px] text-left text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">Workspace Name</th>
                  <th className="px-3 py-2.5">Created By</th>
                  <th className="px-3 py-2.5">Environment</th>
                  <th className="px-3 py-2.5">Description</th>
                  <th className="px-3 py-2.5">Domains</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workspaces.map((workspace) => (
                  <tr
                    key={workspace.name}
                    onClick={() => {
                      setSelectedWorkspaceName(workspace.name);
                      setShowExistingWorkspaceDetails(true);
                    }}
                    className={`cursor-pointer ${selectedWorkspace?.name === workspace.name ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{workspace.name}</td>
                    <td className="px-3 py-2.5 text-slate-600">{workspace.createdBy || workspace.owner}</td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700">
                        {workspace.environment}
                      </span>
                    </td>
                    <td className="max-w-[360px] px-3 py-2.5 text-slate-600">
                      <span className="line-clamp-2">{workspace.description}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{workspace.domains.length}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${workspace.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {workspace.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {!showExistingWorkspaceDetails && (
        <Card className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Existing workspace details are collapsed</h3>
                <p className="text-xs text-slate-500">
                  Select a workspace row or click Existing Workspace to view domains, source tables, sandbox schemas, overlaps, and linked pipelines.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowExistingWorkspaceDetails(true)}
                className="w-fit rounded-xl px-3 py-2 text-xs"
              >
                Open Existing Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedWorkspace && showExistingWorkspaceDetails && (
        <div className="grid min-w-0 gap-4 2xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">{selectedWorkspace.name}</h2>
                  <p className="text-xs text-slate-500">Domains, source tables, masked assets, and linked pipelines.</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                  {selectedWorkspace.status || "Active"}
                </span>
              </div>

              {selectedWorkspace.domains.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  No domains imported yet. Use Source Connections and Data Assets to onboard metadata into this workspace.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedWorkspace.domains.map((domain) => {
                    const open = isDomainOpen(domain.name);
                    return (
                      <div key={domain.name} className="rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => toggleDomain(domain.name)}
                          className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-slate-50"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{domain.name}</p>
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700">
                                {domain.tables.length} tables
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-slate-500">Masked asset: {domain.asset}</p>
                          </div>
                          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                        </button>

                        {open && (
                          <div className="border-t border-slate-100 px-3.5 py-3">
                            <div>
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Source Tables</p>
                              <div className="flex flex-wrap gap-2">
                                {domain.tables.map((table) => (
                                  <span key={table} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700">
                                    {table}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                              <span className="font-medium text-slate-800">Pipelines:</span> {domain.pipelines.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-4">
              <div className="mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Sandbox Schemas</h2>
                  <p className="max-w-xl text-xs leading-5 text-slate-500">
                    Isolated user/project schemas. Expand only when table details are needed.
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={fetchSandboxes} className="rounded-xl px-3 py-1.5 text-xs">
                    Refresh
                  </Button>
                  {sandboxes.length > 0 && (
                    <>
                      <Button variant="outline" onClick={expandAllSandboxes} className="rounded-xl px-3 py-1.5 text-xs">
                        Expand All
                      </Button>
                      <Button variant="outline" onClick={collapseAllSandboxes} className="rounded-xl px-3 py-1.5 text-xs">
                        Collapse All
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {loadingSandboxes && <p className="text-xs text-slate-500">Loading sandbox schemas...</p>}

              {!loadingSandboxes && sandboxes.length === 0 && (
                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  No sandbox schemas found. Create one from Pipeline Workspace → Sandbox & Source.
                </div>
              )}

              {!loadingSandboxes && sandboxes.length > 0 && (
                <div className="space-y-2.5">
                  {sandboxes.map((sandbox) => {
                    const open = Boolean(openSandboxIds[sandbox.sandbox_id]);
                    const selectedTables = sandbox.selected_tables || [];
                    const overlappingForSandbox = selectedTables.filter((table) =>
                      overlappingTables.includes(table)
                    );

                    return (
                      <div key={sandbox.sandbox_id} className="rounded-xl border border-slate-200 bg-white">
                        <button
                          type="button"
                          onClick={() => toggleSandbox(sandbox.sandbox_id)}
                          className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left hover:bg-slate-50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="max-w-full break-words text-xs font-semibold leading-snug text-slate-900">
                                {sandbox.sandbox_schema}
                              </p>
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">
                                {sandbox.isolation_status || "ISOLATED"}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {sandbox.owner} · {sandbox.project_id} · {sandbox.target_environment}
                            </p>
                          </div>

                          <div className="hidden shrink-0 items-center gap-2 md:flex">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                              {selectedTables.length} tables
                            </span>
                            {overlappingForSandbox.length > 0 && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700">
                                {overlappingForSandbox.length} overlaps
                              </span>
                            )}
                          </div>

                          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
                        </button>

                        {open && (
                          <div className="border-t border-slate-100 px-3.5 py-3">
                            <div className="grid gap-3 text-xs md:grid-cols-3">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Owner</p>
                                <p className="mt-1 font-medium text-slate-800">{sandbox.owner}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Project / Target</p>
                                <p className="mt-1 font-medium text-slate-800">{sandbox.project_id} · {sandbox.target_environment}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Source</p>
                                <p className="mt-1 font-medium text-slate-800">{sandbox.source_system} → {sandbox.source_database} → {sandbox.source_schema}</p>
                              </div>
                            </div>

                            <div className="mt-3">
                              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Registered Tables</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedTables.length === 0 ? (
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600">
                                    No tables registered
                                  </span>
                                ) : (
                                  selectedTables.map((table) => (
                                    <span
                                      key={table}
                                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                                        overlappingTables.includes(table)
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {table}
                                      {overlappingTables.includes(table) ? " · overlap" : ""}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>

                            {overlappingForSandbox.length > 0 && (
                              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                                Overlap detected for {overlappingForSandbox.join(", ")}. This is allowed because changes are scoped to this sandbox schema.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Create Workspace</h2>
                <p className="mt-1 text-[13px] text-slate-500">
                  Create the business container that will hold sandbox schemas, metadata, rules, pipelines, and outputs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
                aria-label="Close create workspace modal"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">Workspace Name</label>
                <input
                  value={newWorkspaceName}
                  onChange={(event) => setNewWorkspaceName(event.target.value)}
                  placeholder="e.g., Finance QA Workspace"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">Created By</label>
                <input
                  value={newWorkspaceCreatedBy}
                  onChange={(event) => setNewWorkspaceCreatedBy(event.target.value)}
                  placeholder="Admin User"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">Description</label>
                <textarea
                  value={newWorkspaceDescription}
                  onChange={(event) => setNewWorkspaceDescription(event.target.value)}
                  placeholder="Purpose, environment, business domain and data scope"
                  className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">Business Owner</label>
                <input
                  value={newWorkspaceOwner}
                  onChange={(event) => setNewWorkspaceOwner(event.target.value)}
                  placeholder="Owner name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-700">Environment</label>
                <select
                  value={newWorkspaceEnvironment}
                  onChange={(event) => setNewWorkspaceEnvironment(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                >
                  {environmentOptions.map((environment) => (
                    <option key={environment} value={environment}>{environment}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button onClick={createWorkspace} className="rounded-xl">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SourceConnectionsPage() {
  const [connections, setConnections] = useState(blueprintConnections);
  const [connectionName, setConnectionName] = useState("SQL_NEW_SOURCE");
  const [connectionType, setConnectionType] = useState("SQL Server");
  const [connectionStatus, setConnectionStatus] = useState("");

  const addConnection = () => {
    const newConnection = {
      name: connectionName || "SQL_NEW_SOURCE",
      type: connectionType,
      sourceType: connectionType === "SFTP" ? "File" : "DB",
      connection: connectionType === "SFTP" ? "sftp://feeds.company.com/inbound" : "server.company.com:1433/DDB",
      status: "Draft",
      purpose: "New connection created from UI simulation",
    };

    setConnections((current) => [newConnection, ...current]);
    setConnectionStatus(`Connection ${newConnection.name} added as Draft.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Source Connections"
        description="Enterprise-style connection catalog for source and target systems used by TDM pipelines."
        icon={Plug}
      />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Create Connection</h2>
              <p className="text-[13px] text-slate-500">Simulates connection onboarding before metadata import.</p>
            </div>
            <span className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium text-purple-700">Connection Manager</span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Connection Name</label>
              <input
                value={connectionName}
                onChange={(event) => setConnectionName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Database / Source Type</label>
              <select
                value={connectionType}
                onChange={(event) => setConnectionType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              >
                <option>SQL Server</option>
                <option>Databricks</option>
                <option>Oracle</option>
                <option>SFTP</option>
                <option>Salesforce</option>
              </select>
            </div>
            <Button onClick={addConnection} className="rounded-xl">Add Connection</Button>
          </div>

          {connectionStatus && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {connectionStatus}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-slate-900">Connection Catalog</h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[900px] text-left text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Connection</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Source Type</th>
                  <th className="px-4 py-3">Connection String</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {connections.map((connection) => (
                  <tr key={connection.name}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{connection.name}</td>
                    <td className="px-4 py-3 text-slate-600">{connection.type}</td>
                    <td className="px-4 py-3 text-slate-600">{connection.sourceType}</td>
                    <td className="px-4 py-3 text-slate-600">{connection.connection}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${connection.status === "Connected" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {connection.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="outline" className="rounded-xl" onClick={() => setConnectionStatus(`Connection test successful for ${connection.name}.`)}>
                        Test
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExistingPipelinesPage() {
  const [pipelines, setPipelines] = useState(blueprintPipelines);
  const [selectedPipelineName, setSelectedPipelineName] = useState(blueprintPipelines[0].name);
  const [message, setMessage] = useState("");

  const selectedPipeline = pipelines.find((pipeline) => pipeline.name === selectedPipelineName) || pipelines[0];
  const availableTables = [
    "patient_records",
    "appointments",
    "insurance_claims",
    "customer_profile",
    "customer_contact",
    "doctor_reference",
  ];

  const toggleTable = (tableName) => {
    setPipelines((current) =>
      current.map((pipeline) => {
        if (pipeline.name !== selectedPipeline.name) return pipeline;

        const alreadySelected = pipeline.tables.includes(tableName);
        return {
          ...pipeline,
          tables: alreadySelected
            ? pipeline.tables.filter((table) => table !== tableName)
            : [...pipeline.tables, tableName],
        };
      })
    );
  };

  const updatePipelineField = (field, value) => {
    setPipelines((current) =>
      current.map((pipeline) =>
        pipeline.name === selectedPipeline.name ? { ...pipeline, [field]: value } : pipeline
      )
    );
  };

  const savePipeline = () => {
    setMessage(`Saved ${selectedPipeline.name}. ${selectedPipeline.tables.length} table(s) are now selected.`);
  };

  const duplicatePipeline = () => {
    const copyName = `${selectedPipeline.name}_Copy`;
    const copiedPipeline = {
      ...selectedPipeline,
      name: copyName,
      status: "Draft",
      lastRun: "Not executed yet",
    };
    setPipelines((current) => [copiedPipeline, ...current]);
    setSelectedPipelineName(copyName);
    setMessage(`Duplicated pipeline as ${copyName}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Existing Pipelines"
        description="Open saved pipelines, update source/target mappings, select or unselect tables, and preserve reusable configurations."
        icon={History}
      />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Pipeline Catalog</h2>
              <p className="text-[13px] text-slate-500">Click a pipeline to edit its configuration.</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">Editable</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[960px] text-left text-[13px]">
              <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Pipeline</th>
                  <th className="px-4 py-3">Workspace</th>
                  <th className="px-4 py-3">Sandbox</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Tables</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pipelines.map((pipeline) => (
                  <tr
                    key={pipeline.name}
                    onClick={() => setSelectedPipelineName(pipeline.name)}
                    className={`cursor-pointer ${selectedPipeline.name === pipeline.name ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">{pipeline.name}</td>
                    <td className="px-4 py-3 text-slate-600">{pipeline.workspace}</td>
                    <td className="px-4 py-3 text-slate-600">{pipeline.sandbox}</td>
                    <td className="px-4 py-3 text-slate-600">{pipeline.source}</td>
                    <td className="px-4 py-3 text-slate-600">{pipeline.target}</td>
                    <td className="px-4 py-3 text-slate-600">{pipeline.tables.length}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">{pipeline.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Edit Pipeline: {selectedPipeline.name}</h2>
              <p className="text-[13px] text-slate-500">Change mappings and table selection without touching other sandbox configurations.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-xl" onClick={duplicatePipeline}>Duplicate</Button>
              <Button className="rounded-xl" onClick={savePipeline}>Save Changes</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Workspace</label>
              <select
                value={selectedPipeline.workspace}
                onChange={(event) => updatePipelineField("workspace", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              >
                {blueprintWorkspaces.map((workspace) => <option key={workspace.name}>{workspace.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Source</label>
              <select
                value={selectedPipeline.source}
                onChange={(event) => updatePipelineField("source", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              >
                {blueprintConnections.map((connection) => <option key={connection.name}>{connection.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Target</label>
              <select
                value={selectedPipeline.target}
                onChange={(event) => updatePipelineField("target", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              >
                {blueprintConnections.map((connection) => <option key={connection.name}>{connection.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Status</label>
              <select
                value={selectedPipeline.status}
                onChange={(event) => updatePipelineField("status", event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none"
              >
                <option>Draft</option>
                <option>Ready</option>
                <option>In Review</option>
                <option>Active</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[13px] font-semibold text-slate-900">Select / Unselect Tables</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {availableTables.map((tableName) => (
                <label key={tableName} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-[13px] text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedPipeline.tables.includes(tableName)}
                    onChange={() => toggleTable(tableName)}
                  />
                  <span>{tableName}</span>
                </label>
              ))}
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MaskedAssetsPage({ currentJobId }) {
  const [selectedAsset, setSelectedAsset] = useState(maskedAssetSamples[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Masked Data Assets"
        description="Browse masked outputs by workspace, sandbox schema, table group, and readiness status."
        icon={TableProperties}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Shield} label="Masked Assets" value={maskedAssetSamples.length} helper="Cataloged outputs" />
        <MetricCard icon={Layers} label="Sandbox Scoped" value="100%" helper="Isolated by schema" />
        <MetricCard icon={CheckCircle2} label="Ready Assets" value={maskedAssetSamples.filter((asset) => asset.status === "Ready").length} helper="Available to testers" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-slate-900">Masked Asset Catalog</h2>
            <div className="mt-5 space-y-3">
              {maskedAssetSamples.map((asset) => (
                <button
                  key={asset.asset}
                  type="button"
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${selectedAsset.asset === asset.asset ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{asset.asset}</p>
                      <p className="mt-1 break-all text-[11px] text-slate-500">{asset.sandbox}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">{asset.status}</span>
                  </div>
                  <p className="mt-2 text-[13px] text-slate-600">{asset.tables.length} tables · {asset.rows} rows</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{selectedAsset.asset}</h2>
                <p className="text-[13px] text-slate-500">Preview masked data asset details and table coverage.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">Masked Ready</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium text-slate-500">Workspace</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedAsset.workspace}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium text-slate-500">Sandbox Schema</p>
                <p className="mt-1 break-all font-semibold text-slate-900">{selectedAsset.sandbox}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium text-slate-500">Rows</p>
                <p className="mt-1 font-semibold text-slate-900">{selectedAsset.rows}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium text-slate-500">Isolation</p>
                <p className="mt-1 font-semibold text-slate-900">ISOLATED</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[13px] font-semibold text-slate-900">Tables</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedAsset.tables.map((table) => (
                  <span key={table} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">{table}</span>
                ))}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[640px] text-left text-[13px]">
                <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                  <tr><th className="px-4 py-3">patient_id</th><th className="px-4 py-3">first_name</th><th className="px-4 py-3">ssn</th><th className="px-4 py-3">email</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[1, 2, 3, 4].map((index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">a4e76f{index}</td>
                      <td className="px-4 py-3">FakeName{index}</td>
                      <td className="px-4 py-3">10*****0{index}</td>
                      <td className="px-4 py-3">masked{index}@example.com</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentJobId && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-semibold text-slate-900">Latest Executed Job Review</h2>
            <div className="mt-5">
              <ReviewStep jobId={currentJobId} selectedDatasets={[]} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PlaceholderPage({ title, description, icon: Icon, items = [] }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} icon={Icon} />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-slate-900">Blueprint Page</h2>
          <p className="mt-2 text-[13px] text-slate-500">
            This page is part of the realistic enterprise blueprint. The UI shell is ready;
            detailed backend logic can be connected next.
          </p>

          {items.length > 0 && (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function WorkflowProgress({ activeStep }) {
  const stages = [
    { label: "Extraction", range: [1] },
    { label: "Anonymization", range: [2, 3] },
    { label: "Publish", range: [4] },
  ];

  const getStageStatus = (stage) => {
    const maxStep = Math.max(...stage.range);
    const minStep = Math.min(...stage.range);

    if (activeStep > maxStep) return "completed";
    if (activeStep >= minStep && activeStep <= maxStep) return "active";
    return "pending";
  };

  const progressPercent =
    activeStep === 1 ? "20%" : activeStep === 2 ? "45%" : activeStep === 3 ? "70%" : "100%";

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => {
              const status = getStageStatus(stage);

              return (
                <div key={stage.label} className="flex flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                      status === "completed"
                        ? "bg-emerald-600 text-white"
                        : status === "active"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {status === "completed" ? "✓" : index + 1}
                  </div>
                  <p className={`mt-2 text-[11px] font-medium ${status === "active" ? "text-slate-900" : "text-slate-500"}`}>
                    {stage.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-slate-900 transition-all duration-500"
              style={{ width: progressPercent }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stepper({ activeStep }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {workflowSteps.map((step) => {
        const Icon = step.icon;
        const isActive = activeStep === step.id;
        const isDone = activeStep > step.id;

        return (
          <div
            key={step.id}
            className={`rounded-2xl border p-4 transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white"
                : isDone
                ? "border-emerald-200 bg-emerald-50 text-slate-900"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5" />
              {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            </div>
            <p className="mt-3 text-[13px] font-medium">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}

function SourceStep({ onNext, onDatasetUploaded, onMultipleDatasetsGenerated }) {
  const [uploading, setUploading] = useState(false);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedDatasetIdLocal, setSelectedDatasetIdLocal] = useState("");
  const [sandboxes, setSandboxes] = useState([]);
  const [selectedSandboxId, setSelectedSandboxId] = useState("");
  const [sandboxOwner, setSandboxOwner] = useState("");
  const [sandboxProjectId, setSandboxProjectId] = useState("");
  const [sandboxTargetEnvironment, setSandboxTargetEnvironment] = useState("DEV");
  const [sandboxMessage, setSandboxMessage] = useState("");
  const [sandboxError, setSandboxError] = useState("");
  const [sandboxCreating, setSandboxCreating] = useState(false);
  const [sourceDatabases, setSourceDatabases] = useState([]);
  const [selectedSourceDatabase, setSelectedSourceDatabase] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [selectedSourceTables, setSelectedSourceTables] = useState([]);
  const [sourceColumnsByTable, setSourceColumnsByTable] = useState({});
  const [selectedColumnsByTable, setSelectedColumnsByTable] = useState({});
  const [sourceRowCount, setSourceRowCount] = useState(100);
  const [rowCountByTable, setRowCountByTable] = useState({});
  const [sourceGenerating, setSourceGenerating] = useState(false);
  const [deletingDatasetId, setDeletingDatasetId] = useState("");

  const createSandbox = async () => {
  setSandboxMessage("");
  setSandboxError("");

  if (!sandboxOwner.trim()) {
    setSandboxError("Please enter sandbox owner.");
    return;
  }

  if (!sandboxProjectId.trim()) {
    setSandboxError("Please enter project ID.");
    return;
  }

  try {
    setSandboxCreating(true);

    const response = await axios.post(`${API_BASE_URL}/sandboxes`, {
      owner: sandboxOwner.trim(),
      project_id: sandboxProjectId.trim(),
      target_environment: sandboxTargetEnvironment,
      source_system: "SQL Server PROD",
      source_database: "DDB",
      source_schema: "dbo",
      selected_tables: selectedSourceTables,
    });

    if (response.data.status === "SUCCESS") {
      const sandbox = response.data.sandbox;

      setSandboxMessage(
        `Sandbox created: ${sandbox.sandbox_schema}. Isolation status: ${sandbox.isolation_status}`
      );

      setSelectedSandboxId(sandbox.sandbox_id);
      await fetchSandboxes();
      await fetchDatasets();
    } else {
      setSandboxError(response.data.message || "Failed to create sandbox.");
    }
  } catch (error) {
  console.error("Sandbox create error:", error);

  setSandboxError(
    error.response?.data?.message ||
      error.response?.data?.detail ||
      error.message ||
      "Failed to create sandbox."
  );
} finally {
    setSandboxCreating(false);
  }
};

  const fetchSandboxes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sandboxes`);

    if (response.data.status === "SUCCESS") {
      setSandboxes(response.data.sandboxes || []);
    }
  } catch (error) {
    console.error("Failed to fetch sandboxes", error);
  }
};

  const fetchDatasets = async () => {
    try {
      setLoadingDatasets(true);
      const response = await axios.get("http://127.0.0.1:8000/datasets");
      setAvailableDatasets(response.data.datasets || []);
      setLoadingDatasets(false);
    } catch (err) {
      console.error(err);
      setLoadingDatasets(false);
      setUploadError("Unable to load available datasets from backend.");
    }
  };

  const fetchSourceTables = async (database) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/source-metadata/databricks/tables",
        { params: { database } }
      );

      setSourceTables(response.data.tables || []);
      setSelectedSourceTables([]);
      setSourceColumnsByTable({});
      setSelectedColumnsByTable({});
    } catch (err) {
      console.error(err);
      setUploadError("Unable to load tables for selected database.");
    }
  };

  const fetchSourceDatabases = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/source-metadata/databricks/databases"
      );

      const databases = response.data.databases || [];
      setSourceDatabases(databases);

      if (databases.length > 0 && !selectedSourceDatabase) {
        setSelectedSourceDatabase(databases[0]);
        fetchSourceTables(databases[0]);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Unable to load Databricks databases from backend.");
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchSourceDatabases();
    fetchSandboxes();
  }, []);

  const getSelectedSandbox = () =>
    sandboxes.find((sandbox) => sandbox.sandbox_id === selectedSandboxId);

  const getSelectedSandboxMetadata = () => {
    const selectedSandbox = getSelectedSandbox();

    if (!selectedSandbox) {
      return {};
    }

    return {
      sandbox_id: selectedSandbox.sandbox_id,
      sandbox_schema: selectedSandbox.sandbox_schema,
      sandbox_owner: selectedSandbox.owner,
      project_id: selectedSandbox.project_id,
      target_environment: selectedSandbox.target_environment,
      isolation_status: selectedSandbox.isolation_status || "ISOLATED",
    };
  };

  const handleSandboxChange = async (sandboxId) => {
    setSelectedSandboxId(sandboxId);
    setUploadMessage(null);
    setUploadError(null);

    if (!sandboxId) {
      setSelectedDatasetIdLocal("");
      setSelectedFileName(null);
      return;
    }

    const selectedSandbox = sandboxes.find(
      (sandbox) => sandbox.sandbox_id === sandboxId
    );

    if (selectedSandbox?.selected_tables?.length) {
      setSelectedSourceTables(selectedSandbox.selected_tables);

      selectedSandbox.selected_tables.forEach((tableName) => {
        setRowCountByTable((current) => ({
          ...current,
          [tableName]: current[tableName] || sourceRowCount,
        }));

        if (selectedSourceDatabase && !sourceColumnsByTable[tableName]) {
          fetchColumnsForTable(selectedSourceDatabase, tableName);
        }
      });
    }

    await fetchDatasets();
  };

  const handleDatasetReady = (responseData, displayName) => {
    setSelectedFileName(displayName);
    setSelectedDatasetIdLocal(responseData.dataset_id);

    onDatasetUploaded({
      ...responseData,
      ...getSelectedSandboxMetadata(),
      datasetId: responseData.dataset_id,
      filename: displayName,
      columns: Array.isArray(responseData.columns) ? responseData.columns : sampleColumns,
    });

    fetchDatasets();
  };

  const handleSelectExistingDataset = (datasetId) => {
    setSelectedDatasetIdLocal(datasetId);

    const selectedDataset = availableDatasets.find(
      (dataset) => dataset.dataset_id === datasetId
    );

    if (!selectedDataset) {
      setUploadError("Selected dataset was not found.");
      return;
    }

    setSelectedFileName(selectedDataset.filename);
    setUploadMessage(`Selected existing dataset: ${selectedDataset.filename}`);
    setUploadError(null);

    if (selectedDataset.sandbox_id) {
      setSelectedSandboxId(selectedDataset.sandbox_id);
    }

    const sandboxMetadata = selectedDataset.sandbox_id
      ? {}
      : getSelectedSandboxMetadata();

    onDatasetUploaded({
      ...selectedDataset,
      ...sandboxMetadata,
      datasetId: selectedDataset.dataset_id,
      filename: selectedDataset.filename,
      columns: Array.isArray(selectedDataset.columns)
        ? selectedDataset.columns
        : sampleColumns,
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setUploadError("Please upload a CSV file.");
      setUploadMessage(null);
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadMessage(null);
      setSelectedFileName(file.name);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://127.0.0.1:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "SUCCESS") {
        setUploadMessage(`Uploaded successfully: ${file.name}`);
        handleDatasetReady(response.data, file.name);
      } else {
        setUploadError(response.data.message || "Upload failed.");
      }

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setUploadError("Unable to upload file. Make sure FastAPI is running.");
    }
  };

  const fetchColumnsForTable = async (database, tableName) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/source-metadata/databricks/columns",
        {
          params: {
            database,
            table: tableName,
          },
        }
      );

      const columns = response.data.columns || [];

      setSourceColumnsByTable((current) => ({
        ...current,
        [tableName]: columns,
      }));

      setSelectedColumnsByTable((current) => ({
        ...current,
        [tableName]: columns.map((column) => column.name),
      }));
    } catch (err) {
      console.error(err);
      setUploadError(`Unable to load columns for table ${tableName}.`);
    }
  };

  const toggleSourceTable = async (tableName) => {
  const alreadySelected = selectedSourceTables.includes(tableName);

  if (alreadySelected) {
    setSelectedSourceTables((current) =>
      current.filter((table) => table !== tableName)
    );

    setSelectedColumnsByTable((current) => {
      const updated = { ...current };
      delete updated[tableName];
      return updated;
    });

    setRowCountByTable((current) => {
      const updated = { ...current };
      delete updated[tableName];
      return updated;
    });

    return;
  }

  setSelectedSourceTables((current) => [...current, tableName]);

  setRowCountByTable((current) => ({
    ...current,
    [tableName]: current[tableName] || sourceRowCount,
  }));

  if (!sourceColumnsByTable[tableName]) {
    await fetchColumnsForTable(selectedSourceDatabase, tableName);
  }
};

  const toggleSourceColumn = (tableName, columnName) => {
    setSelectedColumnsByTable((current) => {
      const currentColumns = current[tableName] || [];
      const alreadySelected = currentColumns.includes(columnName);

      return {
        ...current,
        [tableName]: alreadySelected
          ? currentColumns.filter((column) => column !== columnName)
          : [...currentColumns, columnName],
      };
    });
  };

  const generateFromExistingSource = async () => {
    try {
      setSourceGenerating(true);
      setUploadError(null);
      setUploadMessage(null);

      if (!selectedSandboxId) {
        setSourceGenerating(false);
        setUploadError("Please create or select a sandbox before generating source-based test data.");
        return;
      }

      const selectedTablesPayload = selectedSourceTables.map((tableName) => ({
        table_name: tableName,
        selected_columns: selectedColumnsByTable[tableName] || [],
        row_count: Number(rowCountByTable[tableName] || sourceRowCount || 100),
      }));

      const hasEmptyColumnSelection = selectedTablesPayload.some(
        (table) => table.selected_columns.length === 0
      );

      if (hasEmptyColumnSelection) {
        setSourceGenerating(false);
        setUploadError("Please select at least one column for every selected table.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/generate-test-data-from-source",
        {
        source: "databricks",
        database: selectedSourceDatabase,
        sandbox_id: selectedSandboxId || null,
        tables: selectedTablesPayload,
      }
      );

      if (response.data.status === "SUCCESS") {
        const generatedDatasets = response.data.datasets || [];

        setUploadMessage(response.data.message);

        if (generatedDatasets.length > 0) {
          onMultipleDatasetsGenerated(generatedDatasets);

          const firstDataset = generatedDatasets[0];
          setSelectedFileName(
            generatedDatasets.length === 1
              ? firstDataset.filename
              : `${generatedDatasets.length} source tables generated`
          );
          setSelectedDatasetIdLocal(firstDataset.dataset_id);
        }

        fetchDatasets();
      } else {
        setUploadError(response.data.message || "Source-based generation failed.");
      }

      setSourceGenerating(false);
    } catch (err) {
      console.error(err);
      setSourceGenerating(false);
      setUploadError("Unable to generate test data from source metadata.");
    }
  };

  const selectedDataset = availableDatasets.find(
    (dataset) => dataset.dataset_id === selectedDatasetIdLocal
  );

  const selectedSandboxDatasets = selectedSandboxId
    ? availableDatasets.filter(
        (dataset) => dataset.sandbox_id === selectedSandboxId
      )
    : [];

  const continueWithExistingSandboxData = () => {
    if (!selectedSandboxId) {
      setUploadError("Please select a sandbox first.");
      return;
    }

    if (selectedSandboxDatasets.length === 0) {
      setUploadError("No generated datasets found for this sandbox. Please generate data once for the selected tables.");
      return;
    }

    const firstDataset = selectedSandboxDatasets[0];

    setSelectedDatasetIdLocal(firstDataset.dataset_id);
    setSelectedFileName(
      selectedSandboxDatasets.length === 1
        ? firstDataset.filename
        : `${selectedSandboxDatasets.length} existing sandbox tables selected`
    );
    setUploadMessage(
      `Loaded ${selectedSandboxDatasets.length} existing generated table(s) from this sandbox. You can continue to masking rules without regenerating data.`
    );
    setUploadError(null);

    onMultipleDatasetsGenerated(selectedSandboxDatasets);
  };

  const deleteSandboxDataset = async (dataset) => {
    if (!selectedSandboxId || !dataset?.dataset_id) {
      setUploadError("Please select a sandbox and dataset before deleting.");
      return;
    }

    const tableLabel = dataset.table_name || dataset.filename || "this table";

    const confirmed = window.confirm(
      `Delete generated data for ${tableLabel} from this sandbox? This removes it only from the selected sandbox.`
    );

    if (!confirmed) return;

    try {
      setDeletingDatasetId(dataset.dataset_id);
      setUploadMessage(null);
      setUploadError(null);

      const response = await axios.delete(
        `${API_BASE_URL}/sandboxes/${selectedSandboxId}/datasets/${dataset.dataset_id}`
      );

      if (response.data.status === "SUCCESS") {
        setUploadMessage(response.data.message || `Deleted ${tableLabel} from this sandbox.`);

        if (selectedDatasetIdLocal === dataset.dataset_id) {
          setSelectedDatasetIdLocal("");
          setSelectedFileName(null);
        }

        await fetchDatasets();
        await fetchSandboxes();
      } else {
        setUploadError(response.data.message || "Unable to delete generated table data.");
      }
    } catch (err) {
      console.error("Delete sandbox dataset error:", err);
      setUploadError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to delete generated table data."
      );
    } finally {
      setDeletingDatasetId("");
    }
  };

  const canContinue = Boolean(selectedDatasetIdLocal) && Boolean(selectedSandboxId);

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.6fr_0.9fr]">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3">
                  <Database className="h-6 w-6 text-slate-700" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Source Dataset
                  </h2>
                  <p className="text-[13px] text-slate-500">
                    Select a sandbox first, then generate or select source data inside that isolated workspace.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
Step 1 · Sandbox & Source
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[13px] font-medium text-slate-700">
                  Source Connection
                </label>
                <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none">
                  <option>Databricks Unity Catalog</option>
                  <option>Local Uploaded CSV / Generated Test Data</option>
                  <option>PostgreSQL</option>
                  <option>Oracle</option>
                  <option>Azure SQL</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-[13px] font-medium text-slate-700">
                    Existing Datasets
                  </label>

                  <button
                    onClick={fetchDatasets}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900"
                  >
                    Refresh
                  </button>
                </div>

                <select
                  value={selectedDatasetIdLocal}
                  onChange={(event) => handleSelectExistingDataset(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
                >
                  <option value="">
                    {loadingDatasets
                      ? "Loading datasets..."
                      : selectedSandboxId
                        ? "Select existing data from this sandbox"
                        : "Select sandbox first to filter generated data"}
                  </option>

                  {(selectedSandboxId ? selectedSandboxDatasets : availableDatasets).map((dataset) => (
                    <option key={dataset.dataset_id} value={dataset.dataset_id}>
                      {dataset.filename}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-[13px] font-medium text-slate-900">Current Selection</p>

              {selectedFileName ? (
                <div className="mt-3 grid gap-3 text-[12px] text-slate-600 sm:grid-cols-1 xl:grid-cols-3">
                  <div className="min-w-0 rounded-xl bg-white/70 p-3 ring-1 ring-slate-100">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Dataset</p>
                    <p
                      className="mt-1 min-w-0 break-words text-[12px] font-semibold leading-5 text-slate-900"
                      title={selectedFileName}
                    >
                      {selectedFileName}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl bg-white/70 p-3 ring-1 ring-slate-100">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Source</p>
                    <p
                      className="mt-1 min-w-0 break-words text-[12px] font-semibold leading-5 text-slate-900"
                      title={selectedDataset?.source_type || "current selection"}
                    >
                      {selectedDataset?.source_type || "current selection"}
                    </p>
                  </div>

                  <div className="min-w-0 rounded-xl bg-white/70 p-3 ring-1 ring-slate-100">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">Columns</p>
                    <p className="mt-1 text-[12px] font-semibold leading-5 text-slate-900">
                      {selectedDataset?.columns?.length || "Multiple tables"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-slate-500">
                  No dataset selected yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3">
                <Upload className="h-6 w-6 text-slate-700" />
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900">Quick CSV Upload</h3>
                <p className="text-[13px] text-slate-500">
                  Small fallback option for one-off CSV testing.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-[13px] text-slate-500">
                Upload a CSV and let the backend detect schema.
              </p>

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-900 transition hover:bg-slate-50">
                {uploading ? "Uploading..." : "Choose CSV File"}
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="rounded-3xl border border-indigo-100 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Sandbox Manager
              </h2>
              <p className="text-[13px] text-slate-500">
                Required first step: every pipeline runs inside an isolated user/project schema.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-700">
Required · Schema-Level Isolation
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Existing Sandbox
              </label>
              <select
                value={selectedSandboxId}
                onChange={(event) => handleSandboxChange(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="">Select sandbox</option>
                {sandboxes.map((sandbox) => (
                  <option key={sandbox.sandbox_id} value={sandbox.sandbox_id}>
                    {sandbox.sandbox_schema} — {sandbox.owner}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Owner
              </label>
              <input
                value={sandboxOwner}
                onChange={(event) => setSandboxOwner(event.target.value)}
                placeholder="person_A"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Project ID
              </label>
              <input
                value={sandboxProjectId}
                onChange={(event) => setSandboxProjectId(event.target.value)}
                placeholder="Project_001"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">
                Target Environment
              </label>
              <select
                value={sandboxTargetEnvironment}
                onChange={(event) => setSandboxTargetEnvironment(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none"
              >
                <option value="DEV">DEV</option>
                <option value="QA">QA</option>
                <option value="REGRESSION">REGRESSION</option>
                <option value="UAT">UAT</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={createSandbox}
              disabled={sandboxCreating}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {sandboxCreating ? "Creating..." : "Create Sandbox"}
            </button>

            <button
              type="button"
              onClick={fetchSandboxes}
              className="rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh Sandboxes
            </button>

            {selectedSandboxId ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                Sandbox selected
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
Required: create or select sandbox
              </span>
            )}
          </div>

          {sandboxMessage && (
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
              {sandboxMessage}
            </div>
          )}

          {sandboxError && (
            <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
              {sandboxError}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSandboxId && (
        <Card className="rounded-2xl border border-emerald-100 bg-emerald-50 shadow-sm">
          <CardContent className="p-4">
            {(() => {
              const selectedSandbox = sandboxes.find(
                (sandbox) => sandbox.sandbox_id === selectedSandboxId
              );

              if (!selectedSandbox) return null;

              return (
                <div className="grid gap-4 text-[13px] md:grid-cols-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-emerald-700">Sandbox Schema</p>
                    <p className="font-semibold text-slate-900 break-all leading-snug">
                      {selectedSandbox.sandbox_schema}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-emerald-700">Owner</p>
                    <p className="font-semibold text-slate-900 break-words leading-snug">
                      {selectedSandbox.owner}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-emerald-700">Project</p>
                    <p className="font-semibold text-slate-900 break-words leading-snug">
                      {selectedSandbox.project_id}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-emerald-700">Isolation</p>
                    <p className="font-semibold text-slate-900 break-words leading-snug">
                      {selectedSandbox.isolation_status}
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}


      {selectedSandboxId && (
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-slate-900">
                  Existing Generated Data in Selected Sandbox
                </h3>
                <p className="text-[13px] text-slate-500">
                  Reuse data that was already generated for this sandbox, or delete table data that is no longer needed.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={fetchDatasets}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
                >
                  Refresh Data
                </button>

                <button
                  type="button"
                  onClick={continueWithExistingSandboxData}
                  disabled={selectedSandboxDatasets.length === 0}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue with Existing Data
                </button>
              </div>
            </div>

            {uploadMessage && (
              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">
                {uploadError}
              </div>
            )}

            {selectedSandboxDatasets.length === 0 ? (
              <div className="mt-4 rounded-xl bg-amber-50 p-4 text-[13px] text-amber-800">
                No generated datasets are available for this sandbox yet. Select tables below and click Generate from Source once.
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full min-w-[1100px] text-left text-[13px]">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Table</th>
                      <th className="px-4 py-3 font-medium">Generated File</th>
                      <th className="px-4 py-3 font-medium">Rows</th>
                      <th className="px-4 py-3 font-medium">Columns</th>
                      <th className="px-4 py-3 font-medium">Sandbox Schema</th>
                      <th className="px-4 py-3 font-medium">Isolation</th>
                      <th className="px-4 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {selectedSandboxDatasets.map((dataset) => (
                      <tr key={dataset.dataset_id} className="bg-white">
                        <td className="px-4 py-3 font-medium text-slate-900 break-words">
                          {dataset.table_name || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 break-all">
                          {dataset.filename}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {dataset.row_count || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {dataset.columns?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-slate-700 break-all">
                          {dataset.sandbox_schema || "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            {dataset.isolation_status || "ISOLATED"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteSandboxDataset(dataset)}
                            disabled={deletingDatasetId === dataset.dataset_id}
                            className="rounded-xl border border-rose-200 px-3 py-1.5 text-[11px] font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingDatasetId === dataset.dataset_id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedSandboxId && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
          <p className="font-semibold">Sandbox required before source generation</p>
          <p className="mt-1">Create or select an isolated sandbox schema so this pipeline does not affect another user's work.</p>
        </div>
      )}

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Generate Test Data from Existing Source Tables
              </h3>
              <p className="text-[13px] text-slate-500">
                Choose backend source tables, select only required columns, and generate schema-driven test data inside the selected sandbox.
              </p>
            </div>

            <Button
              onClick={generateFromExistingSource}
              disabled={
                sourceGenerating ||
                !selectedSandboxId ||
                !selectedSourceDatabase ||
                selectedSourceTables.length === 0
              }
              className="rounded-xl"
            >
              {sourceGenerating ? "Generating..." : "Generate from Source"}
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-[13px] font-medium text-slate-700">
                Source Connection
              </label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none">
                <option>Databricks</option>
              </select>
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700">
                Database / Catalog.Schema
              </label>
              <select
                value={selectedSourceDatabase}
                onChange={(event) => {
                  setSelectedSourceDatabase(event.target.value);
                  fetchSourceTables(event.target.value);
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
              >
                <option value="">Select database</option>

                {sourceDatabases.map((database) => (
                  <option key={database} value={database}>
                    {database}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700">
                Default Row Count
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={sourceRowCount}
                onChange={(event) => setSourceRowCount(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-[13px] font-semibold text-slate-900">
                Available Tables
              </p>

              <div className="mt-4 space-y-2">
                {sourceTables.length === 0 && (
                  <p className="text-[13px] text-slate-500">
                    Select a database to load tables.
                  </p>
                )}

                {sourceTables.map((tableName) => (
                  <label
                    key={tableName}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-[13px] text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSourceTables.includes(tableName)}
                      onChange={() => toggleSourceTable(tableName)}
                    />
                    {tableName}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-[13px] font-semibold text-slate-900">
                Column Selection
              </p>

              <div className="mt-4 space-y-5">
                {selectedSourceTables.length === 0 && (
                  <p className="text-[13px] text-slate-500">
                    Select one or more tables to choose columns.
                  </p>
                )}

                {selectedSourceTables.map((tableName) => {
                  const columns = sourceColumnsByTable[tableName] || [];
                  const selectedColumns = selectedColumnsByTable[tableName] || [];

                  return (
                    <div key={tableName} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="font-medium text-slate-900">{tableName}</p>
                            <p className="text-[11px] text-slate-500">
                              {selectedColumns.length} of {columns.length} columns selected
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-medium text-slate-600">
                              Rows
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10000"
                              value={rowCountByTable[tableName] || sourceRowCount}
                              onChange={(event) =>
                                setRowCountByTable((current) => ({
                                  ...current,
                                  [tableName]: event.target.value,
                                }))
                              }
                              className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] outline-none"
                            />
                          </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedColumnsByTable((current) => ({
                                ...current,
                                [tableName]: columns.map((column) => column.name),
                              }))
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700"
                          >
                            Select All
                          </button>

                          <button
                            onClick={() =>
                              setSelectedColumnsByTable((current) => ({
                                ...current,
                                [tableName]: [],
                              }))
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 md:grid-cols-3">
                        {columns.map((column) => (
                          <label
                            key={`${tableName}-${column.name}`}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedColumns.includes(column.name)}
                              onChange={() => toggleSourceColumn(tableName, column.name)}
                            />
                            <span>
                              {column.name}
                              <span className="ml-1 text-slate-400">
                                ({column.type})
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {(selectedFileName || uploadMessage || uploadError) && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-5">
            {selectedFileName && (
              <p className="text-[13px] text-slate-600">
                Selected dataset:{" "}
                <span className="font-medium text-slate-900">
                  {selectedFileName}
                </span>
              </p>
            )}

            {uploadMessage && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[13px] text-emerald-700">
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
                {uploadError}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col items-end gap-2">
        {!canContinue && (
          <p className="text-[11px] text-slate-500">
            Select a sandbox and generate/select a dataset to continue.
          </p>
        )}
        <Button onClick={onNext} disabled={!canContinue} className="rounded-xl">
          Continue to Rule Configuration
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}


function RulesStep({ currentUser, onNext, onRulesChange, detectedColumns }) {
  const isDeveloper = currentUser?.role === "developer";

  const [adminLockedRules, setAdminLockedRules] = useState({});

useEffect(() => {
  const fetchAdminLockedRules = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/admin-locked-rules");

      const rulesMap = {};

      (response.data.rules || []).forEach((rule) => {
        if (rule.enabled) {
          rulesMap[rule.column.toLowerCase()] = {
            rule: rule.rule,
            lockedBy: rule.locked_by,
            reason: rule.reason,
            developerCanOverride: rule.developer_can_override,
          };
        }
      });

      setAdminLockedRules(rulesMap);
    } catch (err) {
      console.error(err);
    }
  };

  fetchAdminLockedRules();
}, []);

  const safeDetectedColumns =
    Array.isArray(detectedColumns) && detectedColumns.length > 0
      ? detectedColumns
      : sampleColumns;

  const normalizeColumns = (columns) =>
    columns.map((col) => {
      const lockedRule = adminLockedRules[col.name?.toLowerCase()];

      if (isDeveloper && lockedRule && !lockedRule.developerCanOverride) {
        return {
          ...col,
          ai_suggested_rule: col.ai_suggested_rule || lockedRule.rule,
          rule: lockedRule.rule,
          override_allowed: false,
          admin_locked: true,
          locked_reason: lockedRule.reason,
          locked_by: lockedRule.lockedBy,
        };
      }

      return {
        ...col,
        ai_suggested_rule: col.ai_suggested_rule || col.rule || "No Masking",
        rule: col.rule || col.ai_suggested_rule || "No Masking",
        override_allowed: col.override_allowed !== false,
        admin_locked: false,
      };
    });

  const [columns, setColumns] = useState(normalizeColumns(safeDetectedColumns));

 useEffect(() => {
  const safeColumns =
    Array.isArray(detectedColumns) && detectedColumns.length > 0
      ? detectedColumns
      : sampleColumns;

  setColumns(normalizeColumns(safeColumns));
}, [detectedColumns, currentUser, adminLockedRules]);

  useEffect(() => {
    const selectedRules = {};

    columns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  }, [columns, onRulesChange]);

  const updateRule = (name, rule) => {
    const updatedColumns = columns.map((col) => {
      if (col.name !== name) return col;

      if (isDeveloper && col.admin_locked) {
        return col;
      }

      return { ...col, rule };
    });

    setColumns(updatedColumns);

    const selectedRules = {};
    updatedColumns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  };

  const resetToAiSuggestions = () => {
    const resetColumns = columns.map((col) => {
      if (isDeveloper && col.admin_locked) {
        return col;
      }

      return {
        ...col,
        rule: col.ai_suggested_rule || "No Masking",
      };
    });

    setColumns(resetColumns);

    const selectedRules = {};
    resetColumns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  };

  const piiCount = columns.filter((col) => col.pii).length;
  const overriddenCount = columns.filter(
    (col) => col.rule !== col.ai_suggested_rule
  ).length;
  const adminLockedCount = columns.filter((col) => col.admin_locked).length;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              AI-Assisted Masking Rule Assignment
            </h2>
            <p className="text-[13px] text-slate-500">
              AI suggests masking rules first. Admin-locked rules cannot be overridden by developers.
            </p>
          </div>

          <Button variant="outline" className="rounded-xl" onClick={resetToAiSuggestions}>
            Reset to AI Suggestions
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <MetricCard
            icon={Tags}
            label="Detected Columns"
            value={columns.length}
            helper="From selected dataset"
          />

          <MetricCard
            icon={AlertTriangle}
            label="PII Columns"
            value={piiCount}
            helper="AI-classified sensitive fields"
          />

          <MetricCard
            icon={SlidersHorizontal}
            label="User Overrides"
            value={overriddenCount}
            helper="Changed from AI suggestion"
          />

          <MetricCard
            icon={Lock}
            label="Admin Locked"
            value={adminLockedCount}
            helper="Developer cannot override"
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[1150px] text-left text-[13px]">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Column</th>
                <th className="px-4 py-3 font-medium">Detected Type</th>
                <th className="px-4 py-3 font-medium">AI Classification</th>
                <th className="px-4 py-3 font-medium">AI Suggested Rule</th>
                <th className="px-4 py-3 font-medium">Final Rule / Override</th>
                <th className="px-4 py-3 font-medium">Override Status</th>
                <th className="px-4 py-3 font-medium">Lock Reason</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {columns.map((col) => {
                const isOverridden = col.rule !== col.ai_suggested_rule;

                return (
                  <tr key={col.name} className="bg-white">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {col.name}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {col.type || "unknown"}
                    </td>

                    <td className="px-4 py-3">
                      {col.pii ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
                          <AlertTriangle className="mr-1 h-3 w-3" /> PII
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                          Non-PII
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                        {col.ai_suggested_rule || "No Masking"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={col.rule || "No Masking"}
                        disabled={isDeveloper && col.admin_locked}
                        onChange={(e) => updateRule(col.name, e.target.value)}
                        className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none ${
                          isDeveloper && col.admin_locked
                            ? "cursor-not-allowed bg-slate-100 text-slate-500"
                            : "bg-white"
                        }`}
                      >
                        <option>No Masking</option>
                        <option>Fake Value</option>
                        <option>Partial Masking</option>
                        <option>Date Shift</option>
                        <option>Hash</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      {col.admin_locked ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
                          <Lock className="mr-1 h-3 w-3" />
                          Admin Locked
                        </span>
                      ) : isOverridden ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                          User Overridden
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                          AI Accepted
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-500">
                      {col.admin_locked
                        ? `${col.locked_by}: ${col.locked_reason}`
                        : "Override allowed"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-600">
          <p className="font-medium text-slate-900">Role-Based Override Logic</p>
          <p className="mt-1">
            Admin users can override all masking rules. Developer users cannot override admin-locked sensitive rules such as SSN partial masking. Backend also enforces locked rules during execution.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onNext} className="rounded-xl">
            Continue to Job Run
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SandboxSummaryCard({ selectedDatasets = [], sticky = false }) {
  const sandboxDataset = selectedDatasets.find((dataset) => dataset.sandbox_id);

  if (!sandboxDataset) {
    return null;
  }

  return (
    <Card
      className={`rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm ${
        sticky ? "sticky top-4 z-20" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[13px] font-semibold text-slate-900">
              Active Sandbox
            </h3>
            <p className="text-[11px] text-slate-600">
              This pipeline is running inside an isolated sandbox schema.
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700">
            {sandboxDataset.isolation_status || "ISOLATED"}
          </span>
        </div>

        <div className="grid gap-4 text-[13px] md:grid-cols-4">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-indigo-700">Sandbox Schema</p>
            <p className="font-semibold text-slate-900 break-all leading-snug">
              {sandboxDataset.sandbox_schema || "Not Available"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-indigo-700">Owner</p>
            <p className="font-semibold text-slate-900 break-words leading-snug">
              {sandboxDataset.sandbox_owner || "Not Available"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-indigo-700">Project</p>
            <p className="font-semibold text-slate-900 break-words leading-snug">
              {sandboxDataset.project_id || "Not Available"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-indigo-700">Target</p>
            <p className="font-semibold text-slate-900 break-words leading-snug">
              {sandboxDataset.target_environment || "Not Available"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MultiTableRulesStep({ currentUser, selectedDatasets, onRulesChange, onNext }) {
  const isDeveloper = currentUser?.role === "developer";
  const [adminLockedRules, setAdminLockedRules] = useState({});
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchAdminLockedRules = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin-locked-rules");

        const rulesMap = {};

        (response.data.rules || []).forEach((rule) => {
          if (rule.enabled) {
            rulesMap[rule.column.toLowerCase()] = {
              rule: rule.rule,
              lockedBy: rule.locked_by,
              reason: rule.reason,
              developerCanOverride: rule.developer_can_override,
            };
          }
        });

        setAdminLockedRules(rulesMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAdminLockedRules();
  }, []);

  const normalizeColumns = (columns) =>
    columns.map((col) => {
      const lockedRule = adminLockedRules[col.name?.toLowerCase()];

      if (isDeveloper && lockedRule && !lockedRule.developerCanOverride) {
        return {
          ...col,
          ai_suggested_rule: col.ai_suggested_rule || lockedRule.rule,
          rule: lockedRule.rule,
          override_allowed: false,
          admin_locked: true,
          locked_reason: lockedRule.reason,
          locked_by: lockedRule.lockedBy,
        };
      }

      return {
        ...col,
        ai_suggested_rule: col.ai_suggested_rule || col.rule || "No Masking",
        rule: col.rule || col.ai_suggested_rule || "No Masking",
        override_allowed: col.override_allowed !== false,
        admin_locked: false,
      };
    });

  useEffect(() => {
    const safeDatasets =
      Array.isArray(selectedDatasets) && selectedDatasets.length > 0
        ? selectedDatasets
        : [
            {
              dataset_id: "sample",
              filename: "Sample Dataset",
              source_type: "sample",
              columns: sampleColumns,
            },
          ];

    const normalizedTables = safeDatasets.map((dataset) => ({
      ...dataset,
      columns: normalizeColumns(dataset.columns || sampleColumns),
    }));

    setTables(normalizedTables);
  }, [selectedDatasets, currentUser, adminLockedRules]);

  useEffect(() => {
    const rulesByDataset = {};

    tables.forEach((table) => {
      const rules = {};

      (table.columns || []).forEach((col) => {
        rules[col.name] = col.rule || "No Masking";
      });

      rulesByDataset[table.dataset_id] = rules;
    });

    onRulesChange(rulesByDataset);
  }, [tables, onRulesChange]);

  const updateRule = (datasetId, columnName, rule) => {
    const updatedTables = tables.map((table) => {
      if (table.dataset_id !== datasetId) return table;

      return {
        ...table,
        columns: table.columns.map((col) => {
          if (col.name !== columnName) return col;

          if (isDeveloper && col.admin_locked) {
            return col;
          }

          return {
            ...col,
            rule,
          };
        }),
      };
    });

    setTables(updatedTables);
  };

  const totalColumns = tables.reduce(
    (count, table) => count + (table.columns?.length || 0),
    0
  );

  const piiColumns = tables.reduce(
    (count, table) =>
      count + (table.columns || []).filter((col) => col.pii).length,
    0
  );

  const adminLockedCount = tables.reduce(
    (count, table) =>
      count + (table.columns || []).filter((col) => col.admin_locked).length,
    0
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Multi-Table Masking Rule Assignment
            </h2>
            <p className="text-[13px] text-slate-500">
              Review masking rules for every selected or generated source table before execution.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <MetricCard
            icon={TableProperties}
            label="Tables"
            value={tables.length}
            helper="Selected/generated source tables"
          />

          <MetricCard
            icon={Tags}
            label="Total Columns"
            value={totalColumns}
            helper="Across all tables"
          />

          <MetricCard
            icon={AlertTriangle}
            label="PII Columns"
            value={piiColumns}
            helper="AI-classified sensitive fields"
          />

          <MetricCard
            icon={Lock}
            label="Admin Locked"
            value={adminLockedCount}
            helper="Developer cannot override"
          />
        </div>

        <div className="mt-6 space-y-6">
          {tables.map((table) => (
            <div
              key={table.dataset_id}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className="flex flex-col gap-2 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {table.table_name || table.filename}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Dataset: {table.filename} · {table.columns?.length || 0} columns
                  </p>
                </div>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                  {table.source_type || "dataset"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-[13px]">
                  <thead className="bg-white text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Column</th>
                      <th className="px-4 py-3 font-medium">Detected Type</th>
                      <th className="px-4 py-3 font-medium">Classification</th>
                      <th className="px-4 py-3 font-medium">AI Suggested Rule</th>
                      <th className="px-4 py-3 font-medium">Final Rule</th>
                      <th className="px-4 py-3 font-medium">Override Status</th>
                      <th className="px-4 py-3 font-medium">Lock Reason</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(table.columns || []).map((col) => {
                      const isOverridden = col.rule !== col.ai_suggested_rule;

                      return (
                        <tr key={`${table.dataset_id}-${col.name}`} className="bg-white">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {col.name}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {col.type || "unknown"}
                          </td>

                          <td className="px-4 py-3">
                            {col.pii ? (
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
                                <AlertTriangle className="mr-1 h-3 w-3" /> PII
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
                                Non-PII
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-flex whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                              {col.ai_suggested_rule || "No Masking"}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <select
                              value={col.rule || "No Masking"}
                              disabled={isDeveloper && col.admin_locked}
                              onChange={(e) =>
                                updateRule(table.dataset_id, col.name, e.target.value)
                              }
                              className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-[13px] outline-none ${
                                isDeveloper && col.admin_locked
                                  ? "cursor-not-allowed bg-slate-100 text-slate-500"
                                  : "bg-white"
                              }`}
                            >
                              <option>No Masking</option>
                              <option>Fake Value</option>
                              <option>Partial Masking</option>
                              <option>Date Shift</option>
                              <option>Hash</option>
                            </select>
                          </td>

                          <td className="px-4 py-3">
                            {col.admin_locked ? (
                              <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
                                <Lock className="mr-1 h-3 w-3" />
                                Admin Locked
                              </span>
                            ) : isOverridden ? (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700">
                                User Overridden
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                                AI Accepted
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-[11px] text-slate-500">
                            {col.admin_locked
                              ? `${col.locked_by}: ${col.locked_reason}`
                              : "Override allowed"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onNext} className="rounded-xl">
            Continue to Job Run
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PreRunValidationAgentCard({ validation, loading, error, onValidate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChecks, setExpandedChecks] = useState({});

  const status = validation?.overall_status || "PENDING";

  const statusStyles = {
    READY: "border-emerald-200 bg-emerald-50 text-emerald-800",
    WARNING: "border-amber-200 bg-amber-50 text-amber-800",
    BLOCKED: "border-red-200 bg-red-50 text-red-800",
    PENDING: "border-slate-200 bg-slate-50 text-slate-700",
  };

  const checkStyles = {
    PASSED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    WARNING: "bg-amber-50 text-amber-700 border-amber-100",
    BLOCKED: "bg-red-50 text-red-700 border-red-100",
  };

  const checks = validation?.checks || [];
  const blockedChecks = checks.filter((check) => check.status === "BLOCKED").length;
  const warningChecks = checks.filter((check) => check.status === "WARNING").length;

  const toggleCheck = (checkName) => {
    setExpandedChecks((current) => ({
      ...current,
      [checkName]: !current[checkName],
    }));
  };

  return (
    <Card className="rounded-2xl border border-indigo-100 shadow-sm">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="flex flex-1 gap-3 text-left"
          >
            <div className="h-fit rounded-2xl bg-indigo-50 p-3">
              <Shield className="h-5 w-5 text-indigo-700" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Pre-Run Validation Agent
                </h2>

                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
              </div>

              <p className="mt-1 text-[13px] text-slate-500">
                Collapsed by default. Expand only when you want to inspect validation checks.
              </p>

              {validation?.summary && (
                <p className="mt-2 line-clamp-2 text-[13px] font-medium text-slate-700">
                  {validation.summary}
                </p>
              )}

              {error && (
                <p className="mt-2 text-[13px] font-medium text-red-700">
                  {error}
                </p>
              )}
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                statusStyles[status] || statusStyles.PENDING
              }`}
            >
              {loading ? "VALIDATING" : status}
            </span>

            {validation && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                {blockedChecks} blocked · {warningChecks} warning
              </span>
            )}

            <Button
              variant="outline"
              className="rounded-xl"
              disabled={loading}
              onClick={onValidate}
            >
              {loading ? "Validating..." : "Re-Validate"}
            </Button>

            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsExpanded((current) => !current)}
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
                {error}
              </div>
            )}

            {!error && !validation && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] text-slate-600">
                Waiting to run pre-execution checks.
              </div>
            )}

            {validation && (
              <>
                <div
                  className={`rounded-xl border p-4 text-[13px] ${
                    statusStyles[status] || statusStyles.PENDING
                  }`}
                >
                  {validation.summary}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-500">Datasets</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {validation.metrics?.datasets_selected ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-500">Tables</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {validation.metrics?.tables_selected ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-500">PII Masked</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {(validation.metrics?.pii_columns_masked ?? 0)}/{validation.metrics?.pii_columns_detected ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-500">Admin Rules</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {validation.metrics?.admin_locked_rule_matches ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] font-medium text-slate-500">Overlaps</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">
                      {validation.metrics?.overlap_sandboxes ?? 0}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {checks.map((check) => {
                    const expanded = !!expandedChecks[check.name];

                    return (
                      <div
                        key={check.name}
                        className="rounded-xl border border-slate-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => toggleCheck(check.name)}
                          className="flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {expanded ? (
                              <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                            )}
                            <p className="font-semibold text-slate-900">
                              {check.name}
                            </p>
                          </div>

                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-[11px] font-semibold ${
                              checkStyles[check.status] || "bg-slate-50 text-slate-700 border-slate-100"
                            }`}
                          >
                            {check.status}
                          </span>
                        </button>

                        {expanded && (
                          <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                            <p className="text-[13px] text-slate-600">{check.message}</p>

                            {Array.isArray(check.details) && check.details.length > 0 && (
                              <div className="mt-3 max-h-36 overflow-auto rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600">
                                <pre className="whitespace-pre-wrap break-words">
                                  {JSON.stringify(check.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RunStep({ currentUser, onNext, onJobCreated, maskingRules, datasetId, selectedDatasets }) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const selectedDatasetList =
    Array.isArray(selectedDatasets) && selectedDatasets.length > 0
      ? selectedDatasets
      : datasetId
      ? [{ dataset_id: datasetId, filename: "Selected Dataset" }]
      : [];

  const isMultiTableRun = selectedDatasetList.length > 1;
  const sandboxContext = selectedDatasetList.find((dataset) => dataset.sandbox_id) || {};
  const totalRequestedRows = selectedDatasetList.reduce(
    (total, dataset) => total + Number(dataset.row_count || 0),
    0
  );
  const configuredRuleCount = selectedDatasetList.reduce((total, dataset) => {
    const datasetRules = maskingRules?.[dataset.dataset_id] || {};
    return (
      total +
      Object.values(datasetRules).filter((rule) => rule && rule !== "No Masking").length
    );
  }, 0);

  const validationDependency = `${selectedDatasetList
    .map((dataset) => dataset.dataset_id)
    .join("|")}::${JSON.stringify(maskingRules || {})}`;

  const buildValidationPayload = () => ({
    datasets: selectedDatasetList.map((dataset) => ({
      dataset_id: dataset.dataset_id,
      masking_rules: maskingRules?.[dataset.dataset_id] || {},
    })),
    user_role: currentUser?.role || "developer",
  });

  const validatePreRun = async () => {
    if (selectedDatasetList.length === 0) {
      setValidationResult(null);
      setValidationError("Please select at least one dataset before validation.");
      return null;
    }

    try {
      setValidationLoading(true);
      setValidationError(null);

      const response = await axios.post(
        `${API_BASE_URL}/agents/pre-run-validation`,
        buildValidationPayload()
      );

      const validation = response.data.validation;
      setValidationResult(validation);
      return validation;
    } catch (err) {
      console.error("Pre-run validation error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        "Unable to run pre-run validation agent.";

      setValidationError(message);
      return null;
    } finally {
      setValidationLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDatasetList.length > 0) {
      validatePreRun();
    }
  }, [validationDependency]);

  const startRun = async () => {
    try {
      setRunning(true);
      setComplete(false);
      setError(null);
      setJobId(null);
      setJobDetails(null);

      if (selectedDatasetList.length === 0) {
        setRunning(false);
        setError("Please upload, generate, or select a dataset before running anonymization.");
        return;
      }

      const missingSandboxContext = selectedDatasetList.some((dataset) => !dataset.sandbox_id);

      if (missingSandboxContext) {
        setRunning(false);
        setError("Sandbox context is missing. Please go back to Sandbox & Source and create/select a sandbox before running.");
        return;
      }

      const validation = await validatePreRun();

      if (!validation) {
        setRunning(false);
        setError("Pre-run validation could not be completed. Please validate again before running.");
        return;
      }

      if (!validation.can_run) {
        setRunning(false);
        setError(validation.summary || "Pre-run validation blocked execution.");
        return;
      }

      let runResponse;

      if (isMultiTableRun) {
        const datasetsPayload = selectedDatasetList.map((dataset) => ({
          dataset_id: dataset.dataset_id,
          masking_rules: maskingRules?.[dataset.dataset_id] || {},
        }));

        runResponse = await axios.post("http://127.0.0.1:8000/jobs/run-multiple", {
          datasets: datasetsPayload,
          user_role: currentUser?.role || "developer",
        });
      } else {
        const primaryDatasetId = selectedDatasetList[0].dataset_id;
        const rulesForSelectedDataset =
          primaryDatasetId && maskingRules?.[primaryDatasetId]
            ? maskingRules[primaryDatasetId]
            : maskingRules;

        runResponse = await axios.post("http://127.0.0.1:8000/jobs/run", {
          dataset_id: primaryDatasetId,
          masking_rules: rulesForSelectedDataset,
          user_role: currentUser?.role || "developer",
        });
      }

      if (runResponse.data.status === "FAILED") {
        setRunning(false);
        setError(runResponse.data.message || "Job failed.");
        return;
      }

      const newJobId = runResponse.data.job_id;
      setJobId(newJobId);
      onJobCreated(newJobId);

      const statusResponse = await axios.get(`http://127.0.0.1:8000/jobs/${newJobId}/status`);

      setJobDetails(statusResponse.data);
      setRunning(false);
      setComplete(true);
    } catch (err) {
      console.error(err);
      setRunning(false);
      setError("Unable to connect to backend. Make sure FastAPI is running on port 8000.");
    }
  };

  return (
    <div className="space-y-6">
      <PreRunValidationAgentCard
        validation={validationResult}
        loading={validationLoading}
        error={validationError}
        onValidate={validatePreRun}
      />

      <div className="grid gap-5 lg:grid-cols-3">
      <Card className="rounded-2xl shadow-sm lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-slate-900">Run Anonymization Job</h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Submit one dataset or multiple generated source tables to the FastAPI execution layer.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[13px] font-semibold text-slate-900">
                  Execution Scope
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {isMultiTableRun
                    ? `${selectedDatasetList.length} source tables will be anonymized in one multi-table job.`
                    : "One dataset will be anonymized."}
                </p>
              </div>

              <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                {isMultiTableRun ? "Multi-table run" : "Single-table run"}
              </span>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {selectedDatasetList.map((dataset) => (
                <div
                  key={dataset.dataset_id}
                  className="rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-700"
                >
                  <p className="font-medium text-slate-900">
                    {dataset.table_name || dataset.filename || dataset.dataset_id}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500 break-all">
                    {dataset.dataset_id}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  {complete ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : running ? (
                    <Clock className="h-6 w-6 text-slate-700" />
                  ) : (
                    <Play className="h-6 w-6 text-slate-700" />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {complete ? "Job Completed" : running ? "Job Running" : "Ready to Run"}
                  </p>
                  <p className="text-[13px] text-slate-500">
                    {complete
                      ? "Backend completed anonymization for the selected table scope."
                      : running
                      ? "Submitting request to FastAPI backend."
                      : "Review configuration and start anonymization."}
                  </p>
                </div>
              </div>

              <Button
                onClick={startRun}
                disabled={
                  running ||
                  validationLoading ||
                  selectedDatasetList.some((dataset) => !dataset.sandbox_id) ||
                  validationResult?.can_run === false
                }
                className="rounded-xl"
              >
                {running ? "Running..." : "Start Job"}
              </Button>
            </div>

            {running && (
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-slate-900"
                  initial={{ width: "5%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1.6 }}
                />
              </div>
            )}

            {jobId && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-800">
                <p className="font-medium">Job submitted successfully</p>
                <p className="mt-1 break-all">Job ID: {jobId}</p>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              icon={TableProperties}
              label="Tables Processed"
              value={jobDetails ? jobDetails.tables_processed : "Pending"}
              helper={isMultiTableRun ? "Multi-table execution" : "Single dataset"}
            />

            <MetricCard
              icon={Database}
              label="Rows Processed"
              value={jobDetails ? jobDetails.rows_processed.toLocaleString() : "Pending"}
              helper={jobDetails?.dataset_name || "Selected dataset(s)"}
            />

            <MetricCard
              icon={Lock}
              label="Columns Masked"
              value={jobDetails ? jobDetails.columns_masked : "Pending"}
              helper="PII fields protected"
            />

            <MetricCard
              icon={Activity}
              label="Execution Mode"
              value={jobDetails ? "Databricks" : "Ready"}
              helper={jobDetails ? jobDetails.execution_mode : "Waiting to submit"}
            />

            <MetricCard
              icon={Clock}
              label="Job Started At"
              value={
                jobDetails?.job_started_at
                  ? new Date(jobDetails.job_started_at).toLocaleTimeString()
                  : "Pending"
              }
              helper={
                jobDetails?.job_started_at
                  ? new Date(jobDetails.job_started_at).toLocaleDateString()
                  : "Waiting to start"
              }
            />

            <MetricCard
              icon={CheckCircle2}
              label="Duration"
              value={
                jobDetails?.duration_seconds !== undefined
                  ? `${jobDetails.duration_seconds}s`
                  : "Pending"
              }
              helper="Total execution time"
            />
          </div>

          {complete && (
            <div className="mt-6 flex justify-end">
              <Button onClick={onNext} className="rounded-xl">
                Review Output
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900">Pre-Run Summary</h3>
          <p className="mt-1 text-[13px] text-slate-500">
            Final checkpoint before submitting the isolated sandbox execution.
          </p>

          <div className="mt-5 space-y-3 text-[13px]">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Sandbox</p>
              <p className="mt-1 font-semibold text-slate-900">
                {sandboxContext.sandbox_schema || "No sandbox metadata"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Tables</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedDatasetList.length}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Rows Requested</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {totalRequestedRows > 0 ? totalRequestedRows.toLocaleString() : "Runtime"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Masked Columns</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {configuredRuleCount}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Target</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {sandboxContext.target_environment || "Not Available"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              Changes are scoped by sandbox_id and sandbox_schema, so overlapping tables in other sandboxes are not affected.
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}


function PreviewTable({ title, rows, warning = false }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-[13px] text-slate-500">No preview rows available.</p>
        </CardContent>
      </Card>
    );
  }

  const headers = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>

          {warning ? (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
              <AlertTriangle className="mr-1 h-3 w-3" /> Contains PII
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Masked
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-[11px]">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="px-3 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="px-3 py-3 text-slate-700">
                      {row[header] === undefined || row[header] === null
                        ? "—"
                        : String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewStep({ jobId, selectedDatasets = [] }) {
  const [previewData, setPreviewData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!jobId) {
        setError("No job ID found. Please run an anonymization job first.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const previewResponse = await axios.get(`http://127.0.0.1:8000/jobs/${jobId}/preview`);
        const auditResponse = await axios.get(`http://127.0.0.1:8000/jobs/${jobId}/audit`);

        setPreviewData(previewResponse.data);
        setAuditData(auditResponse.data.audit);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        setError("Unable to fetch review data from backend.");
      }
    };

    fetchReviewData();
  }, [jobId]);

  if (loading) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <p className="text-[13px] text-slate-600">Loading preview and audit data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!previewData || !auditData) return null;

const groupRowsByTable = (rows) => {
  const grouped = {};

  (rows || []).forEach((row) => {
    const tableName = row._table || "Output Preview";

    if (!grouped[tableName]) {
      grouped[tableName] = [];
    }

    grouped[tableName].push(row);
  });

  return grouped;
};

const beforeGroups = groupRowsByTable(previewData.before);
const afterGroups = groupRowsByTable(previewData.after);
const tableNames = Array.from(
  new Set([...Object.keys(beforeGroups), ...Object.keys(afterGroups)])
);

  const auditRows = [
    { metric: "Total rows processed", value: auditData.total_rows_processed.toLocaleString() },
    { metric: "Tables processed", value: auditData.tables_processed },
    { metric: "PII columns masked", value: auditData.pii_columns_masked },
    { metric: "Rules applied", value: auditData.rules_applied.join(", ") },
    { metric: "Output target", value: auditData.output_target },
    { metric: "Run status", value: auditData.run_status },
    { metric: "Execution mode", value: auditData.execution_mode },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13px] text-emerald-800">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Review data loaded from FastAPI backend</p>
            <p className="mt-1 break-all">Job ID: {jobId}</p>
          </div>

          <a
            href={`http://127.0.0.1:8000/download/masked-output/${jobId}`}
            download
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-slate-800"
          >
            Download Masked CSV
          </a>
        </div>
      </div>

      <div className="space-y-6">
        {tableNames.map((tableName) => (
          <div key={tableName} className="space-y-4">
            <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
              <p className="text-[13px] font-semibold">Table: {tableName}</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <PreviewTable
                title="Before Anonymization"
                rows={beforeGroups[tableName] || []}
                warning
              />

              <PreviewTable
                title="After Anonymization"
                rows={afterGroups[tableName] || []}
              />
            </div>
          </div>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3">
              <FileText className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Audit Summary</h2>
              <p className="text-[13px] text-slate-500">Generated by backend after anonymization run.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-[13px]">
              <tbody className="divide-y divide-slate-100">
                {auditRows.map((row) => (
                  <tr key={row.metric}>
                    <td className="bg-slate-50 px-4 py-3 font-medium text-slate-700">{row.metric}</td>
                    <td className="px-4 py-3 text-slate-900">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreatePipelinePage({
  currentUser,
  activeStep,
  setActiveStep,
  currentJobId,
  setCurrentJobId,
  maskingRules,
  setMaskingRules,
  selectedDatasetId,
  setSelectedDatasetId,
  selectedDatasets,
  setSelectedDatasets,
  detectedColumns,
  setDetectedColumns,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline Workspace"
        description="Create an isolated sandbox workspace, select source tables, configure masking rules, run anonymization, and review masked outputs."
        icon={Play}
      />

      <WorkflowProgress activeStep={activeStep} />
      <Stepper activeStep={activeStep} />
      <SandboxSummaryCard selectedDatasets={selectedDatasets} sticky />

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-900">Pipeline Navigation</p>
          <p className="text-[11px] text-slate-500">
            Move between extraction, anonymization, execution, and validation.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl"
            disabled={activeStep === 1}
            onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
          >
            Back
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setActiveStep(1);
              setCurrentJobId(null);
              setSelectedDatasetId(null);
              setSelectedDatasets([]);
              setDetectedColumns(sampleColumns);
              setMaskingRules({});
            }}
          >
            Reset Pipeline
          </Button>
        </div>
      </div>

      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeStep === 1 && (
          <SourceStep
            onDatasetUploaded={(datasetInfo) => {
              const { datasetId, columns, filename, ...datasetMetadata } = datasetInfo;
              const safeColumns = Array.isArray(columns) ? columns : sampleColumns;

              setSelectedDatasetId(datasetId);
              setSelectedDatasets([
                {
                  ...datasetMetadata,
                  dataset_id: datasetId,
                  filename: filename || datasetMetadata.filename || "Selected Dataset",
                  source_type: datasetMetadata.source_type || "selected_dataset",
                  columns: safeColumns,
                },
              ]);
              setDetectedColumns(safeColumns);

              const selectedRules = {};
              safeColumns.forEach((col) => {
                selectedRules[col.name] = col.rule || "No Masking";
              });

              setMaskingRules({
                [datasetId]: selectedRules,
              });
            }}
            onMultipleDatasetsGenerated={(datasets) => {
              const safeDatasets = Array.isArray(datasets) ? datasets : [];

              setSelectedDatasets(safeDatasets);

              if (safeDatasets.length > 0) {
                setSelectedDatasetId(safeDatasets[0].dataset_id);
                setDetectedColumns(safeDatasets[0].columns || sampleColumns);
              }

              const rulesByDataset = {};

              safeDatasets.forEach((dataset) => {
                const rules = {};

                (dataset.columns || []).forEach((col) => {
                  rules[col.name] = col.rule || "No Masking";
                });

                rulesByDataset[dataset.dataset_id] = rules;
              });

              setMaskingRules(rulesByDataset);
            }}
            onNext={() => setActiveStep(2)}
          />
        )}

        {activeStep === 2 && (
          <MultiTableRulesStep
            currentUser={currentUser}
            selectedDatasets={selectedDatasets}
            onRulesChange={(rules) => setMaskingRules(rules)}
            onNext={() => setActiveStep(3)}
          />
        )}

        {activeStep === 3 && (
          <RunStep
            currentUser={currentUser}
            datasetId={selectedDatasetId}
            selectedDatasets={selectedDatasets}
            maskingRules={maskingRules}
            onJobCreated={(jobId) => setCurrentJobId(jobId)}
            onNext={() => setActiveStep(4)}
          />
        )}

        {activeStep === 4 && <ReviewStep jobId={currentJobId} selectedDatasets={selectedDatasets} />}
      </motion.div>
    </div>
  );
}



function JobHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://127.0.0.1:8000/jobs/history");
      setJobs(response.data.jobs || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Unable to load job history from backend.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Recent Job History</h2>
            <p className="text-[13px] text-slate-500">Tracks anonymization runs submitted during this backend session.</p>
          </div>

          <Button variant="outline" className="rounded-xl" onClick={fetchHistory}>
            Refresh History
          </Button>
        </div>

        {loading && <p className="mt-5 text-[13px] text-slate-500">Loading job history...</p>}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">{error}</div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-[13px] text-slate-600">
            No jobs yet. Run an anonymization job to populate history.
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1000px] text-left text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Job ID</th>
                  <th className="px-4 py-3 font-medium">Dataset</th>
                  <th className="px-4 py-3 font-medium">Source Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created At</th>
                  <th className="px-4 py-3 font-medium">Rows</th>
                  <th className="px-4 py-3 font-medium">Columns Masked</th>
                  <th className="px-4 py-3 font-medium">Execution Mode</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.job_id} className="bg-white">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{job.job_id}</td>
                    <td className="px-4 py-3 text-slate-700">{job.dataset_name || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700">{job.source_type || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{new Date(job.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-900">{job.rows_processed?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-900">{job.columns_masked}</td>
                    <td className="px-4 py-3 text-slate-600">{job.execution_mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DataClassificationPage() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState("");
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDatasets = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://127.0.0.1:8000/datasets");
      const datasetList = response.data.datasets || [];

      setDatasets(datasetList);

      if (datasetList.length > 0 && !selectedDatasetId) {
        setSelectedDatasetId(datasetList[0].dataset_id);
        setSelectedDataset(datasetList[0]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDatasetChange = (datasetId) => {
    setSelectedDatasetId(datasetId);

    const dataset = datasets.find((item) => item.dataset_id === datasetId);
    setSelectedDataset(dataset || null);
  };

  const getClassification = (column) => {
    const name = column.name.toLowerCase();

    if (name.includes("ssn") || name.includes("social_security")) {
      return "Highly Sensitive Identifier";
    }

    if (
      name.includes("name") ||
      name.includes("email") ||
      name.includes("phone") ||
      name.includes("address")
    ) {
      return "Personal Identifiable Information";
    }

    if (
      name.includes("dob") ||
      name.includes("birth") ||
      name.includes("date_of_birth")
    ) {
      return "Sensitive Personal Attribute";
    }

    if (name.endsWith("_id") || name === "id") {
      return "Business Identifier";
    }

    if (
      name.includes("balance") ||
      name.includes("salary") ||
      name.includes("amount")
    ) {
      return "Financial Attribute";
    }

    return "Non-Sensitive Attribute";
  };

  const getTag = (column) => {
    const classification = getClassification(column);

    if (classification === "Highly Sensitive Identifier") {
      return "CONFIDENTIAL";
    }

    if (classification === "Personal Identifiable Information") {
      return "PII";
    }

    if (classification === "Sensitive Personal Attribute") {
      return "SENSITIVE";
    }

    if (classification === "Financial Attribute") {
      return "FINANCIAL";
    }

    if (classification === "Business Identifier") {
      return "IDENTIFIER";
    }

    return "PUBLIC";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Classification"
        description="Review AI-assisted classification, masking rule suggestions, override eligibility, and assigned data tags."
        icon={Tags}
      />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Classification Workspace
              </h2>
              <p className="text-[13px] text-slate-500">
                Select a dataset to review column-level classification and masking recommendations.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl" onClick={fetchDatasets}>
              Refresh Datasets
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-[13px] font-medium text-slate-700">
                Dataset / Table
              </label>

              <select
                value={selectedDatasetId}
                onChange={(event) => handleDatasetChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
              >
                <option value="">
                  {loading ? "Loading datasets..." : "Select dataset"}
                </option>

                {datasets.map((dataset) => (
                  <option key={dataset.dataset_id} value={dataset.dataset_id}>
                    {dataset.filename}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[13px] font-medium text-slate-900">Source Type</p>
              <p className="mt-2 text-[13px] text-slate-600">
                {selectedDataset?.source_type || "No dataset selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedDataset && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-[13px] text-slate-600">
              No dataset available yet. Go to Execute → Create Pipeline and upload or generate data first.
            </p>
          </CardContent>
        </Card>
      )}

      {selectedDataset && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  AI-Assisted Classification Results
                </h2>
                <p className="text-[13px] text-slate-500">
                  Dataset: {selectedDataset.filename}
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-4 py-2 text-[11px] font-medium text-slate-600">
                {selectedDataset.columns?.length || 0} columns detected
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[1100px] text-left text-[13px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Table Name</th>
                    <th className="px-4 py-3 font-medium">Column Name</th>
                    <th className="px-4 py-3 font-medium">Detected Type</th>
                    <th className="px-4 py-3 font-medium">AI Assigned Classification</th>
                    <th className="px-4 py-3 font-medium">AI Assisted Masking Rule</th>
                    <th className="px-4 py-3 font-medium">Override</th>
                    <th className="px-4 py-3 font-medium">Assigned Tag</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {(selectedDataset.columns || []).map((column) => (
                    <tr key={column.name} className="bg-white">
                      <td className="px-4 py-3 text-slate-700">
                        {selectedDataset.filename}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-900">
                        {column.name}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {column.type || "unknown"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium ${
                            column.pii
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {getClassification(column)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {column.rule || "No Masking"}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                          Yes
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                          {getTag(column)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-600">
              <p className="font-medium text-slate-900">MVP Note</p>
              <p className="mt-1">
                This currently uses rule-based classification from column names. Later, this can be upgraded to GenAI/Presidio-based classification using column names, data samples, descriptions, and business metadata.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


function MaskingRulesPage({ currentUser }) {
  const isAdmin = currentUser?.role === "admin";
  const globalRules = [
    {
      name: "Default Email Masking",
      scope: "Global",
      ruleType: "Fake Value",
      condition: "Any column containing email",
      output: "Generate synthetic email address",
      status: "Active",
    },
    {
      name: "Default Identifier Hashing",
      scope: "Global",
      ruleType: "Hash",
      condition: "Any column ending with _id",
      output: "SHA-based irreversible hash",
      status: "Active",
    },
    {
      name: "Default Date Shift",
      scope: "Global",
      ruleType: "Date Shift",
      condition: "DOB or birth_date columns",
      output: "Shift date by random safe offset",
      status: "Active",
    },
  ];

  const tableRules = [
    {
      table: "customer_profile",
      column: "full_name",
      classification: "PII",
      rule: "Fake Value",
      override: "Allowed",
      tag: "PII",
    },
    {
      table: "customer_profile",
      column: "email",
      classification: "PII",
      rule: "Fake Value",
      override: "Allowed",
      tag: "PII",
    },
    {
      table: "account_master",
      column: "account_id",
      classification: "Business Identifier",
      rule: "Hash",
      override: "Allowed",
      tag: "IDENTIFIER",
    },
  ];

  const conditionalRules = [
    {
      name: "US SSN Conditional Mask",
      condition: "If country = US and column = ssn",
      action: "Admin Locked Rule",
      example: "Admin-selected rule will be enforced for developers",
    },
    {
      name: "Minor DOB Protection",
      condition: "If age < 18 and column = date_of_birth",
      action: "Date Shift",
      example: "Shift DOB while preserving age band",
    },
    {
      name: "VIP Customer Identifier",
      condition: "If customer_type = VIP and column = customer_id",
      action: "Hash",
      example: "CUST1001 → 8-char hash",
    },
    {
      name: "High Balance Suppression",
      condition: "If account_balance > 50000",
      action: "Hash account_id and fake customer details",
      example: "Protect high-value customer records",
    },
  ];

  const fetchDatasetsForColumns = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/datasets");
    const datasetList = response.data.datasets || [];

    setDatasets(datasetList);

    if (datasetList.length > 0 && !selectedDatasetForColumns) {
      setSelectedDatasetForColumns(datasetList[0].dataset_id);
    }
  } catch (err) {
    console.error(err);
  }
};

  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetForColumns, setSelectedDatasetForColumns] = useState("");
  const [lockedRules, setLockedRules] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("ssn");
  const [selectedRule, setSelectedRule] = useState("Partial Masking");
  const [reason, setReason] = useState("");
  const [developerCanOverride, setDeveloperCanOverride] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [loadingRules, setLoadingRules] = useState(false);

  const fetchLockedRules = async () => {
    try {
      setLoadingRules(true);

      const response = await axios.get("http://127.0.0.1:8000/admin-locked-rules");
      const rules = response.data.rules || [];

      setLockedRules(rules);

      const ssnRule = rules.find((rule) => rule.column === "ssn");

      if (ssnRule) {
      setSelectedColumn(ssnRule.column);
      setSelectedRule(ssnRule.rule);
      setReason("");
      setDeveloperCanOverride(Boolean(ssnRule.developer_can_override));
    }

      setLoadingRules(false);
    } catch (err) {
      console.error(err);
      setLoadingRules(false);
      setSaveMessage("Unable to load admin locked rules. Make sure backend is running.");
    }
  };

  useEffect(() => {
  fetchLockedRules();
  fetchDatasetsForColumns();
}, []);

const selectedDatasetObject = datasets.find(
  (dataset) => dataset.dataset_id === selectedDatasetForColumns
);

const availableColumns = selectedDatasetObject?.columns || [];

const deleteLockedRule = async (columnName) => {
  if (!isAdmin) {
    setSaveMessage("Only Admin users can delete locked rules.");
    return;
  }

  try {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the locked rule for "${columnName}"?`
    );

    if (!confirmDelete) return;

    const response = await axios.delete(
      `http://127.0.0.1:8000/admin-locked-rules/${columnName}`,
      {
        params: {
          user_role: currentUser?.role || "developer",
        },
      }
    );

    if (response.data.status === "SUCCESS") {
      setLockedRules(response.data.rules || []);
      setSaveMessage(`Locked rule for "${columnName}" deleted successfully.`);

      if (selectedColumn === columnName) {
        setSelectedColumn("");
        setSelectedRule("Partial Masking");
        setReason("");
        setDeveloperCanOverride(false);
      }
    } else {
      setSaveMessage(response.data.message || "Unable to delete locked rule.");
    }
  } catch (err) {
    console.error(err);
    setSaveMessage("Unable to delete locked rule. Make sure backend is running.");
  }
};

  const saveLockedRule = async () => {
  try {
    setSaveMessage(null);

    if (!isAdmin) {
      setSaveMessage("Only Admin users can create or update locked rules.");
      return;
    }

    if (!selectedColumn.trim()) {
      setSaveMessage("Please select a column before saving the locked rule.");
      return;
    }

    if (!reason.trim()) {
      setSaveMessage("Please enter a reason before saving the locked rule.");
      return;
    }

    const response = await axios.put("http://127.0.0.1:8000/admin-locked-rules", {
      column: selectedColumn.trim().toLowerCase(),
      rule: selectedRule,
      reason,
      developer_can_override: developerCanOverride,
      enabled: true,
      user_role: currentUser?.role || "developer",
    });

    if (response.data.status === "SUCCESS") {
      setLockedRules(response.data.rules || []);
      setSaveMessage("Admin locked rule saved successfully.");
    } else {
      setSaveMessage(response.data.message || "Unable to save locked rule.");
    }
  } catch (err) {
    console.error(err);
    setSaveMessage("Unable to save locked rule. Make sure backend is running.");
  }
};

  const activeLockedRules = lockedRules.filter((rule) => rule.enabled);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Masking Rules"
        description="Manage global, table-level, column-level, conditional, and admin-locked masking rules used during anonymization."
        icon={SlidersHorizontal}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={Shield}
          label="Global Rules"
          value={globalRules.length}
          helper="Default policies"
        />
        <MetricCard
          icon={TableProperties}
          label="Table Rules"
          value={tableRules.length + activeLockedRules.length}
          helper="Dataset-specific"
        />
        <MetricCard
          icon={ListChecks}
          label="Conditional Rules"
          value={conditionalRules.length}
          helper="Business logic"
        />
        <MetricCard
          icon={Lock}
          label="Admin Locked"
          value={activeLockedRules.length}
          helper="Developer restricted"
        />
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Admin Locked Rule Configuration
              </h2>

              <p className="text-[13px] text-slate-500">
                Admin can define masking rules that Developers cannot override during pipeline execution.
              </p>

              {!isAdmin && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] text-amber-700">
                  You are logged in as Developer. Locked rules are view-only and can only be changed by Admin.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl" onClick={fetchLockedRules}>
                Refresh
              </Button>

              {isAdmin && (
                <Button onClick={saveLockedRule} className="rounded-xl">
                  Save Locked Rule
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div>
  <label className="text-[13px] font-medium text-slate-700">
    Dataset
  </label>

  <select
  disabled={!isAdmin}
  value={selectedDatasetForColumns}
  onChange={(event) => setSelectedDatasetForColumns(event.target.value)}
  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
>
    <option value="">Select dataset</option>

    {datasets.map((dataset) => (
      <option key={dataset.dataset_id} value={dataset.dataset_id}>
        {dataset.filename}
      </option>
    ))}
  </select>
</div>

<div>
  <label className="text-[13px] font-medium text-slate-700">
    Column to Lock
  </label>

  <select
    disabled={!isAdmin}
    value={selectedColumn}
    onChange={(event) => setSelectedColumn(event.target.value)}
    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
  >
    <option value="">Select column</option>

    {availableColumns.map((column) => (
      <option key={column.name} value={column.name}>
        {column.name}
      </option>
    ))}
  </select>
</div>

            <div>
              <label className="text-[13px] font-medium text-slate-700">Locked Rule</label>
              <select
                disabled={!isAdmin}
                value={selectedRule}
                onChange={(event) => setSelectedRule(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none"
              >
                <option>No Masking</option>
                <option>Fake Value</option>
                <option>Partial Masking</option>
                <option>Date Shift</option>
                <option>Hash</option>
              </select>
            </div>

            <div>
              <label className="text-[13px] font-medium text-slate-700">
                Developer Override
              </label>

              <select
                disabled={!isAdmin}
                value={developerCanOverride ? "Allowed" : "Not Allowed"}
                onChange={(event) =>
                  setDeveloperCanOverride(event.target.value === "Allowed")
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option>Not Allowed</option>
                <option>Allowed</option>
              </select>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[13px] font-medium text-slate-900">Persistence</p>
              <p className="mt-2 text-[11px] text-slate-500">
                Saved to backend JSON and reused after restart.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-[13px] font-medium text-slate-700">Reason</label>
            <textarea
              disabled={!isAdmin}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              rows="3"
              placeholder="Enter why this rule should be locked for developers"
            />
          </div>

          {saveMessage && (
            <div
              className={`mt-4 rounded-xl p-3 text-[13px] ${
                saveMessage.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1100px] text-left text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Column</th>
                  <th className="px-4 py-3 font-medium">Locked Rule</th>
                  <th className="px-4 py-3 font-medium">Developer Override</th>
                  <th className="px-4 py-3 font-medium">Locked By</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loadingRules && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-slate-500">
                      Loading locked rules...
                    </td>
                  </tr>
                )}

                {!loadingRules && lockedRules.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 text-slate-500">
                      No admin locked rules found.
                    </td>
                  </tr>
                )}

                {!loadingRules &&
                  lockedRules.map((rule) => (
                    <tr key={rule.column} className="bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {rule.column}
                      </td>

                      <td className="px-4 py-3 min-w-[160px]">
                        <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                          {rule.rule}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {rule.developer_can_override ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                            Allowed
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
                            Not Allowed
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {rule.locked_by || "TDM Admin"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {rule.reason}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                            rule.enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {rule.enabled ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <button
                            onClick={() => deleteLockedRule(rule.column)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Global Masking Rules</h2>
              <p className="text-[13px] text-slate-500">
                Default rules that can apply across all datasets unless overridden.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl">
              Add Global Rule
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[950px] text-left text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Rule Name</th>
                  <th className="px-4 py-3 font-medium">Scope</th>
                  <th className="px-4 py-3 font-medium">Rule Type</th>
                  <th className="px-4 py-3 font-medium">Condition</th>
                  <th className="px-4 py-3 font-medium">Output</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {globalRules.map((rule) => (
                  <tr key={rule.name} className="bg-white">
                    <td className="px-4 py-3 font-medium text-slate-900">{rule.name}</td>
                    <td className="px-4 py-3 text-slate-700">{rule.scope}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                        {rule.ruleType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rule.condition}</td>
                    <td className="px-4 py-3 text-slate-600">{rule.output}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                        {rule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Table / Column Rule Assignment
              </h2>
              <p className="text-[13px] text-slate-500">
                Rule assignment structure aligned with classification, override, and tags.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl">
              Add Table Rule
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1000px] text-left text-[13px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Table Name</th>
                  <th className="px-4 py-3 font-medium">Column Name</th>
                  <th className="px-4 py-3 font-medium">Classification</th>
                  <th className="px-4 py-3 font-medium">Assigned Rule</th>
                  <th className="px-4 py-3 font-medium">Override</th>
                  <th className="px-4 py-3 font-medium">Assigned Tag</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {tableRules.map((rule) => (
                  <tr key={`${rule.table}-${rule.column}`} className="bg-white">
                    <td className="px-4 py-3 text-slate-700">{rule.table}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{rule.column}</td>
                    <td className="px-4 py-3 text-slate-700">{rule.classification}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                        {rule.rule}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                          rule.override === "Restricted"
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {rule.override}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                        {rule.tag}
                      </span>
                    </td>
                  </tr>
                ))}

                {lockedRules.map((rule) => (
                  <tr key={`locked-${rule.column}`} className="bg-white">
                    <td className="px-4 py-3 text-slate-700">All Tables</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{rule.column}</td>
                    <td className="px-4 py-3 text-slate-700">Admin Locked Sensitive Field</td>
                    <td className="px-4 py-3 min-w-[160px]">
                      <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-red-600 px-3 py-1 text-[11px] font-medium text-white">
                        {rule.rule}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rule.developer_can_override ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                          Allowed
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700">
                          Restricted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700">
                        CONFIDENTIAL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Conditional Transform Rules
              </h2>
              <p className="text-[13px] text-slate-500">
                Business-condition based anonymization rules for more realistic enterprise scenarios.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl">
              Add Conditional Rule
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {conditionalRules.map((rule) => (
              <div key={rule.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{rule.name}</p>
                    <p className="mt-2 text-[13px] text-slate-500">{rule.condition}</p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-medium text-amber-700">
                    Conditional
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-[13px] text-slate-600">
                  <p>
                    <span className="font-medium text-slate-900">Action:</span>{" "}
                    {rule.action}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium text-slate-900">Example:</span>{" "}
                    {rule.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-[13px] text-slate-600">
            <p className="font-medium text-slate-900">MVP Note</p>
            <p className="mt-1">
              Admin locked rules are now stored by the backend and reused across sessions.
              Conditional rules are still UI examples and can be connected to backend execution later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = sessionStorage.getItem("tdm_user");
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [maskingRules, setMaskingRules] = useState({});
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState(sampleColumns);
  const [backendSessionChecked, setBackendSessionChecked] = useState(false);

  useEffect(() => {
  const checkBackendSession = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/");
      const latestBackendSessionId = response.data.backend_session_id;
      const storedBackendSessionId = sessionStorage.getItem("tdm_backend_session_id");

      if (storedBackendSessionId && storedBackendSessionId !== latestBackendSessionId) {
        sessionStorage.removeItem("tdm_user");
        sessionStorage.removeItem("tdm_backend_session_id");
        setCurrentUser(null);
        setActivePage("dashboard");
        setIsMenuCollapsed(true);
      }

      if (!storedBackendSessionId && latestBackendSessionId) {
        sessionStorage.setItem("tdm_backend_session_id", latestBackendSessionId);
      }

      setBackendSessionChecked(true);
    } catch (err) {
      console.error(err);
      setBackendSessionChecked(true);
    }
  };

  checkBackendSession();
}, []);

  const logout = () => {
  sessionStorage.removeItem("tdm_user");
  sessionStorage.removeItem("tdm_backend_session_id");
  setCurrentUser(null);
  setActivePage("dashboard");
  setIsMenuCollapsed(true);
  setActiveStep(1);
  setCurrentJobId(null);
  setSelectedDatasetId(null);
  setSelectedDatasets([]);
  setDetectedColumns(sampleColumns);
  setMaskingRules({});
};

const handleLoginSuccess = async (user) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/");
    const latestBackendSessionId = response.data.backend_session_id;

    sessionStorage.setItem("tdm_user", JSON.stringify(user));
    sessionStorage.setItem("tdm_backend_session_id", latestBackendSessionId);

    setCurrentUser(user);
    setActivePage("dashboard");
    setIsMenuCollapsed(true);
    setActiveStep(1);
    setCurrentJobId(null);
    setSelectedDatasetId(null);
    setSelectedDatasets([]);
    setDetectedColumns(sampleColumns);
    setMaskingRules({});
  } catch (err) {
    console.error(err);
  }
};

if (!backendSessionChecked) {
  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-700">
      Checking backend session...
    </div>
  );
}

  if (!currentUser) {
  return <LoginPage onLogin={handleLoginSuccess} />;
}

  const permissions = [
    ...(currentUser.permissions || []),
    "workspaces",
    "metadata_versions",
    "source_connections",
    "existing_pipelines",
    "data_preview",
  ];

  if (!permissions.includes(activePage)) {
    setActivePage("dashboard");
  }

  const renderPage = () => {
    if (activePage === "dashboard") return <DashboardPage />;

    if (activePage === "data_inventory") return <DataInventoryPage />;

    if (activePage === "workspaces") return <WorkspacesPage />;

    if (activePage === "metadata_versions") return <MetadataVersionsPage />;

    if (activePage === "source_connections") return <SourceConnectionsPage />;

    if (activePage === "data_classification") return <DataClassificationPage />;

    if (activePage === "masking_rules") {
  return <MaskingRulesPage currentUser={currentUser} />;
}

    if (activePage === "create_pipeline") {
      return (
        <CreatePipelinePage
          activeStep={activeStep}
          currentUser={currentUser}
          setActiveStep={setActiveStep}
          currentJobId={currentJobId}
          setCurrentJobId={setCurrentJobId}
          maskingRules={maskingRules}
          setMaskingRules={setMaskingRules}
          selectedDatasetId={selectedDatasetId}
          setSelectedDatasetId={setSelectedDatasetId}
          selectedDatasets={selectedDatasets}
          setSelectedDatasets={setSelectedDatasets}
          detectedColumns={detectedColumns}
          setDetectedColumns={setDetectedColumns}
        />
      );
    }

    if (activePage === "job_monitor") {
      return (
        <div className="space-y-6">
          <PageHeader
            title="Job Monitor"
            description="Monitor anonymization jobs, status, execution mode, processed rows, and output readiness."
            icon={Activity}
          />
          <DashboardSummary />
          <JobHistory />
        </div>
      );
    }

    if (activePage === "data_preview") return <MaskedAssetsPage currentJobId={currentJobId} />;

    if (activePage === "existing_pipelines") return <ExistingPipelinesPage />;

    const placeholderMap = {
      workspaces: {
        title: "Workspaces",
        description: "Manage team workspaces, shared datasets, pipeline ownership, and collaboration zones.",
        icon: Briefcase,
        items: ["Admin Workspace", "Developer Workspace", "Shared Pipeline Workspace", "Future: workspace-level permissions"],
      },
      source_connections: {
        title: "Source Connections",
        description: "Configure future source systems such as Databricks, PostgreSQL, Oracle, and Azure SQL.",
        icon: Plug,
        items: ["Databricks Unity Catalog", "PostgreSQL", "Oracle", "Azure SQL", "Future: connection secrets"],
      },
      subsetting_rules: {
        title: "Subsetting Rules",
        description: "Define row filters and sampling strategies for smaller test datasets.",
        icon: ListChecks,
        items: ["Sample by percentage", "Filter by condition", "Keep relational consistency", "Future: referential integrity"],
      },
      existing_pipelines: {
        title: "Existing Pipelines",
        description: "View saved anonymization pipelines and reuse configurations.",
        icon: History,
        items: ["Saved pipeline templates", "Pipeline versioning", "Future: rerun from previous config"],
      },
      user_access: {
        title: "User Access & Roles",
        description: "Admin-only page for managing users, roles, and permissions.",
        icon: Users,
        items: ["Admin", "Developer", "Future: Viewer", "Future: Approver", "Future: workspace-level RBAC"],
      },
      configuration: {
        title: "Configuration",
        description: "Admin-only page for platform configuration, runtime settings, and integration setup.",
        icon: Settings,
        items: ["Environment settings", "API configuration", "Future: Databricks workspace configuration", "Future: secret management"],
      },
      help: {
        title: "Documentation",
        description: "Help center for using the TDM platform and understanding architecture.",
        icon: HelpCircle,
        items: ["How to upload data", "How to generate test data", "How masking rules work", "How Databricks scaling will work"],
      },
    };

    const page = placeholderMap[activePage] || placeholderMap.help;

    return (
      <PlaceholderPage
        title={page.title}
        description={page.description}
        icon={page.icon}
        items={page.items}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div
        className="grid min-w-0 max-w-full gap-4 overflow-x-hidden p-3 lg:p-4"
        style={{
          gridTemplateColumns: isMenuCollapsed
            ? "76px minmax(0, 1fr)"
            : "260px minmax(0, 1fr)",
        }}
      >
        <EnterpriseSideMenu
          currentUser={currentUser}
          activePage={activePage}
          setActivePage={setActivePage}
          isMenuCollapsed={isMenuCollapsed}
          setIsMenuCollapsed={setIsMenuCollapsed}
        />

        <main className="min-w-0 space-y-6 overflow-hidden">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[13px] font-medium text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-[11px] capitalize text-slate-500">
                Role: {currentUser.role} · Active Page: {activePage.replaceAll("_", " ")}
              </p>
            </div>

            <Button variant="outline" className="rounded-xl" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {renderPage()}

          
        </main>
      </div>
    </div>
  );
}