import { useState } from "react";

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ChannelThumb({ src, name, size = "h-9 w-9" }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={`${size} rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[11px] font-bold text-neutral-500 dark:text-neutral-400 overflow-hidden shrink-0`}
    >
      {showImage ? (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        initials(name)
      )}
    </div>
  );
}
