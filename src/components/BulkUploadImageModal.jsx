import { useState } from "react";
import * as channelsApi from "../api/channels";

export default function BulkUploadImageModal({ onClose }) {
  const [mode, setMode] = useState("zip"); // "zip" | "images"
  const [zipFile, setZipFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (mode === "zip") {
      const f = files.find((f) => f.name.toLowerCase().endsWith(".zip"));
      if (f) setZipFile(f);
    } else {
      setImageFiles((prev) => [...prev, ...files.filter((f) => /\.(png|jpe?g)$/i.test(f.name))]);
    }
  };

  const handleSubmit = async () => {
    if (mode === "zip" && !zipFile) return setError("Please choose a .zip file");
    if (mode === "images" && imageFiles.length === 0) return setError("Please choose at least one image");

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("subfolder", "channels");
      if (mode === "zip") {
        formData.append("zip", zipFile);
      } else {
        imageFiles.forEach((f) => formData.append("images", f));
      }
      const res = await channelsApi.bulkUploadImages(formData);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Bulk image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setZipFile(null);
    setImageFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        style={{ animation: "bfadeIn 200ms ease-out" }}
        onClick={onClose}
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
            Bulk upload images
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
                Filenames are kept as-is (e.g. <code className="px-1 rounded bg-neutral-100 dark:bg-neutral-800">sun_tv.png</code>) The File Size Must Be in Below 5mb
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  ["zip", "Zip file"],
                  ["images", "Multiple images"],
                ].map(([m, lbl]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(null); }}
                    className={`rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${
                      mode === m
                        ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7] dark:bg-[#0EA5E9] text-white"
                        : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <label
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7]/5 dark:bg-[#0EA5E9]/5 scale-[1.01]"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/30"
                }`}
              >
                <input
                  type="file"
                  accept={mode === "zip" ? ".zip" : "image/png,image/jpeg"}
                  multiple={mode === "images"}
                  className="hidden"
                  onChange={(e) => {
                    if (mode === "zip") setZipFile(e.target.files?.[0] || null);
                    else setImageFiles(Array.from(e.target.files || []));
                  }}
                />
                {mode === "zip" ? (
                  zipFile ? (
                    <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">{zipFile.name}</span>
                  ) : (
                    <span className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300">
                      Click to choose or drag &amp; drop a .zip
                    </span>
                  )
                ) : imageFiles.length > 0 ? (
                  <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                    {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected
                  </span>
                ) : (
                  <span className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300">
                    Click to choose or drag &amp; drop images
                  </span>
                )}
              </label>
            </>
          )}

          {result && (
            <div className="space-y-4" style={{ animation: "bfadeIn 200ms ease-out" }}>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-neutral-100 dark:border-neutral-800 py-3">
                  <div className="text-[20px] font-extrabold text-emerald-600">{result.savedCount}</div>
                  <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Saved</div>
                </div>
                <div className="rounded-xl border border-neutral-100 dark:border-neutral-800 py-3">
                  <div className="text-[20px] font-extrabold text-red-500">{result.skippedCount}</div>
                  <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">Skipped</div>
                </div>
              </div>

              {result.skipped?.length > 0 && (
                <div className="rounded-lg border border-red-100 dark:border-red-500/20 max-h-48 overflow-y-auto">
                  {result.skipped.map((s, i) => (
                    <div key={i} className="px-3.5 py-2.5 text-[12px] border-b last:border-b-0 border-red-100 dark:border-red-500/10">
                      <span className="font-bold text-neutral-600 dark:text-neutral-300">{s.name}</span>{" "}
                      <span className="text-neutral-400">— {s.reason}</span>
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
                Upload more
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
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}