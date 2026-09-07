import { useEffect, useState } from "react";
import * as channelsApi from "../api/channels";
import * as genresApi from "../api/genres";
import ImageUploadField from "../components/ImageUploadField.jsx";
import ChannelThumb from "../components/ChannelThumb.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";

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

function StatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
        isActive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function GenrePill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E0F2FE] dark:bg-[#0EA5E9]/10 text-[#0369A1] dark:text-[#38BDF8] px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
      {text}
    </span>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Edit"
      className="h-8 w-8 rounded-full flex items-center justify-center bg-[#0284C7] dark:bg-[#0EA5E9] text-white hover:opacity-90 active:scale-95 transition-all shrink-0"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
        <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="View"
      className="h-8 w-8 rounded-full flex items-center justify-center bg-violet-500 dark:bg-violet-500 text-white hover:opacity-90 active:scale-95 transition-all shrink-0"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 3.5c-4.34 0-7.5 3.5-8.5 6.5 1 3 4.16 6.5 8.5 6.5s7.5-3.5 8.5-6.5c-1-3-4.16-6.5-8.5-6.5zm0 10.5a4 4 0 110-8 4 4 0 010 8z" />
        <circle cx="10" cy="10" r="2" />
      </svg>
    </button>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="h-3.5 w-5 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          <div className="h-3.5 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </td>
      <td className="px-5 py-4">
        <div className="h-3.5 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </td>
      <td className="px-5 py-4" />
    </tr>
  );
}

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
      // Only send image fields when they're a freshly-picked File - an
      // unchanged string URL means "leave the existing image as-is".
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

  const filtered = channels.filter((c) =>
    c.channel_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : startIdx + 1;
  const rangeEnd = Math.min(startIdx + PAGE_SIZE, filtered.length);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const goToPage = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Channels"
        subtitle="Manage, configure and monitor all available channels."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add channel
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-5">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="relative max-w-xs">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search channels…"
            className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] pl-9 pr-4 py-2.5 text-[13px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[720px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] dark:from-[#0369A1] dark:to-[#0EA5E9] text-left">
                <th className="px-5 py-3.5 font-bold text-white w-12">#</th>
                <th className="px-5 py-3.5 font-bold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                      <rect x="3" y="4.5" width="14" height="12.5" rx="1.5" />
                      <path d="M3 8.25h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
                    </svg>
                    Channel
                  </span>
                </th>
                <th className="px-5 py-3.5 font-bold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M4.5 3A1.5 1.5 0 003 4.5v4.379a1.5 1.5 0 00.44 1.06l7.914 7.915a1.5 1.5 0 002.122 0l4.378-4.378a1.5 1.5 0 000-2.122L9.94 3.439A1.5 1.5 0 008.878 3H4.5zM7 8a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Genre
                  </span>
                </th>
                <th className="px-5 py-3.5 font-bold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 3a1 1 0 011 1v.09a6.97 6.97 0 013.982 1.87.75.75 0 01-1.03 1.092A5.47 5.47 0 0011 5.6V10a1 1 0 01-.4.8l-3 2.25a1 1 0 01-1.2-1.6l2.6-1.95V4a1 1 0 011-1z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Status
                  </span>
                </th>
                <th className="px-5 py-3.5 font-bold text-white">
                  <span className="inline-flex items-center gap-1.5">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M8 7a5 5 0 113.61 4.804l-1.903 1.903a1 1 0 01-.707.293H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707L8.196 8.39A5.02 5.02 0 018 7zm5-3a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Channel ID
                  </span>
                </th>
                <th className="px-5 py-3.5 font-bold text-white text-right">
                  <span className="inline-flex items-center gap-1.5 justify-end">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path
                        fillRule="evenodd"
                        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567l-.179 1.072c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083l-1.019-.383a1.875 1.875 0 00-2.282.82L3.093 7.92a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692a1.875 1.875 0 00.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Actions
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-[14px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">No channels found</div>
                    <div className="text-[13px] font-medium text-neutral-400 dark:text-neutral-500 mb-4">
                      {search ? "Try a different search term." : "Add your first channel to get started."}
                    </div>
                    {!search && (
                      <button
                        onClick={openCreate}
                        className="rounded-full bg-neutral-900 text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 transition-opacity"
                      >
                        + Add channel
                      </button>
                    )}
                  </td>
                </tr>
              )}

              {!loading &&
                paginated.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`group transition-colors ${
                      i % 2 === 0
                        ? "bg-white dark:bg-[#0F1729]"
                        : "bg-[#F0F9FF] dark:bg-neutral-800/40"
                    } hover:bg-[#E0F2FE] dark:hover:bg-neutral-800/70`}
                  >
                    <td className="px-5 py-3.5 font-bold text-neutral-400 dark:text-neutral-500">
                      {startIdx + i + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <ChannelThumb src={c.logo || c.channel_image} name={c.channel_name} />
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">{c.channel_name}</div>
                          <div className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">HD Channel</div>
                        </div>
                      </div>
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
                        <EditButton onClick={() => openEdit(c)} />
                        <ViewButton onClick={() => setViewingChannel(c)} />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-neutral-100 dark:border-neutral-800 flex-wrap">
            <span className="text-[12px] font-medium text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
              Showing {rangeStart} to {rangeEnd} of {filtered.length} channels
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={safePage === 1}
                  title="First page"
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path
                      fillRule="evenodd"
                      d="M10.79 5.23a.75.75 0 01-.02 1.06L6.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02zm5 0a.75.75 0 01-.02 1.06L11.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Prev
                </button>

                <span className="inline-flex items-center h-9 px-3.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[13px] font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3.5 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Next
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={safePage === totalPages}
                  title="Last page"
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 dark:border-neutral-700 h-9 px-3 text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path
                      fillRule="evenodd"
                      d="M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02zm5 0a.75.75 0 01.02-1.06L13.168 10 9.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
                          ? "border-neutral-900 bg-neutral-900 text-white"
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
                          ? "border-neutral-900 bg-neutral-900 text-white"
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
              value:
                viewingChannel.device?.length > 0
                  ? viewingChannel.device.join(", ")
                  : "—",
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
    </div>
  );
}