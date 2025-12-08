import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ListItem from "./ListItem";

function SortLabel({ label, metric, sortKey, sortOrder, onSort, widthClass }) {
  const isActive = sortKey === metric;
  const arrow = isActive ? (sortOrder === "asc" ? "↑" : "↓") : "↕";
  return (
    <button
      type="button"
      onClick={() => onSort(metric)}
      className={`flex items-center justify-center gap-1 text-sm font-medium text-gray-700 hover:text-primary transition ${widthClass}`}
    >
      <span>{label}</span>
      <span className="text-xs">{arrow}</span>
    </button>
  );
}

export default function Pagination({ filtered = [], currentPage, setCurrentPage, sortKey, sortOrder, onSort }) {
  const limit = 5;
  const totalPages = Math.ceil(filtered.length / limit);
  const start = (currentPage - 1) * limit;
  const currentPosts = filtered.slice(start, start + limit);

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between font-semibold px-2">
          <div className="flex-1 min-w-0 ms-2 text-sm text-gray-700">Title</div>

          <div className="flex items-center justify-between gap-4 me-4 w-[360px]">
            <SortLabel label="Geo" metric="geo" sortKey={sortKey} sortOrder={sortOrder} onSort={onSort} widthClass="w-16 text-center" />
            <SortLabel label="Seo" metric="seo" sortKey={sortKey} sortOrder={sortOrder} onSort={onSort} widthClass="w-16 text-center" />
            <SortLabel label="Performance" metric="performance" sortKey={sortKey} sortOrder={sortOrder} onSort={onSort} widthClass="w-28 text-center" />
            <SortLabel label="General" metric="general" sortKey={sortKey} sortOrder={sortOrder} onSort={onSort} widthClass="w-20 text-center" />
          </div>
        </div>
        {currentPosts.length === 0 ? (
          <div className="text-sm text-gray-500">No results found.</div>
        ) : (
          currentPosts.map((item) => {
            const href = item.website
              ? /^https?:\/\//i.test(item.website)
                ? item.website
                : `https://${item.website}`
              : undefined;
            return <ListItem key={item.id} href={href} item={item} />;
          })
        )}
      </div>
      <div>
        <div className="flex items-center mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm disabled:opacity-50"
          >
            <MdKeyboardArrowLeft className="mt-0.5 me-1" /> Prev
          </button>
          <p style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm disabled:opacity-50"
          >
            Next <MdKeyboardArrowRight className="mt-0.5 ms-1" />
          </button>
        </div>
      </div>
    </>
  );
}
