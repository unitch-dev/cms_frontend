
import { useEffect, useState } from "react";
import * as popularChannelsApi from "../api/popularChannels";
import * as channelsApi from "../api/channels";
import * as genresApi from "../api/genres";
import ChannelThumb from "../components/ChannelThumb.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ViewModal from "../components/ViewModal.jsx";
import StatusPill from "../components/StatusPill.jsx";
import GenrePill from "../components/GenrePill.jsx";
import TableSkeletonRows from "../components/TableSkeletonRows.jsx";
import Pagination from "../components/Pagination.jsx";
import { TableCard, TableHeaderRow, Th, Tr, EmptyState } from "../components/Table.jsx";
import { ChannelIcon, GenreIcon, StatusIcon, ActionsIcon, SearchIcon, CloseIcon } from "../components/TableIcons.jsx";

const PAGE_SIZE = 15;

/* ---------- Modern inline action icons/buttons ---------- */

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
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

function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Remove"
      className="h-8 w-8 rounded-full flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white transition-colors active:scale-95"
    >
      <TrashIcon />
    </button>
  );
}

/* ---------------------------------------------------------- */

export default function PopularChannels() {
  const [popular, setPopular] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [page, setPage] = useState(1);
  const [viewingChannel, setViewingChannel] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([popularChannelsApi.getPopularChannels(), channelsApi.getChannels(), genresApi.getGenres()])
      .then(([popRes, chRes, genRes]) => {
        setPopular(popRes.data.data);
        setAllChannels(chRes.data.data);
        setGenres(genRes.data.data);
      })
      .catch(() => setError("Failed to load popular channels"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const genreName = (genreId) => {
    const ids = Array.isArray(genreId) ? genreId : genreId != null ? [genreId] : [];
    const names = ids.map((id) => genres.find((g) => g.id === id)?.name).filter(Boolean);
    return names.length ? names : [];
  };

  const featuredChannelIds = new Set(popular.map((p) => p.channel_id));

  const filteredPickerChannels = allChannels.filter((c) =>
    c.channel_name?.toLowerCase().includes(pickerSearch.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(popular.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const paginated = popular.slice(startIdx, startIdx + PAGE_SIZE);

  const handleAddFromChannel = async (channel) => {
    setAddingId(channel.id);
    setError(null);
    try {
      await popularChannelsApi.createPopularChannel({
        channel_name: channel.channel_name,
        channel_id: channel.channel_id,
        type: channel.type,
        status: channel.status,
        genre_id: channel.genre_id,
        device: channel.device,
        desc: channel.desc,
        channel_image: channel.channel_image,
        logo: channel.logo,
      });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add channel");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this channel from Popular Channels? (The channel itself won't be deleted.)")) return;
    try {
      await popularChannelsApi.deletePopularChannel(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div className="font-sans">
      <PageHeader
        title="Popular Channels"
        subtitle="Feature existing channels here to highlight them to viewers."
        action={
          <button
            onClick={() => {
              setPickerSearch("");
              setError(null);
              setShowPicker(true);
            }}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add from Channels
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-5">
          {error}
        </div>
      )}

      <TableCard>
        <TableHeaderRow>
          <Th width="w-12">#</Th>
          <Th icon={<ChannelIcon />}>Channel</Th>
          <Th icon={<GenreIcon />}>Genre</Th>
          <Th icon={<StatusIcon />}>Status</Th>
          <Th icon={<ActionsIcon />} align="right">
            Actions
          </Th>
        </TableHeaderRow>
        <tbody>
          {loading && (
            <TableSkeletonRows count={6} columns={["index", "avatar-text", "text", "pill", "actions"]} />
          )}

          {!loading && popular.length === 0 && (
            <EmptyState
              colSpan={5}
              title="No popular channels yet"
              subtitle="Pick an existing channel to feature it here."
              actionLabel="+ Add from Channels"
              onAction={() => setShowPicker(true)}
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
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <ViewButton onClick={() => setViewingChannel(c)} />
                    <DeleteButton onClick={() => handleRemove(c.id)} />
                  </div>
                </td>
              </Tr>
            ))}
        </tbody>
      </TableCard>

      {!loading && popular.length > 0 && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
          rangeStart={startIdx + 1}
          rangeEnd={Math.min(startIdx + PAGE_SIZE, popular.length)}
          totalItems={popular.length}
          itemLabel="channels"
        />
      )}

      {/* Picker: choose an existing channel to feature */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            style={{ animation: "fadeIn 180ms ease-out" }}
            onClick={() => setShowPicker(false)}
          />
          <div
            className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl bg-white dark:bg-[#0F1729] border border-neutral-200 dark:border-neutral-700"
            style={{ animation: "popIn 200ms cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <style>{`
              @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
              @keyframes popIn { from { opacity: 0; transform: scale(0.96) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
            `}</style>

            <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-bold text-neutral-900 dark:text-white">Add from Channels</h2>
                <button
                  onClick={() => setShowPicker(false)}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
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

            <div className="flex-1 overflow-y-auto py-2">
              {filteredPickerChannels.length === 0 && (
                <div className="px-5 py-10 text-center text-[13px] font-medium text-neutral-400">
                  No channels match your search.
                </div>
              )}
              {filteredPickerChannels.map((c) => {
                const isFeatured = featuredChannelIds.has(c.channel_id);
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <ChannelThumb src={c.logo || c.channel_image} name={c.channel_name} />
                    <span className="flex-1 min-w-0 truncate text-[13px] font-semibold text-neutral-800 dark:text-neutral-100">
                      {c.channel_name}
                    </span>
                    <button
                      disabled={isFeatured || addingId === c.id}
                      onClick={() => handleAddFromChannel(c)}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-colors ${
                        isFeatured
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-default"
                          : "bg-[#0284C7] dark:bg-[#0EA5E9] text-white hover:opacity-90"
                      }`}
                    >
                      {isFeatured ? "Added" : addingId === c.id ? "Adding…" : "Add"}
                    </button>
                  </div>
                );
              })}
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
            { label: "Description", value: viewingChannel.desc || "—" },
          ]}
          onClose={() => setViewingChannel(null)}
        />
      )}
    </div>
  );
}