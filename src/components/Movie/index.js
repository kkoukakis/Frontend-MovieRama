import { fetchMovieDetails } from '../../services/api'
import movieFallback from '../../assets/fallback_movie.png'

class Movie extends HTMLElement {
    constructor({
        id,
        title,
        poster_path,
        release_date,
        vote_average,
        overview,
    }) {
        super()

        const img = document.createElement('img')
        img.src = `${import.meta.env.VITE_IMAGE_BASE_URL}${poster_path}`
        img.alt = title
        img.height = 400
        img.width = 270
        img.onerror = function () {
            this.onerror = null
            this.src = movieFallback
        }

        const h2 = document.createElement('h2')
        h2.textContent = title

        const releaseYear = document.createElement('p')
        releaseYear.textContent = `Release Year: ${release_date ? release_date.split('-')[0] : '-'}`

        const voteAvg = document.createElement('p')
        voteAvg.className = 'vote-average'
        voteAvg.textContent = `${vote_average ? Number(vote_average).toFixed(1) : '-'}`

        const overviewP = document.createElement('p')
        overviewP.textContent = overview || 'No Overview Given.'

        this.appendChild(img)
        this.appendChild(h2)
        this.appendChild(releaseYear)
        this.appendChild(voteAvg)
        this.appendChild(overviewP)

        const exitButton = document.createElement('button')
        exitButton.addEventListener('click', () => this.toggleMovieDetails(id))
        exitButton.textContent = 'View More'
        exitButton.style.cursor = 'pointer'

        this.appendChild(exitButton)
    }

    set movie({
        id,
        title,
        poster_path,
        release_date,
        vote_average,
        overview,
    }) {
        this.movie = {
            id,
            title,
            poster_path,
            release_date,
            vote_average,
            overview,
        }
    }

    get movie() {
        return this.movie
    }

    async toggleMovieDetails(id) {
        if (this.classList.contains('expanded')) {
            this.classList.remove('expanded')
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
            this.append(...this.originalContent)
        } else {
            const details = await fetchMovieDetails(id)
            this.originalContent = Array.from(this.childNodes)
            this.classList.add('expanded')
            this.createExpandedContent(details, this)
        }
    }

    createExpandedContent(details) {
        this.innerHTML = '' // Clear existing content

        const exitButton = document.createElement('button')
        exitButton.addEventListener('click', () =>
            this.toggleMovieDetails(details.id)
        )
        exitButton.textContent = 'X'
        exitButton.style.cursor = 'pointer'
        exitButton.style.position = 'absolute'
        exitButton.style.top = '20px'
        exitButton.style.right = '120px'

        const title = document.createElement('h2')
        title.textContent = details.title
        title.style.color = 'whitesmoke'
        title.style.fontSize = '11rem'
        title.style.fontWeight = '900'

        const imgTrailerContainer = document.createElement('div')
        const img = document.createElement('img')
        img.src = `${import.meta.env.VITE_IMAGE_BASE_URL}${details.poster_path}`
        img.alt = details.title
        img.onerror = function () {
            this.onerror = null
            this.src = movieFallback
        }

        imgTrailerContainer.appendChild(img)
        this.appendChild(title)

        if (details?.videos?.results.length > 0) {
            const trailer = details.videos.results.find(
                (video) => video.type === 'Trailer'
            )
            if (trailer) {
                const iframe = document.createElement('iframe')
                iframe.width = '100%'
                iframe.height = '100%'
                iframe.src = `https://www.youtube.com/embed/${trailer.key}`
                iframe.style.border = 'none'
                iframe.allowFullscreen = true
                imgTrailerContainer.appendChild(iframe)
            }
        }

        this.appendChild(exitButton)
        this.appendChild(imgTrailerContainer)

        const overview = document.createElement('p')
        overview.textContent = details.overview
        overview.style.maxWidth = '50%'
        this.appendChild(overview)

        const imdb = document.createElement('a')
        imdb.href = `https://www.imdb.com/title/${details.imdb_id}`

        const imdbImage = document.createElement('img')
        imdbImage.src =
            'https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg'
        imdbImage.style.width = '40px'
        imdbImage.style.height = '20px'
        imdb.appendChild(imdbImage)
        imdb.target = '_blank'
        this.appendChild(imdb)

        const reviewsTitle = document.createElement('h3')
        reviewsTitle.textContent = 'Reviews'
        this.appendChild(reviewsTitle)
        const reviewList = document.createElement('div')
        reviewList.className = 'reviewList'
        this.appendChild(reviewList)
        // Up to two
        details.reviews.results.slice(0, 2).forEach((review) => {
            const reviewP = document.createElement('p')
            reviewP.className = 'review'
            const strong = document.createElement('strong')
            strong.textContent = `${review.author}: `
            reviewP.appendChild(strong)
            reviewP.innerHTML += review.content
            reviewList.appendChild(reviewP)
        })

        const similarTitle = document.createElement('h3')
        similarTitle.textContent = 'Similar Movies'
        this.appendChild(similarTitle)
        const similarMoviesContainer = document.createElement('div')
        similarMoviesContainer.style.display = 'flex'
        similarMoviesContainer.style.gap = '10px'
        details.similar.results.slice(0, 5).forEach((movie) => {
            const movieP = document.createElement('a')
            movieP.textContent = movie.title

            similarMoviesContainer.appendChild(movieP)
        })
        this.appendChild(similarMoviesContainer)
    }
}

customElements.define('movie-item', Movie)

export default Movie
