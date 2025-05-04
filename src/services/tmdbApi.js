import axios from 'axios';

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: apiKey, language: 'en-US' },
});

/**
 * Шукає одразу в колекціях Movie та TV через Search Multi endpoint,
 * відфільтровуючи лише медіа-типи movie та tv.
 */
export const searchMedia = (query, page = 1) =>
  tmdb
    .get('/search/multi', {
      params: { query, page, include_adult: false },
    })
    .then((res) => {
      // Відфільтровуємо лише "movie" та "tv"
      const results = res.data.results.filter(
        (item) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      return { data: { ...res.data, results } };
    });

/**
 * Отримати список фільмів за рейтингом (Movie Top Rated).
 */
export const getTopMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } });

/**
 * Отримати список серіалів за рейтингом (TV Top Rated).
 */
export const getTopTV = (page = 1) =>
  tmdb.get('/tv/top_rated', { params: { page } });

/**
 * Отримати список анімаційних фільмів за рейтингом (Discover Movie with genre 16).
 */
export const getAnimationMovies = (page = 1) =>
  tmdb.get('/discover/movie', {
    params: { with_genres: 16, sort_by: 'vote_average.desc', page },
  });

/**
 * Отримати список анімаційних серіалів за рейтингом (Discover TV with genre 16).
 */
export const getAnimationTV = (page = 1) =>
  tmdb.get('/discover/tv', {
    params: { with_genres: 16, sort_by: 'vote_average.desc', page },
  });

/**
 * Отримати докладну інформацію з кредитами та відгуками.
 */
export const getMediaDetails = (id, mediaType = 'movie') =>
  tmdb.get(`/${mediaType}/${id}`, {
    params: { append_to_response: 'credits,reviews' },
  });
