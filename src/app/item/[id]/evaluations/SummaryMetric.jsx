export default function SummaryMetric({ label, value, description, icon: Icon }) {
  return (
    <button
      type="button"
      className="group w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition-transform transition-shadow duration-150 ease-out hover:scale-[1.03] hover:shadow-md"
      title={description || ""}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {Icon && (
            <Icon className="h-3.5 w-3.5 text-primary group-hover:text-primary" />
          )}
          <span className="text-[11px] text-gray-600 group-hover:text-primary">
            {label}
          </span>
        </div>
        <div className="text-base font-semibold text-gray-900 group-hover:text-primary">
          {value}
        </div>
      </div>
    </button>
  );
}
