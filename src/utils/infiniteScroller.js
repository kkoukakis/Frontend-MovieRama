import { performSearch } from './search';
import debounce from './debounce';

function setupInfiniteScroll() {
  const tracker = document.createElement('div');
  tracker.id = 'tracker';

  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.appendChild(tracker);
  } else {
    console.error('Main element not found');
    return;
  }

  const handleIntersect = debounce(async (entries) => {
    if (entries[0].isIntersecting) {
      const searchInput = document.getElementById('search-input');
      const query = searchInput ? searchInput.value.trim() : '';

      try {
        await performSearch(query);
      } catch (error) {
        console.error('Error performing search:', error);
      }
    }
  }, 300);

  const options = {
    root: null,
    rootMargin: '200px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(tracker);
}

export default setupInfiniteScroll;
