
import { useEffect, useMemo, useState } from "react";
import * as adsApi from "../api/advertisements";
import * as channelsApi from "../api/channels";
import * as genresApi from "../api/genres";
import ImageUploadField from "../components/ImageUploadField.jsx";
import VideoUploadField from "../components/VideoUploadField.jsx";
import AdMultiSelect from "../components/AdMultiSelect.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusPill from "../components/StatusPill.jsx";
import ModalCloseButton from "../components/ModalCloseButton.jsx";
import { useToast } from "../components/Toast.jsx";

const emptyForm = {
  type: "",
  title: "",
  desc: "",
  status: "active",
  image: null,
  video: null,
  videoUrl: "",
  channelIds: [],
  genreIds: [],
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  playAtSecond: "",
  durationSeconds: "",
};

const mediaType = (ad) => (ad.video || ad.videoUrl ? "video" : "image");

const inputCls =
  "w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-2.5 text-[14px] font-medium outline-none focus:border-[#0284C7] dark:focus:border-[#0EA5E9] transition-colors";
const labelCls = "block text-[13px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1.5";

/* ---------- small pieces ---------- */

const Req = () => <span className="text-red-500"> *</span>;

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden">
      <div className="aspect-[3/2] bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      <div className="p-4">
        <div className="h-3.5 w-28 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse mb-2" />
        <div className="h-3 w-40 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    </div>
  );
}

function IconButton({ title, onClick, hover, children }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      title={title}
      className={`h-8 w-8 rounded-lg bg-white dark:bg-[#0F1729]/90 backdrop-blur-sm flex items-center justify-center text-neutral-600 dark:text-neutral-300 ${hover} transition-all duration-200 hover:scale-110 active:scale-95`}
    >
      {children}
    </button>
  );
}

const EditSvg = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-8.5 8.5a2 2 0 01-.708.464L4 16l.622-3.206a2 2 0 01.464-.708l8.5-8.5z" />
  </svg>
);

const ViewSvg = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path
      fillRule="evenodd"
      d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.147.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

const DeleteSvg = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

/* ---------- View modal (plays the video) ---------- */

