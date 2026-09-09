import { useEffect, useState } from "react";
import * as channelsApi from "../api/channels";
import * as genresApi from "../api/genres";
import ImageUploadField from "../components/ImageUploadField.jsx";
import ChannelThumb from "../components/ChannelThumb.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";
import StatusPill from "../components/StatusPill.jsx";
import GenrePill from "../components/GenrePill.jsx";
import TableSkeletonRows from "../components/TableSkeletonRows.jsx";
import Pagination from "../components/Pagination.jsx";
import { TableCard, TableHeaderRow, Th, Tr, EmptyState } from "../components/Table.jsx";
import { ChannelIcon, GenreIcon, StatusIcon, IdIcon, ActionsIcon, SearchIcon, CloseIcon } from "../components/TableIcons.jsx";
import BulkUploadChannelModal from "../components/BulkUploadChannelModal.jsx";
import BulkUploadImageModal from "../components/BulkUploadImageModal.jsx";

const DEVICE_OPTIONS = ["android", "ios", "web", "smart_tv"];
const PAGE_SIZE = 15;

const emptyForm = {
  channel_name: "",
  channel_id: "",
  type: "deeplink",
  status: "active",
  genre_id: [],
  device: [],
  desc: "",
  sequence: "",
  channel_image: null,
  logo: null,
};

/* ---------- Modern inline action icons/buttons ---------- */

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function ImagesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 21h10a2 2 0 0 0 2-2V7" />
      <circle cx="8" cy="8" r="1.5" />
      <path d="m3 15 3.5-3.5a1 1 0 0 1 1.4 0L11 14.5" />
    </svg>
  );
}

function FileSpreadsheetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h1" />
    </svg>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="View"
      className="h-8 w-8 rounded-full flex items-center justify-center bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500 dark:hover:text-white transition-colors active:scale-95"
    >
      <EyeIcon />
    </button>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Edit"
      className="h-8 w-8 rounded-full flex items-center justify-center bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white transition-colors active:scale-95"
    >
      <PencilIcon />
    </button>
  );
}

