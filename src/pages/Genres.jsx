import { useEffect, useMemo, useState } from "react";
import * as genresApi from "../api/genres";
import * as channelsApi from "../api/channels";
import ChannelThumb from "../components/ChannelThumb.jsx";
import StatusPill from "../components/StatusPill.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { SearchIcon, CloseIcon } from "../components/TableIcons.jsx";

const emptyForm = { name: "", genre_sequence: "" };
const PALETTE = [210, 355, 265, 30, 165, 320, 45, 200];

function hueFor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return PALETTE[sum % PALETTE.length];
}

const THEMES = [
  { from: "#FEF3C7", to: "#FDE68A", chip: "#F59E0B", text: "#92400E" }, // amber
  { from: "#CCFBF1", to: "#99F6E4", chip: "#0D9488", text: "#115E59" }, // teal
  { from: "#FFEDD5", to: "#FED7AA", chip: "#EA580C", text: "#9A3412" }, // orange
  { from: "#FCE7F3", to: "#FBCFE8", chip: "#DB2777", text: "#9D174D" }, // pink
  { from: "#EDE9FE", to: "#DDD6FE", chip: "#7C3AED", text: "#5B21B6" }, // violet
  { from: "#DBEAFE", to: "#BFDBFE", chip: "#2563EB", text: "#1E40AF" }, // blue
  { from: "#D1FAE5", to: "#A7F3D0", chip: "#059669", text: "#065F46" }, // emerald
  { from: "#FEE2E2", to: "#FECACA", chip: "#DC2626", text: "#991B1B" }, // red
];

function themeFor(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return THEMES[sum % THEMES.length];
}

