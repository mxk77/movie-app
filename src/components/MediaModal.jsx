// src/components/MediaModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { getMediaDetails } from '../services/tmdbApi';
import './MediaModal.css';

export default function MediaModal({ isOpen, mediaId, mediaType, onRequestClose }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getMediaDetails(mediaId, mediaType).then(res => setDetails(res.data));
    }
  }, [isOpen, mediaId, mediaType]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="modal-overlay"
      className="modal-content"
      shouldCloseOnOverlayClick={true}
    >
      {!details ? (
        <div>Loading...</div>
      ) : (
        <div className="modal-body">
          <button className="modal-close" onClick={onRequestClose}>✕</button>
          <div className="modal-header">
            <img
              src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
              alt={details.title || details.name}
            />
            <div>
              <h2>{details.title || details.name}</h2>
              <p><strong>Rating:</strong> {details.vote_average.toFixed(1)}</p>
            </div>
          </div>
          <div className="modal-overview">
            <h3>Overview</h3>
            <p>{details.overview}</p>
          </div>
          <div className="modal-actors">
            <h3>Top Actors</h3>
            <ul>
              {details.credits.cast.slice(0, 5).map(a => (
                <li key={a.cast_id}>{a.name} as {a.character}</li>
              ))}
            </ul>
          </div>
          <div className="modal-reviews">
            <h3>User Reviews</h3>
            <ul>
              {details.reviews.results.slice(0,3).map(r => (
                <li key={r.id}><strong>{r.author}</strong>: {r.content}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}