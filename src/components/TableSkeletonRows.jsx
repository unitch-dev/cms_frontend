/**
 * Generic skeleton loader for table rows.
 *
 * Usage:
 *   <TableSkeletonRows
 *     count={8}
 *     columns={["index", "avatar-text", "text", "pill", "text", "actions"]}
 *   />
 *
 * Column types: "index" | "avatar-text" | "text" | "pill" | "actions"
 */
function SkeletonCell({ type }) {
  switch (type) {
    case "index":
      return (
        <td className="px-5 py-4">
          <div className="h-3.5 w-5 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </td>
      );
    case "avatar-text":
      return (
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            <div className="h-3.5 w-32 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
          </div>
        </td>
      );
    case "pill":
      return (
        <td className="px-5 py-4">
          <div className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </td>
      );
    case "actions":
      return <td className="px-5 py-4" />;
    case "text":
    default:
      return (
        <td className="px-5 py-4">
          <div className="h-3.5 w-24 rounded bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
        </td>
      );
  }
}

export default function TableSkeletonRows({ count = 6, columns = ["index", "avatar-text", "text", "pill", "actions"] }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i}>
          {columns.map((type, j) => (
            <SkeletonCell key={j} type={type} />
          ))}
        </tr>
      ))}
    </>
  );
}