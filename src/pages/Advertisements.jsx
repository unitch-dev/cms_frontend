import { useEffect, useState } from "react";
import * as adsApi from "../api/advertisements";
import ImageUploadField from "../components/ImageUploadField.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";

const emptyForm = { title: "", desc: "", status: "active", image: null };

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
      <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <div className="p-4">
        <div className="h-3.5 w-28 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-2" />
        <div className="h-3 w-40 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}

export default function Advertisements() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [viewingAd, setViewingAd] = useState(null);

  const load = () => {
    setLoading(true);
    adsApi
      .getAdvertisements()
      .then((res) => setAds(res.data.data))
      .catch(() => setError("Failed to load advertisements"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (ad) => {
    setEditingId(ad.id);
    setForm({
      title: ad.title,
      desc: ad.desc || "",
      status: ad.status || "active",
      image: ad.image || null,
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { title: form.title, desc: form.desc, status: form.status };
      if (form.image instanceof File) payload.image = form.image;

      if (editingId) {
        await adsApi.updateAdvertisement(editingId, payload);
      } else {
        await adsApi.createAdvertisement(payload);
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
    if (!confirm("Delete this advertisement?")) return;
    try {
      await adsApi.deleteAdvertisement(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Advertisements"
        subtitle="Manage creative banners shown across the platform."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add advertisement
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && ads.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 py-20 text-center">
          <div className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200 mb-1">No advertisements yet</div>
          <div className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 mb-5">
            Add a creative banner to start running promotions.
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-neutral-900 text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            + Add advertisement
          </button>
        </div>
      )}

      {!loading && ads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((a) => (
            <div
              key={a.id}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden transition-all hover:border-neutral-300 hover:-translate-y-0.5"
            >
              <div className="relative aspect-[16/9] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                {a.image ? (
                  <img
                    src={a.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-8 w-8 text-neutral-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18-12h16.5v16.5H2.25V4.5zM6 6.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z"
                      />
                    </svg>
                  </div>
                )}

                <div className="absolute top-2.5 left-2.5">
                  <StatusPill status={a.status} />
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(a)}
                    title="Edit"
                    className="h-8 w-8 rounded-lg bg-white dark:bg-[#0F1729]/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewingAd(a)}
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

              <div className="p-4">
                <div className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate mb-1">{a.title}</div>
                {a.desc ? (
                  <p className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500 line-clamp-2">{a.desc}</p>
                ) : (
                  <span className="text-[12px] font-medium text-neutral-300">No description</span>
                )}
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
                {editingId ? "Edit advertisement" : "Add advertisement"}
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

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                  placeholder="Summer promo banner"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Description <span className="font-normal text-neutral-400 dark:text-neutral-500">(optional)</span>
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors resize-none"
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
                value={form.image}
                onChange={(file) => setForm({ ...form, image: file })}
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
                  {saving ? "Saving…" : "Save advertisement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingAd && (
        <ViewModal
          title={viewingAd.title}
          subtitle={`Advertisement ID ${viewingAd.id}`}
          images={[{ label: "image", src: viewingAd.image }]}
          fields={[
            { label: "Title", value: viewingAd.title },
            {
              label: "Status",
              value: (
                <span className={viewingAd.status === "active" ? "text-emerald-600" : "text-red-500"}>
                  {viewingAd.status === "active" ? "Active" : "Inactive"}
                </span>
              ),
            },
            { label: "Description", value: viewingAd.desc || "—" },
          ]}
          onClose={() => setViewingAd(null)}
          onEdit={() => {
            setViewingAd(null);
            openEdit(viewingAd);
          }}
        />
      )}
    </div>
  );
}
