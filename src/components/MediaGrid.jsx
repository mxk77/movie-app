// src/components/MediaGrid.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  searchMedia,
  getTopMovies,
  getTopTV,
} from '../services/tmdbApi';

import MediaCard from './MediaCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function MediaGrid({ query, category }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Покажемо, як обробляти onSearch і onCategoryChange тут:
  // Але оскільки ми передаємо ці колбеки в Header,
  // MediaGrid відповідає тільки за відображення.

  const fetchItems = useCallback(async () => {
    let response;
    if (query) {
      response = await searchMedia(query, page);
    } else if (category === 'movies') {
      response = await getTopMovies(page);
    } else if (category === 'tv') {
      response = await getTopTV(page);
    } else {
      // animation
      response = await searchMedia('animation', page);
    }

    const results = response.data.results;
    // якщо це новий запит (page === 1), очищаємо попередні
    setItems((prev) =>
      page === 1 ? results : [...prev, ...results]
    );
    setHasMore(page < 5);
  }, [query, category, page]);

  // Коли змінюються query чи category — скидаємо до першої сторінки
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setItems([]);
  }, [query, category]);

  // Отримуємо дані кожного разу, коли змінюється page, query чи category
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <>
      <InfiniteScroll
        dataLength={items.length}
        next={() => setPage((p) => p + 1)}
        hasMore={hasMore}
        loader={<h4>Завантаження...</h4>}
      >
        <div className="media-grid">
          {items.map((media) => (
            <MediaCard key={media.id} media={media} />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}