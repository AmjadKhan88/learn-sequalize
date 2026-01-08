import { useUser } from '../context/UserContext'
import { useSearchParams } from 'react-router-dom';
import { useScreenSize } from '../hooks/useScreenSize';
import FilterByRole from './FilterByRole';
export default function Pagination({users}) {
  const {totalUsers, totalPages, currentPage} = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
const { isMobile, isTablet, } = useScreenSize();

// set page in url
  const setPageInUrl = (page) => {
    const newParams = new URLSearchParams(searchParams);
    if(page){
      newParams.set("page", page);
    } else {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 5 : isTablet ? 7 : 9;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    // If total pages is small, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always show first page
    pages.push(1);
    
    // Calculate start and end
    let start = currentPage - halfVisible;
    let end = currentPage + halfVisible;
    
    if (start < 2) {
      start = 2;
      end = maxVisiblePages - 2; // -2 for first and last page
    }
    
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = totalPages - maxVisiblePages + 3; // +3 for first, last, and one ellipsis
    }
    
    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (end < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  }

  const pageNumbers = getPageNumbers();


  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-top gap-4">
        <div className="text-sm text-gray-600 mt-2">
          Showing <span className="font-semibold">{users.length}</span> of <span className="font-semibold">{totalUsers}</span> users
          <span className="ml-2">Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span></span>
        </div>

        {/* // filter by role  */}
         <FilterByRole/>

        <div className="flex gap-2 max-h-10">
          {/* Previous Button */}
          <button 
            onClick={() => setPageInUrl(currentPage - 1)} 
            disabled={currentPage === 1} 
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${currentPage === 1 && 'cursor-not-allowed opacity-50'}`}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                  className="px-4 py-2 text-sm font-medium text-gray-500"
                >
                  ...
                </span>
              );
            }
            
            return (
              <button 
                key={page}
                onClick={() => setPageInUrl(page)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 min-w-[40px] ${
                  currentPage === page 
                    ? 'text-white bg-blue-600 hover:bg-blue-700' 
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          {/* Next Button */}
          <button 
            onClick={() => setPageInUrl(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${currentPage === totalPages && 'cursor-not-allowed opacity-50'}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}