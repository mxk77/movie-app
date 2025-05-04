// src/components/MediaCard.jsx
import React from 'react';
import './MediaCard.css';

export default function MediaCard({ media, onClick }) {
  const { title, name, poster_path, vote_average } = media;
  const displayTitle = title || name;

  return (
    <div className="media-card compact" onClick={onClick}>
      <img
        src={`https://image.tmdb.org/t/p/w300${poster_path}`}
        alt={displayTitle}
      />
      <div className="media-info">
        <span className="rating">{vote_average.toFixed(1)}</span>
        <h3>{displayTitle}</h3>
      </div>
    </div>
  );
}