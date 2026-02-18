

export const Pagination = ({ currentPage, hasNextPage, hasPrevPage, onNext, onPrev }) => {
  
  return (
    <div className="flex justify-center mt-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={onPrev}
        disabled={!hasPrevPage}
      >
        Previous
      </button>
      <span className="mx-2 my-auto">{currentPage}</span>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        onClick={onNext}
        disabled={!hasNextPage}
      >
        Next
      </button>
    </div>
  );
};