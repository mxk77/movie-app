// src/components/Pagination.jsx
import React from 'react';
import './Pagination.css';

export default function Pagination({ current, hasPrev, hasNext, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={!hasPrev}
      >
        ← Prev
      </button>

      <span className="page-info">
        Page {current}
      </span>

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={!hasNext}
      >
        Next →
      </button>
    </div>
  );
}