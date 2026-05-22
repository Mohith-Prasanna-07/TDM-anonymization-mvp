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
} from "lucide-react";

function Card({ children, className = "" }) {
  return <div className={`bg-white border border-slate-200 ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function Button({ children, onClick, disabled, variant = "default", className = "" }) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
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

const steps = [
  { id: 1, label: "Source", icon: Database },
  { id: 2, label: "Rules", icon: Settings },
  { id: 3, label: "Run", icon: Play },
  { id: 4, label: "Review", icon: Eye },
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

function SideMenu({ activeStep }) {
  const menuItems = [
    {
      label: "Extraction",
      description: "Upload or generate source data",
      icon: Database,
      active: activeStep === 1,
      completed: activeStep > 1,
    },
    {
      label: "Anonymization",
      description: "Configure rules and run masking",
      icon: Shield,
      active: activeStep === 2 || activeStep === 3,
      completed: activeStep > 3,
    },
    {
      label: "Publish",
      description: "Review, audit, and download output",
      icon: Send,
      active: activeStep === 4,
      completed: false,
    },
  ];

  return (
    <aside className="w-full rounded-3xl bg-slate-950 p-5 text-white shadow-sm lg:min-h-screen lg:w-80">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-3">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">TDM Workflow</p>
          <h2 className="text-xl font-semibold text-white">Control Panel</h2>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className={`rounded-2xl border p-4 transition ${
                item.active
                  ? "border-white bg-white text-slate-950"
                  : item.completed
                  ? "border-emerald-400/40 bg-emerald-400/10 text-white"
                  : "border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-xl p-2 ${item.active ? "bg-slate-100" : "bg-white/10"}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className={`mt-1 text-xs ${item.active ? "text-slate-500" : "text-slate-400"}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">MVP Scope</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Supports CSV extraction, synthetic test data generation, configurable anonymization,
          audit preview, job history, masked output download, and assistant support.
        </p>
      </div>
    </aside>
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
      {steps.map((step) => {
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
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null);
  const [testTemplate, setTestTemplate] = useState("customer");
  const [rowCount, setRowCount] = useState(100);

  const handleDatasetReady = (responseData, displayName) => {
    setSelectedFileName(displayName);

    onDatasetUploaded({
      datasetId: responseData.dataset_id,
      columns: Array.isArray(responseData.columns) ? responseData.columns : sampleColumns,
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
              <p className="text-sm text-slate-500">Upload or generate data for anonymization.</p>
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

            <label className="text-sm font-medium text-slate-700">Selected Dataset</label>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none">
              <option>{selectedFileName || "Upload or generate a dataset"}</option>
            </select>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-semibold text-slate-900">CSV</p>
                <p className="text-xs text-slate-500">Source Type</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">Auto</p>
                <p className="text-xs text-slate-500">Schema Detection</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-slate-900">Rules</p>
                <p className="text-xs text-slate-500">Suggested</p>
              </div>
            </div>
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
            Upload a CSV file and the backend will detect columns and suggest masking rules.
          </p>

          <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50">
            {uploading ? "Uploading..." : "Choose CSV File"}
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={uploading} />
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
              <h3 className="text-lg font-semibold text-slate-900">Generate Test Data</h3>
              <p className="text-sm text-slate-500">Create synthetic data for demo and testing.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="text-sm font-medium text-slate-700">Template</label>
            <select
              value={testTemplate}
              onChange={(e) => setTestTemplate(e.target.value)}
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
              onChange={(e) => setRowCount(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
          </div>

          <Button onClick={handleGenerateTestData} disabled={generating} className="mt-6 w-full rounded-xl">
            {generating ? "Generating..." : "Generate Test Data"}
          </Button>
        </CardContent>
      </Card>

      {(selectedFileName || uploadMessage || uploadError) && (
        <Card className="rounded-2xl shadow-sm lg:col-span-3">
          <CardContent className="p-5">
            {selectedFileName && (
              <p className="text-sm text-slate-600">
                Selected dataset: <span className="font-medium text-slate-900">{selectedFileName}</span>
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
    Array.isArray(detectedColumns) && detectedColumns.length > 0 ? detectedColumns : sampleColumns;

  const [columns, setColumns] = useState(safeDetectedColumns);

  useEffect(() => {
    const safeColumns =
      Array.isArray(detectedColumns) && detectedColumns.length > 0 ? detectedColumns : sampleColumns;

    setColumns(safeColumns);
  }, [detectedColumns]);

  useEffect(() => {
    const selectedRules = {};

    columns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  }, [columns, onRulesChange]);

  const updateRule = (name, rule) => {
    const updatedColumns = columns.map((col) => (col.name === name ? { ...col, rule } : col));

    setColumns(updatedColumns);

    const selectedRules = {};
    updatedColumns.forEach((col) => {
      selectedRules[col.name] = col.rule || "No Masking";
    });

    onRulesChange(selectedRules);
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Configure Masking Rules</h2>
            <p className="text-sm text-slate-500">Review detected columns and assign anonymization rules.</p>
          </div>

          <Button variant="outline" className="rounded-xl">
            Auto Detect PII
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Column</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">PII</th>
                <th className="px-4 py-3 font-medium">Masking Rule</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {columns.map((col) => (
                <tr key={col.name} className="bg-white">
                  <td className="px-4 py-3 font-medium text-slate-900">{col.name}</td>

                  <td className="px-4 py-3 text-slate-600">{col.type || "unknown"}</td>

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
                </tr>
              ))}
            </tbody>
          </table>
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

function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I’m your TDM Assistant. Ask me about detected columns, PII fields, masking rules, job status, audit summary, or Databricks scaling.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: userText,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: userText,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: response.data.response,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "I could not connect to the backend assistant. Please make sure FastAPI is running.",
        },
      ]);
    }

    setLoading(false);
  };

  const quickQuestions = [
    "What columns were detected?",
    "Which columns are PII?",
    "What masking rules are suggested?",
    "What is the latest job status?",
    "How can this scale with Databricks?",
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">TDM Assistant</h2>
                <p className="text-xs text-slate-500">Ask about data, rules, jobs, and audit</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              ✕
            </button>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-100"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Ask about this TDM run..."
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none"
              />

              <Button onClick={sendMessage} disabled={loading} className="rounded-xl">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-2xl transition hover:bg-slate-800"
      >
        <Shield className="h-5 w-5" />
        {isOpen ? "Close Assistant" : "Ask TDM Assistant"}
      </button>
    </>
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

export default function App() {
  const [activeStep, setActiveStep] = useState(1);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [maskingRules, setMaskingRules] = useState({});
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [detectedColumns, setDetectedColumns] = useState(sampleColumns);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="grid gap-6 p-4 lg:grid-cols-[320px_1fr] lg:p-6">
        <SideMenu activeStep={activeStep} />

        <main className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-slate-900 p-4 text-white">
                  <Shield className="h-8 w-8" />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                    TDM Modernization MVP
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-4xl">
                    Data Anonymization Control Center
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm text-slate-500 md:text-base">
                    Demo interface for extraction, test data generation, schema detection,
                    configurable anonymization, audit review, job history, and assistant support.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                MVP Demo Mode
              </div>
            </div>
          </motion.div>

          <DashboardSummary />

          <WorkflowProgress activeStep={activeStep} />

          <Stepper activeStep={activeStep} />

          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Demo Navigation</p>
              <p className="text-xs text-slate-500">
                Move between steps or reset the MVP flow for a clean client walkthrough.
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
                Reset Demo
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

          <ChatAssistant />

          <JobHistory />
        </main>
      </div>
    </div>
  );
}