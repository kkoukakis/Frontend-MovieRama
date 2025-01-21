import { searchMovies } from '../services/index'
import { loadMovies, renderMovies } from '../components/index'
import debounce from './debounce'
import {
    getCurrentPage,
    increaseCurrentPage,
    resetCurrentPage,
} from './currentPage'

export async function performSearch(query) {
    if (query?.length === 0) {
        const nav = document.getElementById('navbar-title')
        nav.textContent = 'In theaters'
        await loadMovies()
    } else {
        try {
            const nav = document.getElementById('navbar-title')
            nav.textContent = 'Searching'
            const data = await searchMovies(query, getCurrentPage())
            renderMovies(data.results)
        } catch (error) {
            console.error('Error performing search:', error)
        }
    }
    increaseCurrentPage()
}

function updateTitle(query) {
    document.title = `${query ? `🔍 • ${query}` : '🎬'} • MovieRama • `
}

function clearMovieList() {
    const movieList = document.getElementById('movie-list')
    if (movieList) {
        movieList.innerHTML = ''
    }
}

export function setupSearch() {
    const searchInput = document.getElementById('search-input')

    const handleSearchInputChange = debounce((e) => {
        resetCurrentPage()
        const query = e.target.value.trim()
        clearMovieList()
        updateTitle(query)
        performSearch(query)
    }, 350)

    searchInput.addEventListener('input', handleSearchInputChange)
}
