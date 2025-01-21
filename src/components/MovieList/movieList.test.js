import { renderMovies, renderMovieList, loadMovies } from './index';
import { fetchNowPlaying } from '../../services/index';
import Movie from '../Movie';
import { getCurrentPage, performSearch } from '../../utils/index';

jest.mock('../../services/index');
jest.mock('../Movie');
jest.mock('../../utils/index');

describe('Movie Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    jest.clearAllMocks();
  });

  describe('renderMovies', () => {
    it('should render movies to the movie list', () => {
      const movieList = document.createElement('div');
      movieList.id = 'movie-list';
      document.body.appendChild(movieList);

      const mockMovies = [{ id: 1 }, { id: 2 }];
      Movie.mockImplementation(() => document.createElement('div'));

      renderMovies(mockMovies);

      expect(Movie).toHaveBeenCalledTimes(2);
      expect(movieList.children.length).toBe(2);
    });

    it('should log error if movie list element is not found', () => {
      console.error = jest.fn();
      renderMovies([]);
      expect(console.error).toHaveBeenCalledWith('Movie list element not found');
    });
  });

  describe('renderMovieList', () => {
    it('should create movie list structure and call performSearch', () => {
      renderMovieList();

      const main = document.querySelector('main');
      const movieList = document.getElementById('movie-list');

      expect(main).not.toBeNull();
      expect(movieList).not.toBeNull();
      expect(performSearch).toHaveBeenCalledWith('');
    });

    it('should log error if app element is not found', () => {
      document.body.innerHTML = '';
      console.error = jest.fn();

      renderMovieList();

      expect(console.error).toHaveBeenCalledWith('App element not found');
    });
  });
 
});
