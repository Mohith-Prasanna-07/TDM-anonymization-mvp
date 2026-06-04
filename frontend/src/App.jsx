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

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-slate-200 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, onClick, disabled, variant = "default", className = "", type = "button" }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

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
  { id: 1, label: "Source", icon: Database },
  { id: 2, label: "Rules", icon: Settings },
  { id: 3, label: "Run", icon: Play },
  { id: 4, label: "Review", icon: Eye },
];

const navGroups = [
  {
    group: "Main",
    items: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "data_inventory", label: "Data Inventory", icon: Boxes },
      { key: "workspaces", label: "Workspaces", icon: Briefcase },
    ],
  },
  {
    group: "Configure",
    items: [
      { key: "source_connections", label: "Source Connections", icon: Plug },
      { key: "data_classification", label: "Data Classification", icon: Tags },
      { key: "masking_rules", label: "Masking Rules", icon: SlidersHorizontal },
      { key: "subsetting_rules", label: "Subsetting Rules", icon: ListChecks },
    ],
  },
  {
    group: "Execute",
    items: [
      { key: "create_pipeline", label: "Create Pipeline", icon: Play },
      { key: "existing_pipelines", label: "Existing Pipelines", icon: History },
      { key: "job_monitor", label: "Job Monitor", icon: Activity },
      { key: "data_preview", label: "Data Preview & Validation", icon: TableProperties },
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
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{helper}</p>
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

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-slate-400">
            TDM Secure Workspace
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Data Anonymization Control Center
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
            Sign in to access extraction, synthetic test data generation, anonymization,
            job monitoring, audit validation, role-based access, and assistant-driven TDM support.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Admin</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Full access to dashboards, data inventory, rule configuration, pipelines,
                monitoring, user access, and configuration.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">Developer</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Access to assigned workflows, data classification, masking, pipeline execution,
                preview, and job monitoring.
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use demo credentials to enter the MVP.</p>

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
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="admin@tdm.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Password"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button onClick={login} disabled={loading} className="w-full rounded-xl">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
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
  const permissions = currentUser?.permissions || [];

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
      <aside className="w-full rounded-3xl bg-slate-950 p-4 text-white shadow-sm lg:min-h-screen lg:w-24">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setIsMenuCollapsed(false)}
            className="rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"
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
                className={`rounded-2xl p-3 transition ${
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
    <aside className="w-full rounded-3xl bg-slate-950 p-5 text-white shadow-sm lg:min-h-screen lg:w-80">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <Layers className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-slate-400">
              TDM Platform
            </p>
            <h2 className="text-xl font-semibold text-white">Control Panel</h2>
          </div>
        </div>

        <button
          onClick={() => setIsMenuCollapsed(true)}
          className="rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"
          title="Collapse menu"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Signed in as
        </p>
        <p className="mt-1 text-sm font-semibold text-white">
          {currentUser?.name}
        </p>
        <p className="mt-1 text-xs capitalize text-slate-400">
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
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
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
                        <div className="flex items-start gap-3">
                          <div
                            className={`rounded-xl p-2 ${
                              isActive ? "bg-slate-100" : "bg-white/10"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
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
        <p className="text-sm font-medium text-white">Role-Based MVP</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
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
      className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-3xl bg-slate-900 p-4 text-white">
          <Icon className="h-8 w-8" />
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            TDM Modernization MVP
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-500 md:text-base">
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
              <h2 className="text-lg font-semibold text-slate-900">Available Datasets</h2>
              <p className="text-sm text-slate-500">Datasets exist for the current backend session.</p>
            </div>

            <Button variant="outline" className="rounded-xl" onClick={fetchDatasets}>
              Refresh
            </Button>
          </div>

          {loading && <p className="mt-5 text-sm text-slate-500">Loading datasets...</p>}

          {!loading && datasets.length === 0 && (
            <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
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
                      <p className="mt-1 text-xs text-slate-500">
                        Source: {dataset.source_type} · Uploaded:{" "}
                        {new Date(dataset.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {dataset.columns?.length || 0} columns
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(dataset.columns || []).map((column) => (
                      <span
                        key={column.name}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
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

function PlaceholderPage({ title, description, icon: Icon, items = [] }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} icon={Icon} />

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Blueprint Page</h2>
          <p className="mt-2 text-sm text-slate-500">
            This page is part of the realistic enterprise blueprint. The UI shell is ready;
            detailed backend logic can be connected next.
          </p>

          {items.length > 0 && (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {items.map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
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
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                      status === "completed"
                        ? "bg-emerald-600 text-white"
                        : status === "active"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {status === "completed" ? "✓" : index + 1}
                  </div>
                  <p className={`mt-2 text-xs font-medium ${status === "active" ? "text-slate-900" : "text-slate-500"}`}>
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
            <p className="mt-3 text-sm font-medium">{step.label}</p>
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

  const [sourceDatabases, setSourceDatabases] = useState([]);
  const [selectedSourceDatabase, setSelectedSourceDatabase] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [selectedSourceTables, setSelectedSourceTables] = useState([]);
  const [sourceColumnsByTable, setSourceColumnsByTable] = useState({});
  const [selectedColumnsByTable, setSelectedColumnsByTable] = useState({});
  const [sourceRowCount, setSourceRowCount] = useState(100);
  const [rowCountByTable, setRowCountByTable] = useState({});
  const [sourceGenerating, setSourceGenerating] = useState(false);

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
  }, []);

  const handleDatasetReady = (responseData, displayName) => {
    setSelectedFileName(displayName);
    setSelectedDatasetIdLocal(responseData.dataset_id);

    onDatasetUploaded({
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

    onDatasetUploaded({
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

  const canContinue = Boolean(selectedDatasetIdLocal);

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
                  <h2 className="text-lg font-semibold text-slate-900">
                    Source Dataset
                  </h2>
                  <p className="text-sm text-slate-500">
                    Select an existing source dataset, or generate new test data from backend source tables.
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                Step 1 · Extraction
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Source Connection
                </label>
                <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                  <option>Databricks Unity Catalog</option>
                  <option>Local Uploaded CSV / Generated Test Data</option>
                  <option>PostgreSQL</option>
                  <option>Oracle</option>
                  <option>Azure SQL</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-700">
                    Existing Datasets
                  </label>

                  <button
                    onClick={fetchDatasets}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Refresh
                  </button>
                </div>

                <select
                  value={selectedDatasetIdLocal}
                  onChange={(event) => handleSelectExistingDataset(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">
                    {loadingDatasets ? "Loading datasets..." : "Select existing dataset"}
                  </option>

                  {availableDatasets.map((dataset) => (
                    <option key={dataset.dataset_id} value={dataset.dataset_id}>
                      {dataset.filename}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Current Selection</p>

              {selectedFileName ? (
                <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Dataset</p>
                    <p className="mt-1 font-medium text-slate-900">{selectedFileName}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Source</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {selectedDataset?.source_type || "current selection"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Columns</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {selectedDataset?.columns?.length || "Multiple tables"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
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
                <h3 className="text-lg font-semibold text-slate-900">Quick CSV Upload</h3>
                <p className="text-sm text-slate-500">
                  Small fallback option for one-off CSV testing.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-500">
                Upload a CSV and let the backend detect schema.
              </p>

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50">
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

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Generate Test Data from Existing Source Tables
              </h3>
              <p className="text-sm text-slate-500">
                Choose backend source tables, select only required columns, and generate schema-driven test data.
              </p>
            </div>

            <Button
              onClick={generateFromExistingSource}
              disabled={
                sourceGenerating ||
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
              <label className="text-sm font-medium text-slate-700">
                Source Connection
              </label>
              <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
                <option>Databricks</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Database / Catalog.Schema
              </label>
              <select
                value={selectedSourceDatabase}
                onChange={(event) => {
                  setSelectedSourceDatabase(event.target.value);
                  fetchSourceTables(event.target.value);
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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
              <label className="text-sm font-medium text-slate-700">
                Default Row Count
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={sourceRowCount}
                onChange={(event) => setSourceRowCount(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Available Tables
              </p>

              <div className="mt-4 space-y-2">
                {sourceTables.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Select a database to load tables.
                  </p>
                )}

                {sourceTables.map((tableName) => (
                  <label
                    key={tableName}
                    className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700"
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
              <p className="text-sm font-semibold text-slate-900">
                Column Selection
              </p>

              <div className="mt-4 space-y-5">
                {selectedSourceTables.length === 0 && (
                  <p className="text-sm text-slate-500">
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
                            <p className="text-xs text-slate-500">
                              {selectedColumns.length} of {columns.length} columns selected
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs font-medium text-slate-600">
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
                              className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs outline-none"
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
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
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
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 md:grid-cols-3">
                        {columns.map((column) => (
                          <label
                            key={`${tableName}-${column.name}`}
                            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
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
              <p className="text-sm text-slate-600">
                Selected dataset:{" "}
                <span className="font-medium text-slate-900">
                  {selectedFileName}
                </span>
              </p>
            )}

            {uploadMessage && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {uploadError}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canContinue} className="rounded-xl">
          Continue to Masking Rules
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
            <h2 className="text-lg font-semibold text-slate-900">
              AI-Assisted Masking Rule Assignment
            </h2>
            <p className="text-sm text-slate-500">
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
          <table className="w-full min-w-[1150px] text-left text-sm">
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
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                          <AlertTriangle className="mr-1 h-3 w-3" /> PII
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          Non-PII
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                        {col.ai_suggested_rule || "No Masking"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={col.rule || "No Masking"}
                        disabled={isDeveloper && col.admin_locked}
                        onChange={(e) => updateRule(col.name, e.target.value)}
                        className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ${
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
                        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                          <Lock className="mr-1 h-3 w-3" />
                          Admin Locked
                        </span>
                      ) : isOverridden ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          User Overridden
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          AI Accepted
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-slate-500">
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

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
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
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Multi-Table Masking Rule Assignment
            </h2>
            <p className="text-sm text-slate-500">
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
                  <p className="text-xs text-slate-500">
                    Dataset: {table.filename} · {table.columns?.length || 0} columns
                  </p>
                </div>

                <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                  {table.source_type || "dataset"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] text-left text-sm">
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
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                <AlertTriangle className="mr-1 h-3 w-3" /> PII
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                Non-PII
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            <span className="inline-flex whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
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
                              className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ${
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
                              <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                                <Lock className="mr-1 h-3 w-3" />
                                Admin Locked
                              </span>
                            ) : isOverridden ? (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                User Overridden
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                AI Accepted
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-500">
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
  );
}

function RunStep({ currentUser, onNext, onJobCreated, maskingRules, datasetId, selectedDatasets }) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);

  const selectedDatasetList =
    Array.isArray(selectedDatasets) && selectedDatasets.length > 0
      ? selectedDatasets
      : datasetId
      ? [{ dataset_id: datasetId, filename: "Selected Dataset" }]
      : [];

  const isMultiTableRun = selectedDatasetList.length > 1;

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
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="rounded-2xl shadow-sm lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Run Anonymization Job</h2>
          <p className="mt-1 text-sm text-slate-500">
            Submit one dataset or multiple generated source tables to the FastAPI execution layer.
          </p>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Execution Scope
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {isMultiTableRun
                    ? `${selectedDatasetList.length} source tables will be anonymized in one multi-table job.`
                    : "One dataset will be anonymized."}
                </p>
              </div>

              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                {isMultiTableRun ? "Multi-table run" : "Single-table run"}
              </span>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {selectedDatasetList.map((dataset) => (
                <div
                  key={dataset.dataset_id}
                  className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <p className="font-medium text-slate-900">
                    {dataset.table_name || dataset.filename || dataset.dataset_id}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 break-all">
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
                  <p className="text-sm text-slate-500">
                    {complete
                      ? "Backend completed anonymization for the selected table scope."
                      : running
                      ? "Submitting request to FastAPI backend."
                      : "Review configuration and start anonymization."}
                  </p>
                </div>
              </div>

              <Button onClick={startRun} disabled={running} className="rounded-xl">
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
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-medium">Job submitted successfully</p>
                <p className="mt-1 break-all">Job ID: {jobId}</p>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
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
          <h3 className="font-semibold text-slate-900">Execution Behavior</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-4">
              React sends every selected dataset ID and its table-specific masking rules to FastAPI.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              FastAPI anonymizes each generated table and creates one parent execution job.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              The same pattern can later trigger one Databricks workflow with multiple table tasks.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function PreviewTable({ title, rows, warning = false }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-3 text-sm text-slate-500">No preview rows available.</p>
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
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          {warning ? (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              <AlertTriangle className="mr-1 h-3 w-3" /> Contains PII
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Masked
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-xs">
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

function ReviewStep({ jobId }) {
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
          <p className="text-sm text-slate-600">Loading preview and audit data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Review data loaded from FastAPI backend</p>
            <p className="mt-1 break-all">Job ID: {jobId}</p>
          </div>

          <a
            href={`http://127.0.0.1:8000/download/masked-output/${jobId}`}
            download
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Download Masked CSV
          </a>
        </div>
      </div>

      <div className="space-y-6">
        {tableNames.map((tableName) => (
          <div key={tableName} className="space-y-4">
            <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
              <p className="text-sm font-semibold">Table: {tableName}</p>
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
              <h2 className="text-lg font-semibold text-slate-900">Audit Summary</h2>
              <p className="text-sm text-slate-500">Generated by backend after anonymization run.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
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
        title="Create Pipeline"
        description="Create a TDM pipeline by selecting source data, reviewing schema classification, assigning masking rules, executing anonymization, and validating the output."
        icon={Play}
      />

      <WorkflowProgress activeStep={activeStep} />
      <Stepper activeStep={activeStep} />

      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Pipeline Navigation</p>
          <p className="text-xs text-slate-500">
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
            onDatasetUploaded={({ datasetId, columns }) => {
              const safeColumns = Array.isArray(columns) ? columns : sampleColumns;

              setSelectedDatasetId(datasetId);
              setSelectedDatasets([
                {
                  dataset_id: datasetId,
                  filename: "Selected Dataset",
                  source_type: "selected_dataset",
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

        {activeStep === 4 && <ReviewStep jobId={currentJobId} />}
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
            <h2 className="text-lg font-semibold text-slate-900">Recent Job History</h2>
            <p className="text-sm text-slate-500">Tracks anonymization runs submitted during this backend session.</p>
          </div>

          <Button variant="outline" className="rounded-xl" onClick={fetchHistory}>
            Refresh History
          </Button>
        </div>

        {loading && <p className="mt-5 text-sm text-slate-500">Loading job history...</p>}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            No jobs yet. Run an anonymization job to populate history.
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1000px] text-left text-sm">
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
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{job.job_id}</td>
                    <td className="px-4 py-3 text-slate-700">{job.dataset_name || "N/A"}</td>
                    <td className="px-4 py-3 text-slate-700">{job.source_type || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
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
              <h2 className="text-lg font-semibold text-slate-900">
                Classification Workspace
              </h2>
              <p className="text-sm text-slate-500">
                Select a dataset to review column-level classification and masking recommendations.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl" onClick={fetchDatasets}>
              Refresh Datasets
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                Dataset / Table
              </label>

              <select
                value={selectedDatasetId}
                onChange={(event) => handleDatasetChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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
              <p className="text-sm font-medium text-slate-900">Source Type</p>
              <p className="mt-2 text-sm text-slate-600">
                {selectedDataset?.source_type || "No dataset selected"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedDataset && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-slate-600">
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
                <h2 className="text-lg font-semibold text-slate-900">
                  AI-Assisted Classification Results
                </h2>
                <p className="text-sm text-slate-500">
                  Dataset: {selectedDataset.filename}
                </p>
              </div>

              <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                {selectedDataset.columns?.length || 0} columns detected
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[1100px] text-left text-sm">
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
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
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
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          Yes
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                          {getTag(column)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
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
              <h2 className="text-lg font-semibold text-slate-900">
                Admin Locked Rule Configuration
              </h2>

              <p className="text-sm text-slate-500">
                Admin can define masking rules that Developers cannot override during pipeline execution.
              </p>

              {!isAdmin && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
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
  <label className="text-sm font-medium text-slate-700">
    Dataset
  </label>

  <select
  disabled={!isAdmin}
  value={selectedDatasetForColumns}
  onChange={(event) => setSelectedDatasetForColumns(event.target.value)}
  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
  <label className="text-sm font-medium text-slate-700">
    Column to Lock
  </label>

  <select
    disabled={!isAdmin}
    value={selectedColumn}
    onChange={(event) => setSelectedColumn(event.target.value)}
    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
              <label className="text-sm font-medium text-slate-700">Locked Rule</label>
              <select
                disabled={!isAdmin}
                value={selectedRule}
                onChange={(event) => setSelectedRule(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option>No Masking</option>
                <option>Fake Value</option>
                <option>Partial Masking</option>
                <option>Date Shift</option>
                <option>Hash</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Developer Override
              </label>

              <select
                disabled={!isAdmin}
                value={developerCanOverride ? "Allowed" : "Not Allowed"}
                onChange={(event) =>
                  setDeveloperCanOverride(event.target.value === "Allowed")
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              >
                <option>Not Allowed</option>
                <option>Allowed</option>
              </select>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">Persistence</p>
              <p className="mt-2 text-xs text-slate-500">
                Saved to backend JSON and reused after restart.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-slate-700">Reason</label>
            <textarea
              disabled={!isAdmin}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              rows="3"
              placeholder="Enter why this rule should be locked for developers"
            />
          </div>

          {saveMessage && (
            <div
              className={`mt-4 rounded-xl p-3 text-sm ${
                saveMessage.includes("successfully")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1100px] text-left text-sm">
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
                        <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                          {rule.rule}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {rule.developer_can_override ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            Allowed
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
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
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
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
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">View only</span>
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
              <h2 className="text-lg font-semibold text-slate-900">Global Masking Rules</h2>
              <p className="text-sm text-slate-500">
                Default rules that can apply across all datasets unless overridden.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl">
              Add Global Rule
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[950px] text-left text-sm">
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
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {rule.ruleType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{rule.condition}</td>
                    <td className="px-4 py-3 text-slate-600">{rule.output}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
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
              <h2 className="text-lg font-semibold text-slate-900">
                Table / Column Rule Assignment
              </h2>
              <p className="text-sm text-slate-500">
                Rule assignment structure aligned with classification, override, and tags.
              </p>
            </div>

            <Button variant="outline" className="rounded-xl">
              Add Table Rule
            </Button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[1000px] text-left text-sm">
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
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                        {rule.rule}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          rule.override === "Restricted"
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {rule.override}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
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
                      <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                        {rule.rule}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rule.developer_can_override ? (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          Allowed
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                          Restricted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
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
              <h2 className="text-lg font-semibold text-slate-900">
                Conditional Transform Rules
              </h2>
              <p className="text-sm text-slate-500">
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
                    <p className="mt-2 text-sm text-slate-500">{rule.condition}</p>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    Conditional
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
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

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
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

  const permissions = currentUser.permissions || [];

  if (!permissions.includes(activePage)) {
    setActivePage("dashboard");
  }

  const renderPage = () => {
    if (activePage === "dashboard") return <DashboardPage />;

    if (activePage === "data_inventory") return <DataInventoryPage />;

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

    if (activePage === "data_preview") {
      return (
        <div className="space-y-6">
          <PageHeader
            title="Data Preview & Validation"
            description="Validate anonymized output using before/after previews and audit summaries."
            icon={TableProperties}
          />
          {currentJobId ? <ReviewStep jobId={currentJobId} /> : (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6 text-sm text-slate-600">
                No completed job selected yet. Create and run a pipeline first.
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

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
      className="grid gap-6 p-4 lg:p-6"
      style={{
        gridTemplateColumns: isMenuCollapsed ? "96px 1fr" : "320px 1fr",
      }}
    >
        <EnterpriseSideMenu
          currentUser={currentUser}
          activePage={activePage}
          setActivePage={setActivePage}
          isMenuCollapsed={isMenuCollapsed}
          setIsMenuCollapsed={setIsMenuCollapsed}
        />

        <main className="space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-xs capitalize text-slate-500">
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