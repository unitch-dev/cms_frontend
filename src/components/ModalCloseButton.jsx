/**
 * Shared red close button for every modal / drawer.
 * Usage: <ModalCloseButton onClick={() => setShowForm(false)} />
 */
export default function ModalCloseButton({ onClick, title = "Close" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="h-8 w-8 rounded-full flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
    >
      ✕
    </button>
  );
}