/* ---------------------------------------------------------- */

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [viewingChannel, setViewingChannel] = useState(null);
  const [page, setPage] = useState(1);
  const [lcnSort, setLcnSort] = useState(null); // null | "asc" | "desc"
  const [showBulkChannel, setShowBulkChannel] = useState(false);
  const [showBulkImage, setShowBulkImage] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([channelsApi.getChannels(), genresApi.getGenres()])
      .then(([chRes, genRes]) => {
        setChannels(chRes.data.data);
        setGenres(genRes.data.data);
      })
      .catch(() => setError("Failed to load channels"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const genreName = (genreId) => {
    const ids = Array.isArray(genreId) ? genreId : genreId != null ? [genreId] : [];
    const names = ids.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean);
    return names.length ? names : [];
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (channel) => {
    setEditingId(channel.id);
    setForm({
      channel_name: channel.channel_name,
      channel_id: channel.channel_id,
      type: channel.type || "deeplink",
      status: channel.status || "active",
      genre_id: Array.isArray(channel.genre_id) ? channel.genre_id : channel.genre_id != null ? [channel.genre_id] : [],
      device: channel.device || [],
      desc: channel.desc || "",
      sequence: channel.sequence ?? "",
      channel_image: channel.channel_image || null,
      logo: channel.logo || null,
    });
    setError(null);
    setShowForm(true);
  };

  const toggleGenre = (id) => {
    setForm((f) => ({
      ...f,
      genre_id: f.genre_id.includes(id) ? f.genre_id.filter((g) => g !== id) : [...f.genre_id, id],
    }));
  };

  const toggleDevice = (d) => {
    setForm((f) => ({
      ...f,
      device: f.device.includes(d) ? f.device.filter((x) => x !== d) : [...f.device, d],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        channel_name: form.channel_name,
        channel_id: form.channel_id,
        type: form.type,
        status: form.status,
        genre_id: form.genre_id,
        device: form.device,
        desc: form.desc,
      };
      if (form.sequence !== "") payload.sequence = Number(form.sequence);
      if (form.channel_image instanceof File) payload.channel_image = form.channel_image;
      if (form.logo instanceof File) payload.logo = form.logo;

      if (editingId) {
        await channelsApi.updateChannel(editingId, payload);
      } else {
        await channelsApi.createChannel(payload);
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
    if (!confirm("Delete this channel?")) return;
    try {
      await channelsApi.deleteChannel(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = channels.filter((c) => c.channel_name?.toLowerCase().includes(search.toLowerCase()));

  const sorted = lcnSort
    ? [...filtered].sort((a, b) => {
        const av = a.sequence === "" || a.sequence == null ? Infinity : Number(a.sequence);
        const bv = b.sequence === "" || b.sequence == null ? Infinity : Number(b.sequence);
        return lcnSort === "asc" ? av - bv : bv - av;
      })
    : filtered;

  const cycleLcnSort = () => {
    setLcnSort((s) => (s === null ? "asc" : s === "asc" ? "desc" : null));
  };

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginated = sorted.slice(startIdx, startIdx + PAGE_SIZE);
  const rangeStart = sorted.length === 0 ? 0 : startIdx + 1;
  const rangeEnd = Math.min(startIdx + PAGE_SIZE, sorted.length);

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Channels"
        subtitle="Manage, configure and monitor all available channels."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBulkImage(true)}
              className="group flex items-center gap-1.5 rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-4 py-2.5 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <ImagesIcon />
              </span>
              Bulk upload images
            </button>
            <button
              onClick={() => setShowBulkChannel(true)}
              className="group flex items-center gap-1.5 rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-4 py-2.5 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200"
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <FileSpreadsheetIcon />
              </span>
              Bulk upload channels
            </button>
            <button
              onClick={openCreate}
              className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200"
            >
              + Add channel
            </button>
          </div>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-5">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels…"
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] pl-9 pr-4 py-2.5 text-[13px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors"
          />
        </div>
      </div>

      <TableCard minWidth="min-w-[800px]">
        <TableHeaderRow>
          <Th width="w-12">#</Th>
          <Th icon={<ChannelIcon />}>Channel</Th>
          <Th icon={<IdIcon />} width="w-20" sortDirection={lcnSort} onSort={cycleLcnSort}>
            LCN
          </Th>
          <Th icon={<GenreIcon />}>Genre</Th>
          <Th icon={<StatusIcon />}>Status</Th>
          <Th icon={<IdIcon />}>Channel ID</Th>
          <Th icon={<ActionsIcon />} align="right">
            Actions
          </Th>
        </TableHeaderRow>
        <tbody>
          {loading && (
            <TableSkeletonRows
              count={8}
              columns={["index", "avatar-text", "text", "text", "pill", "text", "actions"]}
            />
          )}

          {!loading && filtered.length === 0 && (
            <EmptyState
              colSpan={7}
              title="No channels found"
              subtitle={search ? "Try a different search term." : "Add your first channel to get started."}
              actionLabel={!search ? "+ Add channel" : undefined}
              onAction={openCreate}
            />
          )}

          {!loading &&
            paginated.map((c, i) => (
              <Tr key={c.id} index={i}>
                <td className="px-5 py-3.5 font-bold text-neutral-400 dark:text-neutral-500">{startIdx + i + 1}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <ChannelThumb src={c.logo || c.channel_image} name={c.channel_name} />
                    <div>
                      <div className="font-bold text-neutral-900 dark:text-white">{c.channel_name}</div>
                      <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">HD Channel</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-bold text-neutral-500 dark:text-neutral-400">
                  {c.sequence ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {genreName(c.genre_id).length > 0 ? (
                      genreName(c.genre_id).map((name) => <GenrePill key={name} text={name} />)
                    ) : (
                      <span className="text-neutral-400 dark:text-neutral-500">—</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={c.status} />
                </td>
                <td className="px-5 py-3.5 font-medium text-neutral-500 dark:text-neutral-400 max-w-[220px] truncate">
                  {c.channel_id ? String(c.channel_id) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => setViewingChannel(c)} />
                    <EditButton onClick={() => openEdit(c)} />
                  </div>
                </td>
              </Tr>
            ))}
        </tbody>
      </TableCard>

      {!loading && filtered.length > 0 && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={filtered.length}
          itemLabel="channels"
        />
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
                {editingId ? "Edit channel" : "Add channel"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Channel name
                </label>
                <input
                  required
                  value={form.channel_name}
                  onChange={(e) => setForm({ ...form, channel_name: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Channel ID
                </label>
                <input
                  required
                  value={form.channel_id}
                  onChange={(e) => setForm({ ...form, channel_id: e.target.value })}
                  placeholder="e.g. ID / URL"
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
                          ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7] dark:bg-[#0EA5E9] text-white"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Genres ({form.genre_id.length || 0} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        form.genre_id.includes(g.id)
                          ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7] dark:bg-[#0EA5E9] text-white"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                  {genres.length === 0 && (
                    <span className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500">
                      No genres yet — add one first.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">Devices</label>
                <div className="flex flex-wrap gap-2">
                  {DEVICE_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDevice(d)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold capitalize transition-colors ${
                        form.device.includes(d)
                          ? "border-[#0284C7] dark:border-[#0EA5E9] bg-[#0284C7] dark:bg-[#0EA5E9] text-white"
                          : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      {d.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploadField
                label="Channel image"
                value={form.channel_image}
                onChange={(file) => setForm({ ...form, channel_image: file })}
              />

              <ImageUploadField
                label="Logo"
                value={form.logo}
                onChange={(file) => setForm({ ...form, logo: file })}
              />

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5">
                  Sequence (optional)
                </label>
                <input
                  type="number"
                  value={form.sequence}
                  onChange={(e) => setForm({ ...form, sequence: e.target.value })}
                  placeholder="Display order"
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] focus:bg-white dark:bg-[#0F1729] transition-colors"
                />
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
                  {saving ? "Saving…" : "Save channel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingChannel && (
        <ViewModal
          title={viewingChannel.channel_name}
          subtitle={`Channel ID ${viewingChannel.id}`}
          images={[
            { label: "channel image", src: viewingChannel.channel_image },
            { label: "logo", src: viewingChannel.logo },
          ]}
          fields={[
            { label: "Channel name", value: viewingChannel.channel_name },
            { label: "Channel ID", value: String(viewingChannel.channel_id) },
            { label: "Type", value: viewingChannel.type || "—" },
            {
              label: "Status",
              value: (
                <span className={viewingChannel.status === "active" ? "text-emerald-600" : "text-red-500"}>
                  {viewingChannel.status === "active" ? "Active" : "Inactive"}
                </span>
              ),
            },
            { label: "Genres", value: genreName(viewingChannel.genre_id).join(", ") || "—" },
            {
              label: "Devices",
              value: viewingChannel.device?.length > 0 ? viewingChannel.device.join(", ") : "—",
            },
            { label: "Sequence", value: viewingChannel.sequence ?? "—" },
            { label: "Description", value: viewingChannel.desc || "—" },
          ]}
          onClose={() => setViewingChannel(null)}
          onEdit={() => {
            setViewingChannel(null);
            openEdit(viewingChannel);
          }}
        />
      )}

      {showBulkChannel && (
        <BulkUploadChannelModal
          onClose={() => setShowBulkChannel(false)}
          onSuccess={load}
        />
      )}

      {showBulkImage && (
        <BulkUploadImageModal
          onClose={() => setShowBulkImage(false)}
        />
      )}
    </div>
  );
}