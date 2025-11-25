export default function SummaryMetric({ label, value, description }) {
  return (
    <button
      type="button"
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
      title={description || ""}
    >
      <div className="text-[11px] text-gray-500">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </button>
  );
}