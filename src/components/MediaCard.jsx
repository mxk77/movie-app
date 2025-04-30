// src/components/MediaCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MediaCard({ media }) {
  const navigate = useNavigate();
  const { id, title, name, poster_path, vote_average } = media;
  const displayTitle = title || name;
  return (
    <div className="media-card" onClick={() => navigate(`/movie/${id}`)}>
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