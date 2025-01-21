export async function fetchNowPlaying(page = 1) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/movie/now_playing?api_key=${import.meta.env.VITE_API_KEY}&page=${page}`,
  );
  return response.json();
}

export async function searchMovies(query, page = 1) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/search/movie?api_key=${import.meta.env.VITE_API_KEY}&query=${query}&page=${page}`,
  );
  return response.json();
}

export async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/movie/${movieId}?api_key=${import.meta.env.VITE_API_KEY}&append_to_response=videos,reviews,similar`,
  );
  return response.json();
}
