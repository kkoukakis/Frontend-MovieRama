import { renderMovieList } from './components/index'
import { NavigationBar } from './components'
import { setupSearch, setupInfiniteScroll } from './utils/index'

document.addEventListener('DOMContentLoaded', () => {
    document.title = '🎬 • MovieRama • 2025'

    const app = document.querySelector('#app')
    app.appendChild(new NavigationBar())
    renderMovieList()
    setupSearch()
    setupInfiniteScroll()
})
