import { useEffect, useState } from "react";
import * as bannersApi from "../api/banners";
import ImageUploadField from "../components/ImageUploadField.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";

/**
 * The Flutter app stores/expects colors as "0xFFRRGGBB" (ARGB hex with a
 * 0x prefix), but a standard HTML <input type="color"> only understands
 * "#RRGGBB". These convert between the two so the admin UI can use a
 * normal color picker while the data saved back stays Flutter-compatible.
 */
function toHexColor(value) {
  if (!value) return "#3B5FE0";
  const match = /^0x[0-9a-fA-F]{2}([0-9a-fA-F]{6})$/.exec(value);
  if (match) return `#${match[1]}`;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value;
  return "#3B5FE0";
}

function toFlutterColor(hex, originalAlpha = "FF") {
  const clean = (hex || "#3B5FE0").replace("#", "").toUpperCase();
  return `0x${originalAlpha}${clean}`;
}

const emptyForm = {
  title: "",
  subtitle: "",
  color: "#3B5FE0",
  colorAlpha: "FF",
  channel_id: "",
  status: "active",
  imagePath: null,
};

function StatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isActive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden">
      <div className="aspect-[21/9] bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <div className="p-4">
        <div className="h-3.5 w-28 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-2" />
        <div className="h-3 w-40 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [viewingBanner, setViewingBanner] = useState(null);

  const load = () => {
    setLoading(true);
    bannersApi
      .getBanners()
      .then((res) => setBanners(res.data.data))
      .catch(() => setError("Failed to load banners"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (banner) => {
    setEditingId(banner.id);
    const rawColor = banner.color || "0xFF3B5FE0";
    const alphaMatch = /^0x([0-9a-fA-F]{2})/.exec(rawColor);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      color: toHexColor(rawColor),
      colorAlpha: alphaMatch ? alphaMatch[1].toUpperCase() : "FF",
      channel_id: banner.channel_id || "",
      status: banner.status || "active",
      imagePath: banner.imagePath || null,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        color: toFlutterColor(form.color, form.colorAlpha),
        channel_id: form.channel_id,
        status: form.status,
      };
      if (form.imagePath instanceof File) payload.imagePath = form.imagePath;

      if (editingId) {
        await bannersApi.updateBanner(editingId, payload);
      } else {
        await bannersApi.createBanner(payload);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await bannersApi.deleteBanner(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Banners"
        subtitle="Manage the promotional banners shown on the home screen."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add banner
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && banners.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 py-20 text-center">
          <div className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200 mb-1">No banners yet</div>
          <div className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 mb-5">
            Add a banner to promote a channel on the home screen.
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-neutral-900 text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            + Add banner
          </button>
        </div>
      )}

      {!loading && banners.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden transition-all hover:border-neutral-300 hover:-translate-y-0.5"
            >
              <div
                className="relative aspect-[21/9] overflow-hidden flex items-end p-4"
                style={{ backgroundColor: toHexColor(b.color) }}
              >
                {b.imagePath && (
                  <img
                    src={b.imagePath}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="relative">
                  <div className="text-white text-[16px] font-bold drop-shadow">{b.title}</div>
                  {b.subtitle && (
                    <div className="text-white/80 text-[12px] font-medium drop-shadow">{b.subtitle}</div>
                  )}
                </div>

                <div className="absolute top-2.5 left-2.5">
                  <StatusPill status={b.status} />
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(b)}
                    title="Edit"
                    className="h-8 w-8 rounded-lg bg-white dark:bg-[#0F1729]/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewingBanner(b)}
                    title="View"
                    className="h-8 w-8 rounded-lg bg-white dark:bg-[#0F1729]/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path
                        fillRule="evenodd"
                        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <span className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500">
                  Channel: <span className="text-neutral-600 dark:text-neutral-300 font-semibold">{b.channel_id}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            style={{ animation: "fadeIn 200ms ease-out" }}
            onClick={() => setShowForm(false)}
          />
          <div
            className="relative w-full max-w-md h-full bg-white dark:bg-[#0F1729] border-l border-neutral-200 dark:border-neutral-700 flex flex-col"
            style={{ animation: "slideIn 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
            `}</style>

            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {editingId ? "Edit banner" : "Add banner"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 001.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Live preview */}
              <div
                className="relative aspect-[21/9] rounded-xl overflow-hidden flex items-end p-3.5"
                style={{ backgroundColor: form.color }}
              >
                {form.imagePath && (
                  <img
                    src={form.imagePath instanceof File ? URL.createObjectURL(form.imagePath) : form.imagePath}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="relative">
                  <div className="text-white text-[14px] font-bold drop-shadow">{form.title || "Banner title"}</div>
                  {form.subtitle && (
                    <div className="text-white/80 text-[11px] font-medium drop-shadow">{form.subtitle}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Subtitle <span className="font-normal text-neutral-400 dark:text-neutral-500">(optional)</span>
                </label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Background color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="h-10 w-14 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                  />
                  <input
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="flex-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Channel ID</label>
                <input
                  required
                  value={form.channel_id}
                  onChange={(e) => setForm({ ...form, channel_id: e.target.value })}
                  placeholder="e.g. sun_tv"
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, status: s })}
                      className={`rounded-lg border px-3.5 py-2.5 text-[13px] font-semibold capitalize transition-colors ${
                        form.status === s
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploadField
                label="Image"
                value={form.imagePath}
                onChange={(file) => setForm({ ...form, imagePath: file })}
              />
            </form>

            <div className="flex items-center justify-between gap-2.5 px-6 py-5 border-t border-neutral-100 dark:border-neutral-800">
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    handleDelete(editingId);
                  }}
                  className="rounded-full border border-red-200 dark:border-red-500/30 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white disabled:opacity-60 px-5 py-2.5 text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {saving ? "Saving…" : "Save banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingBanner && (
        <ViewModal
          title={viewingBanner.title}
          subtitle={`Banner ID ${viewingBanner.id}`}
          images={[{ label: "image", src: viewingBanner.imagePath }]}
          fields={[
            { label: "Title", value: viewingBanner.title },
            { label: "Subtitle", value: viewingBanner.subtitle || "—" },
            { label: "Channel ID", value: viewingBanner.channel_id },
            {
              label: "Status",
              value: (
                <span className={viewingBanner.status === "active" ? "text-emerald-600" : "text-red-500"}>
                  {viewingBanner.status === "active" ? "Active" : "Inactive"}
                </span>
              ),
            },
            {
              label: "Color",
              value: (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-neutral-300 dark:border-neutral-600"
                    style={{ backgroundColor: toHexColor(viewingBanner.color) }}
                  />
                  {viewingBanner.color}
                </span>
              ),
            },
          ]}
          onClose={() => setViewingBanner(null)}
          onEdit={() => {
            setViewingBanner(null);
            openEdit(viewingBanner);
          }}
        />
      )}
    </div>
  );
}