function channelGenreIds(channel) {
  return Array.isArray(channel.genre_id) ? channel.genre_id : channel.genre_id != null ? [channel.genre_id] : [];
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] p-5">
      <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-5" />
      <div className="h-3.5 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-2" />
      <div className="h-3 w-16 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    </div>
  );
}

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Sequence-number conflict handling
  const [conflictGenre, setConflictGenre] = useState(null);
  const [shiftConfirm, setShiftConfirm] = useState(false);

  // Genre -> channels modal
  const [openGenre, setOpenGenre] = useState(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [addingBulk, setAddingBulk] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([genresApi.getGenres(), channelsApi.getChannels()])
      .then(([genRes, chRes]) => {
        setGenres(genRes.data.data);
        setChannels(chRes.data.data);
      })
      .catch(() => setError("Failed to load genres"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setConflictGenre(null);
    setShiftConfirm(false);
    setShowForm(true);
  };

  const openEdit = (genre) => {
    setEditingId(genre.id);
    setForm({ name: genre.name, genre_sequence: genre.genre_sequence ?? "" });
    setError(null);
    setConflictGenre(null);
    setShiftConfirm(false);
    setShowForm(true);
  };

  const handleSequenceChange = (value) => {
    setForm({ ...form, genre_sequence: value });
    setConflictGenre(null);
    setShiftConfirm(false);
    setError(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    form.genre_sequence === "" ||
    form.genre_sequence === null ||
    form.genre_sequence === undefined
  ) {
    setError("Sequence number is required");
    return;
  }

  const newSeq = Number(form.genre_sequence);

  const currentGenre = editingId
    ? genres.find((g) => g.id === editingId)
    : null;

  const oldSeq = currentGenre
    ? Number(currentGenre.genre_sequence)
    : null;

  const clash = genres.find(
    (g) =>
      Number(g.genre_sequence) === newSeq &&
      g.id !== editingId
  );

  if (clash && !shiftConfirm) {
    setConflictGenre(clash);

    setError(
      editingId
        ? `Sequence #${newSeq} is already assigned to "${clash.name}". Tick the checkbox to move it.`
        : `Sequence #${newSeq} is already assigned to "${clash.name}". Tick the checkbox to move it and shift the remaining genres.`
    );

    return;
  }

  setSaving(true);
  setError(null);

  try {
   
    if (editingId) {
      if (oldSeq === newSeq) {
        await genresApi.updateGenre(editingId, {
          ...form,
          genre_sequence: newSeq,
        });
      } else {
       
        const reorderedGenres = [...genres]
          .filter((g) => g.id !== editingId)
          .sort(
            (a, b) =>
              Number(a.genre_sequence) -
              Number(b.genre_sequence)
          );

        const targetIndex = Math.max(
          0,
          Math.min(newSeq - 1, reorderedGenres.length)
        );

        reorderedGenres.splice(targetIndex, 0, {
          ...currentGenre,
          ...form,
          genre_sequence: newSeq,
        });

      
        for (let i = 0; i < reorderedGenres.length; i++) {
          const genre = reorderedGenres[i];

          await genresApi.updateGenre(genre.id, {
            name: genre.name,
            genre_sequence: 100000 + i + 1,
          });
        }

      
        for (let i = 0; i < reorderedGenres.length; i++) {
          const genre = reorderedGenres[i];

          await genresApi.updateGenre(genre.id, {
            name:
              genre.id === editingId
                ? form.name
                : genre.name,

            genre_sequence: i + 1,
          });
        }
      }
    }

    else {
      if (clash && shiftConfirm) {
        const toShift = [...genres]
          .filter(
            (g) =>
              Number(g.genre_sequence) >= newSeq
          )
          .sort(
            (a, b) =>
              Number(b.genre_sequence) -
              Number(a.genre_sequence)
          );

        for (let i = 0; i < toShift.length; i++) {
          const genre = toShift[i];

          await genresApi.updateGenre(genre.id, {
            name: genre.name,
            genre_sequence: 200000 + i + 1,
          });
        }

        for (let i = 0; i < toShift.length; i++) {
          const genre = toShift[i];

          await genresApi.updateGenre(genre.id, {
            name: genre.name,
            genre_sequence: newSeq + i + 1,
          });
        }
      }
      await genresApi.createGenre({
        ...form,
        genre_sequence: newSeq,
      });
    }
    setShowForm(false);
    setConflictGenre(null);
    setShiftConfirm(false);

    load();

  } catch (err) {
    setError(
      err.response?.data?.message ||
      err.message ||
      "Save failed"
    );
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

  const channelsInGenre = (genreId) => channels.filter((c) => channelGenreIds(c).includes(genreId));

  const openGenreChannels = (genre) => {
    setOpenGenre(genre);
    setShowAddPicker(false);
    setPickerSearch("");
    setSelectedIds(new Set());
    setError(null);
  };

  const closeGenreModal = () => {
    setOpenGenre(null);
    setShowAddPicker(false);
    setSelectedIds(new Set());
  };

  const currentGenreChannels = useMemo(
    () => (openGenre ? channelsInGenre(openGenre.id) : []),
    [openGenre, channels],
  );
  const currentGenreChannelIds = useMemo(
    () => new Set(currentGenreChannels.map((c) => c.id)),
    [currentGenreChannels],
  );

  const pickerChannels = channels.filter((c) => c.channel_name?.toLowerCase().includes(pickerSearch.toLowerCase()));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkAdd = async () => {
    if (!openGenre || selectedIds.size === 0) return;
    setAddingBulk(true);
    setError(null);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) => {
          const channel = channels.find((c) => c.id === id);
          if (!channel) return Promise.resolve();
          const existingGenreIds = channelGenreIds(channel);
          const genre_id = existingGenreIds.includes(openGenre.id)
            ? existingGenreIds
            : [...existingGenreIds, openGenre.id];
          const payload = {
            channel_name: channel.channel_name,
            channel_id: channel.channel_id,
            type: channel.type || "deeplink",
            status: channel.status || "active",
            genre_id,
            device: channel.device || [],
            desc: channel.desc || "",
          };
          if (channel.sequence != null && channel.sequence !== "") payload.sequence = Number(channel.sequence);
          return channelsApi.updateChannel(channel.id, payload);
        }),
      );
      const chRes = await channelsApi.getChannels();
      setChannels(chRes.data.data);
      setSelectedIds(new Set());
      setShowAddPicker(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add channels");
    } finally {
      setAddingBulk(false);
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

      {error && !openGenre && !showForm && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {genres.map((g) => {
            const theme = themeFor(g.name);
            const count = channelsInGenre(g.id).length;
            return (
              <div
                key={g.id}
                onClick={() => openGenreChannels(g)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openGenreChannels(g)}
                className="group relative cursor-pointer overflow-hidden rounded-xl p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                style={{
                  background: `linear-gradient(120deg, ${theme.from} 0%, ${theme.to} 100%)`,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.06)",
                }}
              >
                <div className="relative flex items-start gap-2">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: "rgba(255,255,255,0.65)" }}
                  >
                    <span className="text-[13px] font-extrabold" style={{ color: theme.chip }}>
                      {g.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <div
                      className="text-[14px] font-extrabold tracking-wide uppercase truncate"
                      style={{ color: theme.text }}
                    >
                      {g.name}
                    </div>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {g.genre_code && (
                        <div
                          className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-bold tracking-wide"
                          style={{ backgroundColor: "rgba(255,255,255,0.6)", color: theme.text }}
                        >
                          {g.genre_code}
                        </div>
                      )}
                      {g.genre_sequence != null && (
                        <div
                          className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-bold tracking-wide"
                          style={{ backgroundColor: "rgba(255,255,255,0.6)", color: theme.text }}
                        >
                          #{g.genre_sequence}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold mt-1" style={{ color: theme.text, opacity: 0.75 }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0">
                        <path d="M4 5a2 2 0 012-2h2.379a1 1 0 01.707.293l1.121 1.121A1 1 0 0010.914 4.5H14a2 2 0 012 2v.5H4V5z" />
                        <path
                          fillRule="evenodd"
                          d="M2 8.5A1.5 1.5 0 013.5 7h13A1.5 1.5 0 0118 8.5V14a2 2 0 01-2 2H4a2 2 0 01-2-2V8.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {count} {count === 1 ? "Channel" : "Channels"}
                    </div>
                  </div>
                </div>

                {/* edit / delete — fade in on hover */}
                <div
                  className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openEdit(g)}
                    title="Edit"
                    className="h-5 w-5 rounded-md flex items-center justify-center text-neutral-500 bg-white/70 hover:bg-white hover:text-amber-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    title="Delete"
                    className="h-5 w-5 rounded-md flex items-center justify-center text-neutral-500 bg-white/70 hover:bg-white hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* open-channel affordance, bottom-right */}
                <div className="relative flex justify-end mt-2">
                  <span
                    className="h-5 w-5 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5"
                    style={{ backgroundColor: "rgba(255,255,255,0.85)", color: theme.chip }}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-2.5 w-2.5">
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / edit genre drawer */}
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
              @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
            `}</style>

            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {editingId ? "Edit genre" : "Add genre"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {error && showForm && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                  placeholder="Enter Genre Name"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Sequence number</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={form.genre_sequence}
                  onChange={(e) => handleSequenceChange(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                  placeholder="Enter number"
                />
              </div>

              {conflictGenre && (
                <label className="flex items-start gap-2.5 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3.5 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftConfirm}
                    onChange={(e) => setShiftConfirm(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 accent-amber-600 shrink-0"
                  />
                  <span className="text-[12.5px] font-medium text-amber-800 dark:text-amber-300 leading-snug">
                    Move <strong>{conflictGenre.name}</strong> (currently #{conflictGenre.genre_sequence}) — and only the
                    genres between it and the new position — so #{form.genre_sequence} becomes free for this genre.
                  </span>
                </label>
              )}

              <div>
                <div className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Preview</div>
                <div className="flex items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, hsl(${hueFor(form.name || "?")},75%,55%) 0%, hsl(${hueFor(form.name || "?") + 25},75%,45%) 100%)` }}
                  >
                    <span className="text-[13px] font-bold text-white">{(form.name || "?").slice(0, 1).toUpperCase()}</span>
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
                  disabled={saving || (conflictGenre && !shiftConfirm)}
                  className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white disabled:opacity-60 px-5 py-2.5 text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {saving ? "Saving…" : "Save genre"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genre channels modal: shows channels in genre, + Add channels picker with multi-select */}
      {openGenre && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ animation: "fadeIn 180ms ease-out" }}
            onClick={closeGenreModal}
          />
          <div
            className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#0F1729] border border-neutral-200 dark:border-neutral-700"
            style={{ animation: "popIn 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
            `}</style>

            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hueFor(openGenre.name)},75%,55%) 0%, hsl(${hueFor(openGenre.name) + 25},75%,45%) 100%)`,
                  }}
                >
                  <span className="text-[13px] font-bold text-white">{openGenre.name.slice(0, 1).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-bold text-neutral-900 dark:text-white truncate">{openGenre.name}</h2>
                  <p className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500">
                    {openGenre.genre_code ? `${openGenre.genre_code} · ` : ""}
                    {currentGenreChannels.length} {currentGenreChannels.length === 1 ? "channel" : "channels"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeGenreModal}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
              >
                <CloseIcon />
              </button>
            </div>

            {!showAddPicker ? (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3">
                  {error && (
                    <div className="mx-2 mb-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  {currentGenreChannels.length === 0 && (
                    <div className="px-4 py-10 text-center">
                      <div className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                        No channels in this genre yet
                      </div>
                      <div className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500">
                        Add channels from your channel list to feature them here.
                      </div>
                    </div>
                  )}
                  {currentGenreChannels.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <ChannelThumb src={c.logo || c.channel_image} name={c.channel_name} />
                      <span className="flex-1 min-w-0 truncate text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                        {c.channel_name}
                      </span>
                      <StatusPill status={c.status} />
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setShowAddPicker(true);
                      setPickerSearch("");
                      setSelectedIds(new Set());
                      setError(null);
                    }}
                    className="w-full rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold py-2.5 hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    + Add channels
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 pt-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      <SearchIcon />
                    </span>
                    <input
                      autoFocus
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="Search channels…"
                      className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 pl-9 pr-4 py-2 text-[13px] font-medium text-neutral-700 dark:text-neutral-200 outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mx-5 mt-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-2 py-2">
                  {pickerChannels.length === 0 && (
                    <div className="px-5 py-10 text-center text-[13px] font-medium text-neutral-400">
                      No channels match your search.
                    </div>
                  )}
                  {pickerChannels.map((c) => {
                    const alreadyIn = currentGenreChannelIds.has(c.id);
                    const checked = alreadyIn || selectedIds.has(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                          alreadyIn ? "opacity-60 cursor-default" : "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={alreadyIn}
                          onChange={() => !alreadyIn && toggleSelect(c.id)}
                          className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 text-[#0284C7] dark:text-[#0EA5E9] focus:ring-[#0284C7] dark:focus:ring-[#0EA5E9] accent-[#0284C7] dark:accent-[#0EA5E9] shrink-0"
                        />
                        <ChannelThumb src={c.logo || c.channel_image} name={c.channel_name} />
                        <span className="flex-1 min-w-0 truncate text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                          {c.channel_name}
                        </span>
                        {alreadyIn && (
                          <span className="shrink-0 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            Added
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-2.5 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowAddPicker(false)}
                    className="rounded-full border border-neutral-200 dark:border-neutral-700 px-5 py-2.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBulkAdd}
                    disabled={selectedIds.size === 0 || addingBulk}
                    className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white disabled:opacity-50 px-5 py-2.5 text-[13px] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {addingBulk ? "Adding…" : `Add ${selectedIds.size > 0 ? selectedIds.size : ""} channel${selectedIds.size === 1 ? "" : "s"}`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}