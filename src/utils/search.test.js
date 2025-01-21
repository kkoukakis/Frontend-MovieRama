import { performSearch, setupSearch } from './search';
import { searchMovies } from '../services/index';
import { loadMovies, renderMovies } from '../components/index';
import debounce from './debounce';
import { getCurrentPage, increaseCurrentPage, resetCurrentPage } from './currentPage';

jest.mock('../services/index');
jest.mock('../components/index');
jest.mock('./debounce');
jest.mock('./currentPage');

describe('Search functionality', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav id="navbar-title"></nav>
      <input id="search-input" />
      <div id="movie-list"></div>
    `;
    jest.clearAllMocks();
  });

  describe('performSearch', () => {
    it('should load movies when query is empty', async () => {
      await performSearch('');
      expect(document.getElementById('navbar-title').textContent).toBe('In theaters');
      expect(loadMovies).toHaveBeenCalled();
      expect(increaseCurrentPage).toHaveBeenCalled();
    });

    it('should search movies when query is not empty', async () => {
      const mockResults = { results: ['movie1', 'movie2'] };
      searchMovies.mockResolvedValue(mockResults);
      getCurrentPage.mockReturnValue(1);

      await performSearch('test query');

      expect(document.getElementById('navbar-title').textContent).toBe('Searching');
      expect(searchMovies).toHaveBeenCalledWith('test query', 1);
      expect(renderMovies).toHaveBeenCalledWith(mockResults.results);
      expect(increaseCurrentPage).toHaveBeenCalled();
    });

    it('should handle errors during search', async () => {
      searchMovies.mockRejectedValue(new Error('Search failed'));
      console.error = jest.fn();

      await performSearch('test query');

      expect(console.error).toHaveBeenCalledWith('Error performing search:', expect.any(Error));
    });
  });

  describe('setupSearch', () => {
    it('should set up event listener for search input', () => {
      const mockDebounce = jest.fn((fn) => fn);
      debounce.mockImplementation(mockDebounce);

      setupSearch();

      const searchInput = document.getElementById('search-input');
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));

      expect(resetCurrentPage).toHaveBeenCalled(); 
      expect(document.getElementById('movie-list').innerHTML).toBe('');
    });
  });
});
