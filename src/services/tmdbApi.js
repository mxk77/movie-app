// src/services/tmdbApi.js
import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: apiKey, language: 'en-US' },
});

// Пошук фільмів/серіалів за назвою
export const searchMedia = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } });

// Топ-рейтинги
export const getTopMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } });
export const getTopTV = (page = 1) =>
  tmdb.get('/tv/top_rated', { params: { page } });

// Деталі з кредитами та відгуками
export const getMediaDetails = (id, mediaType = 'movie') =>
  tmdb.get(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,reviews' },
  });