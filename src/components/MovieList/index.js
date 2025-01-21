import { fetchNowPlaying } from '../../services/index'
import Movie from '../Movie'
import { getCurrentPage, performSearch } from '../../utils/index'

let isLoading = false
export function renderMovies(movies) {
    const movieList = document.getElementById('movie-list')
    if (!movieList) {
        console.error('Movie list element not found')
        return
    }

    const fragment = document.createDocumentFragment()

    movies.forEach((movie) => {
        fragment.appendChild(new Movie(movie))
    })

    movieList.appendChild(fragment)
}

export function renderMovieList() {
    const appElement = document.querySelector('#app')
    if (appElement) {
        const main = document.createElement('main')
        const movieList = document.createElement('div')
        movieList.id = 'movie-list'

        main.appendChild(movieList)

        appElement.appendChild(main)
        performSearch('')
    } else {
        console.error('App element not found')
    }
}

export async function loadMovies() {
    if (isLoading) return
    isLoading = true

    try {
        const { results } = await fetchNowPlaying(getCurrentPage())
        renderMovies(results)
    } catch (error) {
        console.error('Error loading movies:', error)
    } finally {
        isLoading = false
    }
}
