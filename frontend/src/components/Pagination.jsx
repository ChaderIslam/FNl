export default function Pagination({ currentPage, totalPages, setCurrentPage, rowsPerPage, setRowsPerPage }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-2 text-gray-700">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-200 rounded-xl px-4 py-2 shadow-md bg-white hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition"
        >
          {[5, 7, 10, 20].map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm disabled:opacity-50 hover:bg-green-50 transition"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm transition ${
              page === currentPage ? "bg-green-600 text-white border-green-600" : "hover:bg-green-50"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border border-gray-200 rounded-xl shadow-sm text-sm disabled:opacity-50 hover:bg-green-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
