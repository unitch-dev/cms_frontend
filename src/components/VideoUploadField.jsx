import { useEffect, useRef, useState } from "react";

const MAX_MB = 200;

export default function VideoUploadField({ label = "Video", value, onChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(typeof value === "string" && value ? value : null); // existing video URL
  }, [value]);

  const pick = (file) => {
    if (!file) return;
    if (!/\.(mp4|mov|webm|mkv)$/i.test(file.name)) return setErr("Only MP4, MOV, WebM or MKV allowed");
    if (file.size > MAX_MB * 1024 * 1024) return setErr(`Video must be ${MAX_MB}MB or smaller`);
    setErr("");
    onChange(file);
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">{label}</label>

      {preview && <video src={preview} controls className="w-full rounded-lg bg-black mb-2 max-h-52" />}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          pick(e.dataTransfer.files?.[0]);
        }}
        className="cursor-pointer rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/40 p-4 flex items-center gap-3 hover:border-[#0284C7] transition-colors"
      >
        <div className="h-11 w-11 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-neutral-400">
            <path d="M3.5 5A1.5 1.5 0 002 6.5v7A1.5 1.5 0 003.5 15h8a1.5 1.5 0 001.5-1.5v-1.6l3.3 2.2a.75.75 0 001.2-.6V5.5a.75.75 0 00-1.2-.6L13 7.1V6.5A1.5 1.5 0 0011.5 5h-8z" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-100 truncate">
            {value instanceof File ? value.name : preview ? "Click to replace the video" : "Click or drop a video"}
          </div>
          <div className="text-[11px] font-semibold text-neutral-400">
            {value instanceof File
              ? `${(value.size / 1024 / 1024).toFixed(1)} MB`
              : `MP4 (H.264 + AAC) recommended, up to ${MAX_MB}MB`}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.webm,.mkv,video/*"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {err && <div className="text-[12px] font-medium text-red-500 mt-1.5">{err}</div>}
    </div>
  );
}