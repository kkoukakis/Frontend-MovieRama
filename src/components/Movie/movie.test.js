import Movie from './index';
import { fetchMovieDetails } from '../../services/api';

jest.mock('../../services/api');

describe('Movie', () => {
  let movieElement;
  const mockMovieData = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test-poster.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    overview: 'Test overview'
  };

  beforeEach(() => {
    global.import = { meta: { env: { VITE_IMAGE_BASE_URL: 'http://test-image-url.com/' } } };
    movieElement = new Movie(mockMovieData);
    document.body.appendChild(movieElement);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('renders movie details correctly', () => {
    expect(movieElement.querySelector('img').src).toContain(mockMovieData.poster_path);
    expect(movieElement.querySelector('h2').textContent).toBe(mockMovieData.title);
    expect(movieElement.querySelector('p').textContent).toContain('2023');
    expect(movieElement.querySelector('.vote-average').textContent).toBe('8.5');
    expect(movieElement.querySelectorAll('p')[2].textContent).toBe(mockMovieData.overview);
  });

  test('handles missing data gracefully', () => {
    const incompleteMovieData = { id: 2 };
    const incompleteMovie = new Movie(incompleteMovieData);
    document.body.appendChild(incompleteMovie);
 
    expect(incompleteMovie.querySelector('h2').textContent).toBe('');
    expect(incompleteMovie.querySelector('p').textContent).toContain('-');
    expect(incompleteMovie.querySelector('.vote-average').textContent).toBe('-');
    expect(incompleteMovie.querySelectorAll('p')[2].textContent).toBe('No Overview Given.');
  });

  test('toggles movie details when clicking view more button', async () => {
    const mockDetails = {
      id: 1,
      title: 'Expanded Movie',
      poster_path: '/expanded-poster.jpg',
      overview: 'Expanded overview',
      videos: { results: [] },
      reviews: { results: [] },
      similar: { results: [] }
    };
    fetchMovieDetails.mockResolvedValue(mockDetails);

    const viewMoreButton = movieElement.querySelector('button');
    await viewMoreButton.click();

    expect(movieElement.classList.contains('expanded')).toBe(true);
    expect(movieElement.querySelector('h2').textContent).toBe('Expanded Movie');
    expect(movieElement.querySelector('p').textContent).toBe('Expanded overview');

    const exitButton = movieElement.querySelector('button');
    await exitButton.click();

    expect(movieElement.classList.contains('expanded')).toBe(false);
    expect(movieElement.querySelector('h2').textContent).toBe('Test Movie');
  });

  test('renders trailer when available', async () => {
    const mockDetailsWithTrailer = {
      id: 1,
      title: 'Movie with Trailer',
      poster_path: '/poster.jpg',
      overview: 'Overview',
      videos: { results: [{ type: 'Trailer', key: 'trailerKey' }] },
      reviews: { results: [] },
      similar: { results: [] }
    };
    fetchMovieDetails.mockResolvedValue(mockDetailsWithTrailer);

    const viewMoreButton = movieElement.querySelector('button');
    await viewMoreButton.click();

    const iframe = movieElement.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe.src).toContain('trailerKey');
  });

  test('renders reviews and similar movies', async () => {
    const mockDetailsWithReviewsAndSimilar = {
      id: 1,
      title: 'Movie with Reviews and Similar',
      poster_path: '/poster.jpg',
      overview: 'Overview',
      videos: { results: [] },
      reviews: { results: [
        { author: 'Reviewer 1', content: 'Great movie' },
        { author: 'Reviewer 2', content: 'Awesome' },
        { author: 'Reviewer 3', content: 'Should not appear' }
      ] },
      similar: { results: [
        { title: 'Similar Movie 1' },
        { title: 'Similar Movie 2' },
        { title: 'Similar Movie 3' },
        { title: 'Similar Movie 4' },
        { title: 'Similar Movie 5' },
        { title: 'Similar Movie 6' }
      ] }
    };
    fetchMovieDetails.mockResolvedValue(mockDetailsWithReviewsAndSimilar);

    const viewMoreButton = movieElement.querySelector('button');
    await viewMoreButton.click();

    const reviews = movieElement.querySelectorAll('.review');
    expect(reviews.length).toBe(2);
    expect(reviews[0].textContent).toContain('Reviewer 1');
    expect(reviews[1].textContent).toContain('Reviewer 2');

   
  });
});
