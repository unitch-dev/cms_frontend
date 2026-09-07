import { useEffect, useState } from "react";
import * as genresApi from "../api/genres";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";

const emptyForm = { name: "" };
const PALETTE = [210, 355, 265, 30, 165, 320, 45, 200];

function hueFor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] p-5">
      <div className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-5" />
      <div className="h-3.5 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    </div>
  );
}

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [viewingGenre, setViewingGenre] = useState(null);

  const load = () => {
    setLoading(true);
    genresApi
      .getGenres()
      .then((res) => setGenres(res.data.data))
      .catch(() => setError("Failed to load genres"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (genre) => {
    setEditingId(genre.id);
    setForm({ name: genre.name });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await genresApi.updateGenre(editingId, form);
      } else {
        await genresApi.createGenre(form);
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
    if (!confirm("Delete this genre? Channels referencing it may break.")) return;
    try {
      await genresApi.deleteGenre(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Genres"
        subtitle="Organize channels into browsable categories."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add genre
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && genres.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 py-20 text-center">
          <div className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200 mb-1">No genres yet</div>
          <div className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 mb-5">
            Genres group channels so viewers can browse by category.
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-neutral-900 text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            + Add genre
          </button>
        </div>
      )}

      {!loading && genres.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((g) => {
            const hue = hueFor(g.name);
            return (
              <div
                key={g.id}
                className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] p-5 transition-all hover:border-neutral-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(${hue}, 70%, 96%)` }}
                  >
                    <span className="text-[15px] font-bold" style={{ color: `hsl(${hue}, 55%, 45%)` }}>
                      {g.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(g)}
                      title="Edit"
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewingGenre(g)}
                      title="View"
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-[#0284C7] dark:hover:text-[#38BDF8] hover:bg-[#0284C7]/10 dark:hover:bg-[#0EA5E9]/15 transition-all duration-200 hover:scale-110 active:scale-95"
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

                <div className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate">{g.name}</div>
                <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 mt-0.5">ID {g.id}</div>
              </div>
            );
          })}
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
            className="relative w-full max-w-sm h-full bg-white dark:bg-[#0F1729] border-l border-neutral-200 dark:border-neutral-700 flex flex-col"
            style={{ animation: "slideIn 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
            `}</style>

            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {editingId ? "Edit genre" : "Add genre"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
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
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                  placeholder="Sports"
                />
              </div>

              <div>
                <div className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Preview</div>
                <div className="flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `hsl(${hueFor(form.name || "?")}, 70%, 92%)` }}
                  >
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: `hsl(${hueFor(form.name || "?")}, 55%, 40%)` }}
                    >
                      {(form.name || "?").slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[13px] font-semibold text-neutral-700 dark:text-neutral-200">
                    {form.name || "Genre name"}
                  </span>
                </div>
              </div>
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
                  {saving ? "Saving…" : "Save genre"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingGenre && (
        <ViewModal
          title={viewingGenre.name}
          subtitle={`Genre ID ${viewingGenre.id}`}
          fields={[
            { label: "Name", value: viewingGenre.name },
            { label: "ID", value: viewingGenre.id },
          ]}
          onClose={() => setViewingGenre(null)}
          onEdit={() => {
            setViewingGenre(null);
            openEdit(viewingGenre);
          }}
        />
      )}
    </div>
  );
}
