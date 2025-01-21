import NavigationBar from './index';

describe('NavigationBar', () => {
  let navBar;

  beforeEach(() => {
    // Create an instance of the custom element
    navBar = new NavigationBar();
    document.body.appendChild(navBar);
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  it('should render the navigation bar with correct elements', () => {
    const title = navBar.querySelector('h1');
    const searchInput = navBar.querySelector('#search-input');
    const navbarTitle = navBar.querySelector('#navbar-title');

    expect(title).not.toBeNull();
    expect(title.textContent).toBe('MovieRama');

    expect(searchInput).not.toBeNull();
    expect(searchInput.type).toBe('text');
    expect(searchInput.placeholder).toBe('Search for movies...');
    expect(searchInput.id).toBe('search-input');

    expect(navbarTitle).not.toBeNull();
    expect(navbarTitle.textContent).toBe('In Theaters');
  });

  it('should update the navbar title when message is set', () => {
    const newMessage = 'Now Playing';
    navBar.message = newMessage;

    const navbarTitle = navBar.querySelector('#navbar-title');
    expect(navbarTitle.textContent).toBe(newMessage);
  });
});
