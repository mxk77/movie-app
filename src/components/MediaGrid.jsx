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
import Pagination from './Pagination';

export default function MediaGrid({ query, category }) {
  const [items, setItems] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  // How many TMDb pages we've loaded so far
  const [loadedApiPages, setLoadedApiPages] = useState(0);
  // Total TMDb pages available (from API)
  const [totalApiPages, setTotalApiPages] = useState(null);

  // Fetch up to 5 TMDb pages starting at `startPage`
  const fetchApiBlock = useCallback(async (startPage) => {
    // Determine which pages to fetch
    const pages = [];
    for (let p = startPage; p < startPage + 5 && (totalApiPages == null || p <= totalApiPages); p++) {
      pages.push(p);
    }
    if (pages.length === 0) return [];

    // Perform requests
    const responses = await Promise.all(
      pages.map((p) => {
        if (query) return searchMedia(query, p);
        if (category === 'movies') return getTopMovies(p);
        if (category === 'tv') return getTopTV(p);
        // animation
        return Promise.all([getAnimationMovies(p), getAnimationTV(p)])
          .then(([m, t]) => ({ data: { results: [...m.data.results, ...t.data.results], total_pages: m.data.total_pages } }));
      })
    );

    // Capture total_pages from first response
    if (totalApiPages == null && responses[0].data.total_pages != null) {
      setTotalApiPages(responses[0].data.total_pages);
    }

    // Flatten results
    return responses.flatMap((res) => res.data.results);
  }, [query, category, totalApiPages]);

  // Load more TMDb pages if needed to cover the current UI page
  const ensureItems = useCallback(async () => {
    // Determine how many UI pages the loaded items cover
    const loadedItemsCount = loadedApiPages * 20;
    const coveredUiPages = Math.ceil(loadedItemsCount / pageSize);

    // If user navigated past the covered pages, fetch next block
    if (currentPage > coveredUiPages) {
      const nextStart = loadedApiPages + 1;
      const newItems = await fetchApiBlock(nextStart);
      setItems((prev) => {
        const combined = [...prev, ...newItems].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        return combined;
      });
      setLoadedApiPages((prev) => prev + 5);
    }
  }, [currentPage, loadedApiPages, pageSize, fetchApiBlock]);

  // On category or query change, reset and load the first block
  const resetAndLoad = useCallback(async () => {
    setItems([]);
    setLoadedApiPages(0);
    setTotalApiPages(null);
    setCurrentPage(1);

    const firstBlock = await fetchApiBlock(1);
    setItems(firstBlock.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)));
    setLoadedApiPages(5);
  }, [fetchApiBlock]);

  // Initial load / reload on query or category change
  useEffect(() => {
    resetAndLoad();
  }, [resetAndLoad]);

  // Whenever currentPage changes, ensure we have enough items
  useEffect(() => {
    ensureItems();
  }, [currentPage, ensureItems]);

  // Determine total UI pages based on items loaded so far
  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
      {/* Page size selector */}
      <div className="page-size-selector">
        <label>
          Items per page:{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(+e.target.value);
              setCurrentPage(1);
            }}
          >
            {[20, 40, 60, 80, 100].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Media grid */}
      <div className="media-grid">
        {paginated.map((media) => (
          <MediaCard key={`${media.media_type}-${media.id}`} media={media} />
        ))}
      </div>

      {/* Prev · Page X · Next */}
      <Pagination
        current={currentPage}
        total={totalPages}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </>
  );
}
