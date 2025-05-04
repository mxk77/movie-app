// src/components/MediaGrid.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  searchMedia,
  getTopMovies,
  getTopTV,
  getAnimationMovies,
  getAnimationTV,
} from '../services/tmdbApi';
import MediaCard from './MediaCard';
import MediaModal from './MediaModal';
import Pagination from './Pagination';
import './MediaGrid.css';

export default function MediaGrid({ query, category }) {
  const [items, setItems] = useState([]);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, media: null });
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApiPages, setTotalApiPages] = useState(null);

  const fetchPageItems = useCallback(async () => {
    const pagesNeeded = Math.ceil(pageSize / 20);
    const startApiPage = Math.floor((currentPage - 1) * pageSize / 20) + 1;
    const promises = [];

    for (let i = 0; i < pagesNeeded; i++) {
      const p = startApiPage + i;
      if (totalApiPages != null && p > totalApiPages) break;

      if (query) {
        promises.push(searchMedia(query, p));
      } else if (category === 'movies') {
        // помічаємо як movie
        promises.push(
          getTopMovies(p).then(res => ({
            data: {
              ...res.data,
              results: res.data.results.map(r => ({ ...r, media_type: 'movie' }))
            }
          }))
        );
      } else if (category === 'tv') {
        // помічаємо як tv
        promises.push(
          getTopTV(p).then(res => ({
            data: {
              ...res.data,
              results: res.data.results.map(r => ({ ...r, media_type: 'tv' }))
            }
          }))
        );
      } else { // animation
        promises.push(
          Promise.all([getAnimationMovies(p), getAnimationTV(p)])
            .then(([mRes, tRes]) => ({
              data: {
                // беремо total_pages з одного з них
                total_pages: mRes.data.total_pages,
                results: [
                  ...mRes.data.results.map(r => ({ ...r, media_type: 'movie' })),
                  ...tRes.data.results.map(r => ({ ...r, media_type: 'tv' }))
                ]
              }
            }))
        );
      }
    }

    const responses = await Promise.all(promises);

    // Зберігаємо загальну кількість сторінок із першої відповіді
    if (totalApiPages == null && responses[0]?.data?.total_pages) {
      setTotalApiPages(responses[0].data.total_pages);
    }

    // Збираємо й сортуємо результати
    const allResults = responses.flatMap(res => res.data.results);
    allResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

    setItems(allResults.slice(0, pageSize));
  }, [query, category, currentPage, pageSize, totalApiPages]);

  // При зміні запиту/категорії — скидаємо
  useEffect(() => {
    setTotalApiPages(null);
    setCurrentPage(1);
  }, [query, category]);

  // Підвантажуємо
  useEffect(() => {
    fetchPageItems();
  }, [fetchPageItems]);

  // Prev/Next
  const hasPrev = currentPage > 1;
  const possibleUiPages = totalApiPages
    ? Math.ceil((totalApiPages * 20) / pageSize)
    : currentPage + 1;
  const hasNext = currentPage < possibleUiPages;

  // Модалка
  const openModal = media => setModalInfo({ isOpen: true, media });
  const closeModal = () => setModalInfo({ isOpen: false, media: null });

  return (
    <>
      <div className="page-size-selector">
        <label>
          Items per page:{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(+e.target.value);
              setCurrentPage(1);
            }}
          >
            {[20, 40, 60, 80, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="media-grid">
        {items.map(media => (
          <MediaCard
            key={`${media.media_type}-${media.id}`}
            media={media}
            onClick={() => openModal(media)}
          />
        ))}
      </div>

      <Pagination
        current={currentPage}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPageChange={p => {
          if (p >= 1 && p <= possibleUiPages) {
            setCurrentPage(p);
          }
        }}
      />

      <MediaModal
        isOpen={modalInfo.isOpen}
        mediaId={modalInfo.media?.id}
        mediaType={modalInfo.media?.media_type}
        onRequestClose={closeModal}
      />
    </>
  );
}