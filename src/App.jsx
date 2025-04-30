// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MediaGrid from './components/MediaGrid';
import MediaDetail from './components/MediaDetail';

export default function App() {
  // 1. Стани для рядка пошуку та вибраної категорії
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('movies');

  return (
    <>
      {/* 2. Передаємо в Header відповідні пропси */}
      <Header
        onSearch={setQuery}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      {/* 3. Передаємо в MediaGrid значення станів */}
      <Routes>
        <Route
          path="/"
          element={<MediaGrid query={query} category={category} />}
        />
        <Route path="/movie/:id" element={<MediaDetail />} />
        <Route
          path="/tv/:id"
          element={<MediaDetail mediaType="tv" />}
        />
      </Routes>
    </>
  );
}