export const Pagination = ({ currentPage, hasNextPage, hasPrevPage, onNext, onPrev }) => {
  return (
    <div className="pagination-shell">
      <button className="pagination-btn" onClick={onPrev} disabled={!hasPrevPage}>
        Previous
      </button>
      <span className="pagination-indicator">{currentPage}</span>
      <button className="pagination-btn" onClick={onNext} disabled={!hasNextPage}>
        Next
      </button>
    </div>
  )
}