import { useRef, useState, useEffect } from "react";

/**
 * value: either a File (freshly picked, not yet uploaded) or a string URL
 * (the existing image already on the server) or "" / null.
 * onChange(file: File | null) — passes the picked File up; parent decides
 * how to send it (see api/formData.js toRequestPayload).
 */
export default function ImageUploadField({ label, value, onChange, accept = "image/png,image/jpeg" }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (typeof value === "string" && value) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFile = (file) => {
    if (!file) return;
    onChange(file);
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
        {label}
      </label>
      <div
        className="flex items-center gap-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-3 transition-colors hover:border-neutral-400 dark:hover:border-neutral-500 cursor-pointer"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <div className="h-12 w-12 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-neutral-300">
              <path
                fillRule="evenodd"
                d="M4 3.75A2.75 2.75 0 016.75 1h6.5A2.75 2.75 0 0116 3.75v12.5A2.75 2.75 0 0113.25 19h-6.5A2.75 2.75 0 014 16.25V3.75zm5-.25a.5.5 0 100 1h2a.5.5 0 100-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
            {value instanceof File ? value.name : previewUrl ? "Change image" : "Click or drop an image"}
          </div>
          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">PNG or JPG, up to 5MB</div>
        </div>
        {previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
