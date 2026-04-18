'use client'

export default function Pagination({ page, totalPages, onPageChange }) {
    return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px' }}>
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                ← Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                Next →
            </button>
        </div>
    )
}