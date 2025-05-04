// src/components/SearchBar.jsx
import React, { useState } from 'react';
import useDebouncedValue from '../hooks/useDebouncedValue';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const debouncedInput = useDebouncedValue(input, 500);

  // При зміні debouncedInput викликаємо зовнішній onSearch
  React.useEffect(() => {
    onSearch(debouncedInput);
  }, [debouncedInput, onSearch]);

  return (
    <input
      type="text"
      placeholder="Search..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="search-bar"
    />
  );
}