// src/components/CategoryTabs.jsx
import React from 'react';

const categories = [
  { label: 'Top Movies', value: 'movies' },
  { label: 'TV Shows', value: 'tv' },
  { label: 'Animation', value: 'animation' },
];

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="category-tabs">
      {categories.map((cat) => (
        <button
          key={cat.value}
          className={selected === cat.value ? 'active' : ''}
          onClick={() => onSelect(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}