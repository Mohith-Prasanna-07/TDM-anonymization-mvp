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
        localStorage.setItem("tdm_user", JSON.stringify(response.data.user));
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
    Main: true,
    Configure: false,
    Execute: true,
    Admin: false,
    Help: false,
  });

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

function SourceStep({ onNext, onDatasetUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [selectedDatasetIdLocal, setSelectedDatasetIdLocal] = useState("");
  const [testTemplate, setTestTemplate] = useState("customer");
  const [rowCount, setRowCount] = useState(100);

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

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleDatasetReady = (responseData, displayName) => {
    setSelectedFileName(displayName);
    setSelectedDatasetIdLocal(responseData.dataset_id);

    onDatasetUploaded({
      datasetId: responseData.dataset_id,
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

  const handleGenerateTestData = async () => {
    try {
      setGenerating(true);
      setUploadError(null);
      setUploadMessage(null);

      const response = await axios.post("http://127.0.0.1:8000/generate-test-data", {
        template: testTemplate,
        row_count: Number(rowCount),
      });

      if (response.data.status === "SUCCESS") {
        setUploadMessage(
          `Generated ${response.data.row_count} rows of ${response.data.template} test data.`
        );

        handleDatasetReady(response.data, response.data.filename);
      } else {
        setUploadError(response.data.message || "Test data generation failed.");
      }

      setGenerating(false);
    } catch (err) {
      console.error(err);
      setGenerating(false);
      setUploadError("Unable to generate test data. Make sure FastAPI is running.");
    }
  };

  const selectedDataset = availableDatasets.find(
    (dataset) => dataset.dataset_id === selectedDatasetIdLocal
  );

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="rounded-2xl shadow-sm lg:col-span-1">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3">
              <Database className="h-6 w-6 text-slate-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">Source Dataset</h2>
              <p className="text-sm text-slate-500">
                Upload, generate, or select an existing dataset.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium text-slate-700">Connection</label>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option>Local Uploaded CSV / Generated Test Data</option>
              <option>Databricks Unity Catalog</option>
              <option>PostgreSQL</option>
              <option>Oracle</option>
              <option>Azure SQL</option>
            </select>

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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
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

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">Selected Dataset</p>

            {selectedFileName ? (
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  Name:{" "}
                  <span className="font-medium text-slate-900">
                    {selectedFileName}
                  </span>
                </p>

                <p>
                  Source:{" "}
                  <span className="font-medium text-slate-900">
                    {selectedDataset?.source_type || "current selection"}
                  </span>
                </p>

                <p>
                  Columns:{" "}
                  <span className="font-medium text-slate-900">
                    {selectedDataset?.columns?.length || "Detected"}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No dataset selected yet.
              </p>
            )}
          </div>

          <Button onClick={onNext} className="mt-6 w-full rounded-xl">
            Continue to Masking Rules
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-dashed shadow-sm">
        <CardContent className="flex h-full min-h-[360px] flex-col items-center justify-center p-6 text-center">
          <div className="rounded-3xl bg-slate-100 p-5">
            <Upload className="h-9 w-9 text-slate-700" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-slate-900">Upload CSV</h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload a CSV file and the backend will detect columns and suggest
            masking rules.
          </p>

          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50">
            {uploading ? "Uploading..." : "Choose CSV File"}
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3">
              <FileText className="h-6 w-6 text-slate-700" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Generate Test Data
              </h3>
              <p className="text-sm text-slate-500">
                Create synthetic data for demo and testing.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium text-slate-700">Template</label>
            <select
              value={testTemplate}
              onChange={(event) => setTestTemplate(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="customer">Customer Data</option>
              <option value="account">Account Data</option>
              <option value="claims">Claims Data</option>
              <option value="employee">Employee Data</option>
            </select>

            <label className="text-sm font-medium text-slate-700">Row Count</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={rowCount}
              onChange={(event) => setRowCount(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          <Button
            onClick={handleGenerateTestData}
            disabled={generating}
            className="mt-6 w-full rounded-xl"
          >
            {generating ? "Generating..." : "Generate Test Data"}
          </Button>
        </CardContent>
      </Card>

      {(selectedFileName || uploadMessage || uploadError) && (
        <Card className="rounded-2xl shadow-sm lg:col-span-3">
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
    </div>
  );
}


function RulesStep({ onNext, onRulesChange, detectedColumns }) {
  const safeDetectedColumns =
    Array.isArray(detectedColumns) && detectedColumns.length > 0
      ? detectedColumns
      : sampleColumns;

  const normalizeColumns = (columns) =>
    columns.map((col) => ({
      ...col,
      ai_suggested_rule: col.ai_suggested_rule || col.rule || "No Masking",
      rule: col.rule || col.ai_suggested_rule || "No Masking",
      override_allowed: col.override_allowed !== false,
    }));

  const [columns, setColumns] = useState(normalizeColumns(safeDetectedColumns));

  useEffect(() => {
    const safeColumns =
      Array.isArray(detectedColumns) && detectedColumns.length > 0
        ? detectedColumns
        : sampleColumns;

    setColumns(normalizeColumns(safeColumns));
  }, [detectedColumns]);

  useEffect(() => {
    const selectedRules = {};

    columns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  }, [columns, onRulesChange]);

  const updateRule = (name, rule) => {
    const updatedColumns = columns.map((col) =>
      col.name === name ? { ...col, rule } : col
    );

    setColumns(updatedColumns);

    const selectedRules = {};
    updatedColumns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  };

  const resetToAiSuggestions = () => {
    const resetColumns = columns.map((col) => ({
      ...col,
      rule: col.ai_suggested_rule || "No Masking",
    }));

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

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              AI-Assisted Masking Rule Assignment
            </h2>
            <p className="text-sm text-slate-500">
              AI suggests masking rules from detected schema. Users can override before execution.
            </p>
          </div>

          <Button variant="outline" className="rounded-xl" onClick={resetToAiSuggestions}>
            Reset to AI Suggestions
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={Tags}
            label="Detected Columns"
            value={columns.length}
            helper="From uploaded/generated dataset"
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
            helper="Rules changed from AI suggestion"
          />
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Column</th>
                <th className="px-4 py-3 font-medium">Detected Type</th>
                <th className="px-4 py-3 font-medium">AI Classification</th>
                <th className="px-4 py-3 font-medium">AI Suggested Rule</th>
                <th className="px-4 py-3 font-medium">Final Rule / Override</th>
                <th className="px-4 py-3 font-medium">Override Status</th>
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
                        onChange={(e) => updateRule(col.name, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
                      >
                        <option>No Masking</option>
                        <option>Fake Value</option>
                        <option>Partial Masking</option>
                        <option>Date Shift</option>
                        <option>Hash</option>
                      </select>
                    </td>

                    <td className="px-4 py-3">
                      {isOverridden ? (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          User Overridden
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          AI Accepted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">AI Suggestion Logic</p>
          <p className="mt-1">
            Current MVP uses AI-assisted rule inference from column names and schema patterns.
            Later, this can be upgraded to use GenAI, Presidio, sample-value scanning, metadata,
            and business glossary context.
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

function RunStep({ onNext, onJobCreated, maskingRules, datasetId }) {
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);

  const startRun = async () => {
    try {
      setRunning(true);
      setComplete(false);
      setError(null);
      setJobId(null);
      setJobDetails(null);

      if (!datasetId) {
        setRunning(false);
        setError("Please upload, generate, or select a dataset before running anonymization.");
        return;
      }

      const runResponse = await axios.post("http://127.0.0.1:8000/jobs/run", {
        dataset_id: datasetId,
        masking_rules: maskingRules,
      });

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
            This button calls the FastAPI backend and runs the local anonymization engine.
          </p>

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
                      ? "Backend completed anonymization for the selected dataset."
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
              icon={Database}
              label="Rows Processed"
              value={jobDetails ? jobDetails.rows_processed.toLocaleString() : "Pending"}
              helper={jobDetails?.dataset_name || "Selected dataset"}
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
              value={jobDetails ? "API" : "Ready"}
              helper={jobDetails ? jobDetails.execution_mode : "Waiting to submit"}
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
          <h3 className="font-semibold text-slate-900">Backend Connected</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-4">
              React sends selected dataset ID and masking rules to FastAPI.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              FastAPI runs anonymization on uploaded or generated CSV data.
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              Later, this same API can trigger Databricks Jobs for large tables.
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

  const headers = Object.keys(rows[0]);

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
                      {String(row[header])}
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

      <div className="grid gap-5 lg:grid-cols-2">
        <PreviewTable title="Before Anonymization" rows={previewData.before} warning />
        <PreviewTable title="After Anonymization" rows={previewData.after} />
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
  activeStep,
  setActiveStep,
  currentJobId,
  setCurrentJobId,
  maskingRules,
  setMaskingRules,
  selectedDatasetId,
  setSelectedDatasetId,
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
              setSelectedDatasetId(datasetId);
              setDetectedColumns(columns);

              const selectedRules = {};
              columns.forEach((col) => {
                selectedRules[col.name] = col.rule || "No Masking";
              });

              setMaskingRules(selectedRules);
            }}
            onNext={() => setActiveStep(2)}
          />
        )}

        {activeStep === 2 && (
          <RulesStep
            detectedColumns={detectedColumns}
            onRulesChange={(rules) => setMaskingRules(rules)}
            onNext={() => setActiveStep(3)}
          />
        )}

        {activeStep === 3 && (
          <RunStep
            datasetId={selectedDatasetId}
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


function MaskingRulesPage() {
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
      table: "employee_data",
      column: "ssn",
      classification: "Highly Sensitive Identifier",
      rule: "Partial Masking",
      override: "Restricted",
      tag: "CONFIDENTIAL",
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
      action: "Partial Masking",
      example: "123-45-6789 → 12*****89",
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Masking Rules"
        description="Manage global, table-level, column-level, and conditional masking rules used during anonymization."
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
          value={tableRules.length}
          helper="Dataset-specific"
        />
        <MetricCard
          icon={ListChecks}
          label="Conditional Rules"
          value={conditionalRules.length}
          helper="Business logic"
        />
        <MetricCard
          icon={CheckCircle2}
          label="Active Rules"
          value={globalRules.length + tableRules.length + conditionalRules.length}
          helper="Available in MVP"
        />
      </div>

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
              <h2 className="text-lg font-semibold text-slate-900">Table / Column Rule Assignment</h2>
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
              These conditional rules are currently represented in the UI only. The next backend upgrade can store rule definitions and apply them during anonymization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("tdm_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [activePage, setActivePage] = useState("dashboard");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [maskingRules, setMaskingRules] = useState({});
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [detectedColumns, setDetectedColumns] = useState(sampleColumns);

  const logout = () => {
    localStorage.removeItem("tdm_user");
    setCurrentUser(null);
    setActivePage("dashboard");
    setActiveStep(1);
    setCurrentJobId(null);
    setSelectedDatasetId(null);
    setDetectedColumns(sampleColumns);
    setMaskingRules({});
  };

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const permissions = currentUser.permissions || [];

  if (!permissions.includes(activePage)) {
    setActivePage("dashboard");
  }

  const renderPage = () => {
    if (activePage === "dashboard") return <DashboardPage />;

    if (activePage === "data_inventory") return <DataInventoryPage />;

    if (activePage === "data_classification") return <DataClassificationPage />;

    if (activePage === "masking_rules") return <MaskingRulesPage />;

    if (activePage === "create_pipeline") {
      return (
        <CreatePipelinePage
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          currentJobId={currentJobId}
          setCurrentJobId={setCurrentJobId}
          maskingRules={maskingRules}
          setMaskingRules={setMaskingRules}
          selectedDatasetId={selectedDatasetId}
          setSelectedDatasetId={setSelectedDatasetId}
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