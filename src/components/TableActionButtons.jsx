function IconButton({ onClick, title, colorClass, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-8 w-8 rounded-full flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shrink-0 ${colorClass}`}
    >
      {children}
    </button>
  );
}

export function EditButton({ onClick, title = "Edit" }) {
  return (
    <IconButton onClick={onClick} title={title} colorClass="bg-[#0284C7] dark:bg-[#0EA5E9]">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
        <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </IconButton>
  );
}

export function ViewButton({ onClick, title = "View" }) {
  return (
    <IconButton onClick={onClick} title={title} colorClass="bg-violet-500 dark:bg-violet-500">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 3.5c-4.34 0-7.5 3.5-8.5 6.5 1 3 4.16 6.5 8.5 6.5s7.5-3.5 8.5-6.5c-1-3-4.16-6.5-8.5-6.5zm0 10.5a4 4 0 110-8 4 4 0 010 8z" />
        <circle cx="10" cy="10" r="2" />
      </svg>
    </IconButton>
  );
}

export function DeleteButton({ onClick, title = "Delete" }) {
  return (
    <IconButton onClick={onClick} title={title} colorClass="bg-red-500 dark:bg-red-500/90">
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path
          fillRule="evenodd"
          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482 41.03 41.03 0 00-2.365-.298V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zm-3.998 3.36a.75.75 0 10-1.5.062l.5 8.5a.75.75 0 101.498-.088l-.5-8.5-.498.026zm7.996 0a.75.75 0 00-1.498.062l.5 8.5a.75.75 0 101.498-.088l-.5-8.5.498.026z"
          clipRule="evenodd"
        />
      </svg>
    </IconButton>
  );
}