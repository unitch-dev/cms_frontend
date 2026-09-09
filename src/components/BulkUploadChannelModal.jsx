import { useState } from "react";
import * as channelsApi from "../api/channels";
import SelectDropdown from "./SelectDropdown.jsx";
import MultiSelectDropdown from "./MultiSelectDropdown.jsx";

const DEVICE_OPTIONS = ["android", "ios", "web", "smart_tv"];

function UploadCloudIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.9A5 5 0 0 1 6 5.3a6 6 0 0 1 11.6 1.8A4.5 4.5 0 0 1 17 16" />
      <path d="M12 12v9" />
      <path d="m9 15 3-3 3 3" />
    </svg>
  );
}

export default function BulkUploadChannelModal({ onClose, onSuccess }) {
  const [type, setType] = useState("deeplink");
  const [status, setStatus] = useState("active");
  const [device, setDevice] = useState([]);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const pickFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a .csv file");
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleDownloadTemplate = () => {
    const header = "channel_id,channel_image,channel_name,genre_code,logo,sequence";
    // const example = "CH001,sun_tv.png,Sun TV,GE0001;GE0004,sun_tv_logo.png,1";
    const csv = `${header}\n`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "channels_bulk_upload_template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a CSV file first");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("status", status);
      formData.append("device", JSON.stringify(device));

      const res = await channelsApi.bulkUploadChannels(formData);
      setResult(res.data.data);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{ animation: "bfadeIn 200ms ease-out" }}
        //onClick={onClose}
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0F1729] border border-neutral-200 dark:border-neutral-700 shadow-2xl"
        style={{ animation: "bpopIn 220ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <style>{`
          @keyframes bfadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes bpopIn { from { opacity: 0; transform: scale(0.94) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        `}</style>

        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
          <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Bulk upload channels
          </h2>
        <button
  onClick={onClose}
  className="h-8 w-8 rounded-full flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
>
  ✕
</button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {!result && (
            <>
              <p className="text-[12.5px] text-neutral-500 dark:text-neutral-400 -mt-1">
                Type, status &amp; device below apply to every row in the CSV. Existing channels
                (matched by <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">channel_id</code>) get updated instead of duplicated.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <SelectDropdown
                  label="Type"
                  value={type}
                  onChange={setType}
                  options={[
                    { value: "deeplink", label: "Deeplink" },
                    { value: "url", label: "URL" },
                  ]}
                />
                <SelectDropdown
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </div>

              <MultiSelectDropdown
                label="Device"
                options={DEVICE_OPTIONS}
                selected={device}
                onChange={setDevice}
              />

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 px-4 py-2.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 hover:border-[#0284C7] hover:text-[#0284C7] dark:hover:border-[#0EA5E9] dark:hover:text-[#0EA5E9] hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                ⬇ Download CSV template
              </button>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Upload CSV
                </label>
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    pickFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-all duration-200 ${
                    dragOver
                      ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7]/5 dark:bg-[#0EA5E9]/5 scale-[1.01]"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0])}
                  />
                  <span className="text-neutral-400 dark:text-neutral-500">
                    <UploadCloudIcon />
                  </span>
                  {file ? (
                    <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">{file.name}</span>
                  ) : (
                    <>
                      <span className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300">
                        Click to choose or drag &amp; drop
                      </span>
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">.csv file only</span>
                    </>
                  )}
                </label>
              </div>
            </>
          )}

          {result && (
            <div className="space-y-4" style={{ animation: "bfadeIn 200ms ease-out" }}>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  ["Total", result.total, "text-neutral-600 dark:text-neutral-300"],
                  ["Created", result.created, "text-emerald-600"],
                  ["Updated", result.updated, "text-sky-600"],
                  ["Failed", result.failed, "text-red-500"],
                ].map(([lbl, val, cls]) => (
                  <div key={lbl} className="rounded-xl border border-neutral-100 dark:border-neutral-800 py-3">
                    <div className={`text-[20px] font-extrabold ${cls}`}>{val}</div>
                    <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">{lbl}</div>
                  </div>
                ))}
              </div>

              {result.errors?.length > 0 && (
                <div className="rounded-lg border border-red-100 dark:border-red-500/20 max-h-48 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <div
                      key={i}
                      className="px-3.5 py-2.5 text-[12px] border-b last:border-b-0 border-red-100 dark:border-red-500/10"
                    >
                      <span className="font-bold text-red-500">Row {e.row}</span>{" "}
                      <span className="text-neutral-500 dark:text-neutral-400">
                        ({e.channel_id || "—"}): {e.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-5 border-t border-neutral-100 dark:border-neutral-800">
          {result ? (
            <>
              <button
                onClick={reset}
                className="rounded-full border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                Upload another
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white px-5 py-2.5 text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="rounded-full border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={uploading}
                className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white disabled:opacity-60 px-5 py-2.5 text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
              >
                {uploading ? "Uploading…" : "Upload CSV"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}