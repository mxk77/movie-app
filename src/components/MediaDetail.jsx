// src/components/MediaDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMediaDetails } from '../services/tmdbApi';

export default function MediaDetail({ mediaType = 'movie' }) {
  const { id } = useParams();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    getMediaDetails(id, mediaType).then((res) => setDetails(res.data));
  }, [id, mediaType]);

  if (!details) return <div>Завантаження...</div>;

  return (
    <div className="media-detail">
      <h2>{details.title || details.name}</h2>
      <p>{details.overview}</p>
      <h3>Актори</h3>
      <ul>
        {details.credits.cast.slice(0, 5).map((actor) => (
          <li key={actor.cast_id}>{actor.name} as {actor.character}</li>
        ))}
      </ul>
      <h3>Відгуки</h3>
      <ul>
        {details.reviews.results.slice(0, 3).map((rev) => (
          <li key={rev.id}><strong>{rev.author}</strong>: {rev.content}</li>
        ))}
      </ul>
    </div>
  );
}