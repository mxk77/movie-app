// src/components/Header.jsx
import React from 'react';
import SearchBar from './SearchBar';
import CategoryTabs from './CategoryTabs';
import './Header.css';

/**
 * Header компонента, який містить поле пошуку та вкладки категорій.
 *
 * @param {Object} props
 * @param {(query: string) => void} props.onSearch — колбек для обробки зміни рядка пошуку
 * @param {'movies' | 'tv' | 'animation'} props.selectedCategory — поточна вибрана категорія
 * @param {(category: 'movies' | 'tv' | 'animation') => void} props.onCategoryChange — колбек для зміни категорії
 */
export default function Header({ onSearch, selectedCategory, onCategoryChange }) {
  return (
    <header className="app-header">
      {/* Пошуковий інпут із дебаунсом */}
      <SearchBar onSearch={onSearch} />

      {/* Вкладки для вибору категорії */}
      <CategoryTabs
        selected={selectedCategory}
        onSelect={onCategoryChange}
      />
    </header>
  );
}