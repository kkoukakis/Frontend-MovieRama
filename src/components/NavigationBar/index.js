class NavigationBar extends HTMLElement {
    constructor() {
        super()

        const title = document.createElement('h1')
        title.textContent = 'MovieRama'

        const searchInput = document.createElement('input')
        searchInput.type = 'text'
        searchInput.id = 'search-input'
        searchInput.placeholder = 'Search for movies...'

        const h2 = document.createElement('h2')
        h2.textContent = 'In Theaters'
        h2.id = 'navbar-title'
        this.appendChild(title)
        this.appendChild(searchInput)
        this.appendChild(h2)
    }

    set message(value) {
        this.lastElementChild.textContent = value
    }
}

customElements.define('navigation-bar', NavigationBar)

export default NavigationBar
