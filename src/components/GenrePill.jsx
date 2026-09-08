export default function GenrePill({ text }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#E0F2FE] dark:bg-[#0EA5E9]/10 text-[#0369A1] dark:text-[#38BDF8] px-2.5 py-1 text-[11px] font-bold whitespace-nowrap">
      {text}
    </span>
  );
}