function AdViewModal({ ad, channelNames, genreNames, onClose, onEdit }) {
  const isVideo = mediaType(ad) === "video";
  const src = ad.video || ad.videoUrl;

  const rows = [
    ["Status", ad.status === "active" ? "Active" : "Inactive"],
    ["Type", isVideo ? "Video" : "Image"],
    ["Description", ad.desc || "—"],
    ["Channels", channelNames.length ? channelNames.join(", ") : "All channels"],
    ["Genres", genreNames.length ? genreNames.join(", ") : "All genres"],
    ["Dates", ad.startDate || ad.endDate ? `${ad.startDate || "…"} → ${ad.endDate || "…"}` : "No restriction"],
    ["Daily time", ad.startTime && ad.endTime ? `${ad.startTime} – ${ad.endTime}` : "All day"],
  ];
  if (isVideo) {
    rows.push(
      ["Play at", `${ad.playAtSecond || 0}s`],
      ["Duration", ad.durationSeconds ? `${ad.durationSeconds}s` : "Full video"]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      {/* flex-col: header + footer fixed, only the middle scrolls */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#0F1729] border border-neutral-200 dark:border-neutral-700">
        {/* header (fixed) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-neutral-900 dark:text-white truncate">{ad.title}</h2>
            <div className="text-[12px] font-medium text-neutral-400">Advertisement ID {ad.id}</div>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>

        {/* body (scrolls) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
    {isVideo ? (
            <video
              src={src}
              controls
              autoPlay
              className="w-full rounded-xl bg-black aspect-video"
              onTimeUpdate={(e) => {
                const limit = ad.durationSeconds;
                if (limit > 0 && e.currentTarget.currentTime >= limit) {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = limit;
                }
              }}
            />
          ) : ad.image ? (
            <img src={ad.image} alt="" className="w-full rounded-xl object-cover aspect-[3/2]" />
          ) : null}

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">{k}</dt>
                <dd className="text-[13px] font-medium text-neutral-800 dark:text-neutral-100">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* footer (fixed) */}
        <div className="shrink-0 flex justify-end gap-4 px-6 py-5 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="min-w-[110px] rounded-full border border-neutral-200 dark:border-neutral-700 px-7 py-3 text-[14px] font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors active:scale-[0.98]"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="min-w-[110px] rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white px-7 py-3 text-[14px] font-bold hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function Advertisements() {
  const toast = useToast();
  const [ads, setAds] = useState([]);
  const [channels, setChannels] = useState([]);
  const [genres, setGenres] = useState([]);
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

  // all channels + genres for the multi-selects
  useEffect(() => {
    channelsApi.getChannels().then((res) => setChannels(res.data.data)).catch(() => {});
    genresApi.getGenres().then((res) => setGenres(res.data.data)).catch(() => {});
  }, []);

  const channelOptions = useMemo(
    () => channels.map((c) => ({ id: c.id, label: c.channel_name })),
    [channels]
  );
  const genreOptions = useMemo(() => genres.map((g) => ({ id: g.id, label: g.name })), [genres]);

  const namesFor = (ids, options) =>
    (ids || []).map((id) => options.find((o) => o.id === id)?.label).filter(Boolean);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (ad) => {
    setEditingId(ad.id);
    setForm({
      type: mediaType(ad),
      title: ad.title,
      desc: ad.desc || "",
      status: ad.status || "active",
      image: ad.image || null,
      video: ad.video || null,
      videoUrl: ad.videoUrl || "",
      channelIds: ad.channelIds || [],
      genreIds: ad.genreIds || [],
      startDate: ad.startDate || "",
      endDate: ad.endDate || "",
      startTime: ad.startTime || "",
      endTime: ad.endTime || "",
      playAtSecond: ad.playAtSecond ? String(ad.playAtSecond) : "",
      durationSeconds: ad.durationSeconds ? String(ad.durationSeconds) : "",
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const isVideo = form.type === "video";

    if (!form.title.trim()) {
      return setError("Title is required");
    }
    if (!form.type) {
      return setError("Ad type is required. Please select Image or Video");
    }
    if (isVideo && !form.video && !form.videoUrl.trim()) {
      return setError("Upload a video or paste a video URL");
    }
    if (!isVideo && !editingId && !(form.image instanceof File)) {
      return setError("Please choose an image");
    }
    if (!!form.startTime !== !!form.endTime) {
      return setError("Set both start time and end time (or leave both empty)");
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        desc: form.desc,
        status: form.status,
        channelIds: form.channelIds,
        genreIds: form.genreIds,
        startDate: form.startDate,
        endDate: form.endDate,
        startTime: form.startTime,
        endTime: form.endTime,
      };

      if (isVideo) {
        payload.playAtSecond = form.playAtSecond;
        payload.durationSeconds = form.durationSeconds;
        payload.videoUrl = form.videoUrl.trim();
        if (form.video instanceof File) payload.video = form.video;

        if (editingId) await adsApi.updateVideoAdvertisement(editingId, payload);
        else await adsApi.createVideoAdvertisement(payload);
      } else {
        if (form.image instanceof File) payload.image = form.image;

        if (editingId) await adsApi.updateAdvertisement(editingId, payload);
        else await adsApi.createAdvertisement(payload);
      }

      setShowForm(false);
      toast.success(editingId ? "Advertisement updated successfully" : "Advertisement added successfully");
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
      toast.success("Advertisement deleted successfully");
      load();
    } catch (err) {
      const msg = err.response?.data?.message || "Delete failed";
      setError(msg);
      toast.error(msg);
    }
  };

  const isVideoForm = form.type === "video";

  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <PageHeader
        title="Advertisements"
        subtitle="Manage image and video ads shown across the platform."
        action={
          <button
            onClick={openCreate}
            className="rounded-full bg-[#0284C7] dark:bg-[#0EA5E9] text-white text-[13px] font-bold px-5 py-2.5 hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            + Add advertisement
          </button>
        }
      />

      {error && !showForm && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-[13px] font-medium text-red-600 dark:text-red-400 mb-6">
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
          <div className="text-[15px] font-semibold text-neutral-700 dark:text-neutral-200 mb-1">
            No advertisements yet
          </div>
          <div className="text-[13px] font-medium text-neutral-400 mb-5">
            Add an image or video ad to start running promotions.
          </div>
          <button
            onClick={openCreate}
            className="rounded-full bg-neutral-900 text-white text-[13px] font-bold px-5 py-2.5"
          >
            + Add advertisement
          </button>
        </div>
      )}

      {/* ---------- cards ---------- */}
      {!loading && ads.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((a) => {
            const isVideo = mediaType(a) === "video";
            return (
              <div
                key={a.id}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0F1729] overflow-hidden transition-all hover:border-neutral-300 hover:-translate-y-0.5"
              >
                <div
                  className={`relative aspect-[3/2] bg-neutral-100 dark:bg-neutral-800 overflow-hidden ${isVideo ? "cursor-pointer" : ""}`}
                  onClick={() => isVideo && setViewingAd(a)}
                >
                  {isVideo ? (
                    a.video ? (
                      <video
                        src={`${a.video}#t=0.5`}
                        preload="metadata"
                        muted
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[12px] font-semibold text-neutral-400">
                        External video
                      </div>
                    )
                  ) : a.image ? (
                    <img
                      src={a.image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[12px] text-neutral-300">
                      No image
                    </div>
                  )}

                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-11 w-11 rounded-full bg-black/55 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        <svg viewBox="0 0 20 20" fill="white" className="h-5 w-5 ml-0.5">
                          <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.34-5.89a1.5 1.5 0 000-2.54L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <StatusPill status={a.status} />
                    <span className="rounded-full bg-black/60 text-white px-2.5 py-1 text-[11px] font-semibold">
                      {isVideo ? "Video" : "Image"}
                    </span>
                  </div>

                  {/* hover: view, edit, delete */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <IconButton title="View" onClick={() => setViewingAd(a)} hover="hover:text-[#0284C7]">
                      <ViewSvg />
                    </IconButton>
                    <IconButton title="Edit" onClick={() => openEdit(a)} hover="hover:text-amber-600">
                      <EditSvg />
                    </IconButton>
                    <IconButton title="Delete" onClick={() => handleDelete(a.id)} hover="hover:text-red-500">
                      <DeleteSvg />
                    </IconButton>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-[14px] font-semibold text-neutral-900 dark:text-white truncate mb-1">
                    {a.title}
                  </div>
                  {a.desc ? (
                    <p className="text-[12px] font-medium text-neutral-400 line-clamp-2">{a.desc}</p>
                  ) : (
                    <span className="text-[12px] font-medium text-neutral-300">No description</span>
                  )}
                  {(a.channelIds?.length > 0 || a.genreIds?.length > 0) && (
  <div className="flex gap-3 mt-2.5 text-[11px] font-semibold text-neutral-400">
    {a.channelIds?.length > 0 && (
      <span>
        {a.channelIds.length} {a.channelIds.length === 1 ? "channel" : "channels"}
      </span>
    )}
    {a.genreIds?.length > 0 && (
      <span>
        {a.genreIds.length} {a.genreIds.length === 1 ? "genre" : "genres"}
      </span>
    )}
  </div>
)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- Add / Edit drawer ---------- */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            style={{ animation: "fadeIn 200ms ease-out" }}
            onClick={() => setShowForm(false)}
          />
          <div
            className="relative w-full max-w-lg h-full bg-white dark:bg-[#0F1729] border-l border-neutral-200 dark:border-neutral-700 flex flex-col"
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
              <ModalCloseButton onClick={() => setShowForm(false)} />
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-3.5 py-2.5 text-[13px] font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Image / Video dropdown */}
              <div>
                <label className={labelCls}>
                  Ad type<Req />
                </label>
                <select
                  required
                  value={form.type}
                  disabled={!!editingId}
                  onChange={(e) => set({ type: e.target.value })}
                  className={`${inputCls} disabled:opacity-60`}
                >
                  <option value="" disabled>
                    Select ad type…
                  </option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                {editingId && (
                  <div className="text-[11px] text-neutral-400 mt-1">Type can't be changed after creating.</div>
                )}
              </div>

              <div>
                <label className={labelCls}>
                  Title<Req />
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => set({ title: e.target.value })}
                  className={inputCls}
                  placeholder="--title--"
                />
              </div>

              <div>
                <label className={labelCls}>
                  Description <span className="font-normal text-neutral-400">(optional)</span>
                </label>
                <textarea
                  value={form.desc}
                  onChange={(e) => set({ desc: e.target.value })}
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className={labelCls}>Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set({ status: s })}
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

              {/* upload area appears only after the type is selected */}
              {form.type === "video" && (
                <>
                  <VideoUploadField value={form.video} onChange={(file) => set({ video: file })} />
                  <div>
                    <label className={labelCls}>
                      Or video URL <span className="font-normal text-neutral-400">(optional, mp4 / m3u8 link)</span>
                    </label>
                    <input
                      value={form.videoUrl}
                      onChange={(e) => set({ videoUrl: e.target.value })}
                      className={inputCls}
                      placeholder="https://…"
                    />
                  </div>
                </>
              )}

              {form.type === "image" && (
                <ImageUploadField
                  label="Image (1536 × 1024)"
                  value={form.image}
                  onChange={(file) => set({ image: file })}
                />
              )}

              {/* channels + genres multi select */}
              <AdMultiSelect
                label="Channels"
                options={channelOptions}
                selected={form.channelIds}
                onChange={(ids) => set({ channelIds: ids })}
                placeholder="--All Channel--"
              />
              <AdMultiSelect
                label="Genres"
                options={genreOptions}
                selected={form.genreIds}
                onChange={(ids) => set({ genreIds: ids })}
                placeholder="--All Genres--"
              />

              {/* schedule */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 space-y-3">
                <div className="text-[13px] font-bold text-neutral-700 dark:text-neutral-200">
                  Schedule <span className="font-normal text-neutral-400">(optional)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Start date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => set({ startDate: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>End date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => set({ endDate: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Daily start time</label>
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => set({ startTime: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Daily end time</label>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(e) => set({ endTime: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  {isVideoForm && (
                    <>
                      <div>
                        <label className={labelCls}>Play at (sec)</label>
                        <input
                          type="number"
                          min="0"
                          value={form.playAtSecond}
                          onChange={(e) => set({ playAtSecond: e.target.value })}
                          className={inputCls}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Duration (sec)</label>
                        <input
                          type="number"
                          min="0"
                          value={form.durationSeconds}
                          onChange={(e) => set({ durationSeconds: e.target.value })}
                          className={inputCls}
                          placeholder="0 = full"
                        />
                      </div>
                    </>
                  )}
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
                  {saving ? "Saving…" : "Save advertisement"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingAd && (
        <AdViewModal
          ad={viewingAd}
          channelNames={namesFor(viewingAd.channelIds, channelOptions)}
          genreNames={namesFor(viewingAd.genreIds, genreOptions)}
          onClose={() => setViewingAd(null)}
          onEdit={() => {
            const ad = viewingAd;
            setViewingAd(null);
            openEdit(ad);
          }}
        />
      )}
    </div>
  );
}