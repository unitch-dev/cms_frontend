const FAQS = [
  {
    q: "How do I add a new channel?",
    a: "Go to Channels, click \"+ Add channel\", fill in the details, and optionally upload a channel image and logo.",
  },
  {
    q: "How do I feature a channel in Popular Channels?",
    a: "Go to Popular Channels, click \"+ Add from Channels\", and pick an existing channel to feature. You can't create a popular channel from scratch — it's always based on one that already exists.",
  },
  {
    q: "What image formats are supported?",
    a: "PNG and JPG only, up to 5MB per image.",
  },
  {
    q: "Who can create new admin accounts?",
    a: "Only users with the Admin role can create additional accounts, via the backend's /api/users endpoint.",
  },
];

export default function Help() {
  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-neutral-900 dark:text-white mb-1.5">
          Help
        </h1>
        <p className="text-[14px] font-medium text-neutral-500 dark:text-neutral-400">
          Common questions about managing your channels.
        </p>
      </div>

      <div className="max-w-2xl space-y-3">
        {FAQS.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0F1729] p-5"
          >
            <div className="text-[14px] font-bold text-neutral-900 dark:text-white mb-1.5">{item.q}</div>
            <div className="text-[13px] font-medium text-neutral-500 dark:text-neutral-400">{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
