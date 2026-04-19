'use client'

export default function Pagination({ page, totalPages, onPageChange }) {
    return (
        <div className="pagination-row">
            <button
                className="btn btn-secondary pagination-button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
            >
                ← Prev
            </button>
            <span className="pagination-info">Page {page} of {totalPages}</span>
            <button
                className="btn btn-secondary pagination-button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
            >
                Next →
            </button>
        </div>
    )
}