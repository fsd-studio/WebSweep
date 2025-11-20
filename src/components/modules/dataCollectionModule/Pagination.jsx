import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ListItem from "./ListItem";

export default function Pagination({ filtered = [], currentPage, setCurrentPage }) {
  const limit = 5;
  const totalPages = Math.ceil(filtered.length / limit);
  const start = (currentPage - 1) * limit;
  const currentPosts = filtered.slice(start, start + limit);

  return (
    <>
    <div className="mt-6 grid grid-cols-1 gap-4">
      <div className='flex justify-between font-semibold'>
        <div className='w-80 ms-4'>Title</div>

        <div className='flex font-normal'>
          <div className='w-20'>Geo</div>
          <div className='w-20'>Seo</div>
          <div className='w-20'>Performance</div>
        </div>

        <div className='me-11.5'>site</div>
      </div>
      {currentPosts.length === 0 ? (
        <div className="text-sm text-gray-500">No results found.</div> 
      ) : (
        currentPosts.map((item) => {
          const href = item.website ? (/^https?:\/\//i.test(item.website) ? item.website : `https://${item.website}`) : undefined;
          return (
              <ListItem key={item.id} href={href} item={item}/>
          );
        })
      )}
      </div>
      <div>
        <div className='flex items-center mt-6'>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className='rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm'
          >
            <MdKeyboardArrowLeft className='mt-0.5 me-1'/> Prev 
          </button>
          <p style={{ margin: "0 10px" }}>
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className='rounded-2xl border flex items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 justify-center border-gray-200 bg-white px-3 py-2 shadow-sm'
            >
            Next <MdKeyboardArrowRight  className='mt-0.5 ms-1'/> 
          </button>
        </div>
      </div>
    </>
    );
}