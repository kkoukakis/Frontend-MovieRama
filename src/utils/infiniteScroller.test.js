import setupInfiniteScroll from './infiniteScroller'
import { performSearch } from './search'
import debounce from './debounce'

jest.mock('./search')
jest.mock('./debounce')

describe('setupInfiniteScroll', () => {
    let mockObserve
    let mockIntersectionObserver

    beforeEach(() => {
        mockObserve = jest.fn()
        mockIntersectionObserver = jest.fn(() => ({
            observe: mockObserve,
        }))
        global.IntersectionObserver = mockIntersectionObserver

        document.body.innerHTML = '<main></main>'
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.resetAllMocks()
        document.body.innerHTML = ''
    })

    it('should set up infinite scroll correctly', () => {
        setupInfiniteScroll()

        expect(document.querySelector('#tracker')).not.toBeNull()
        expect(mockIntersectionObserver).toHaveBeenCalled()
        expect(mockObserve).toHaveBeenCalled()
    })

    it('should call performSearch when intersecting', async () => {
        const mockDebounce = jest.fn((fn) => fn)
        debounce.mockImplementation(mockDebounce)

        setupInfiniteScroll()

        const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]
        const mockEntry = { isIntersecting: true }

        document.body.innerHTML =
            '<input id="search-input" value="test query" />'

        await intersectionCallback([mockEntry])

        expect(performSearch).toHaveBeenCalledWith('test query')
    })

    it('should not call performSearch when not intersecting', async () => {
        const mockDebounce = jest.fn((fn) => fn)
        debounce.mockImplementation(mockDebounce)

        setupInfiniteScroll()

        const intersectionCallback = mockIntersectionObserver.mock.calls[0][0]
        const mockEntry = { isIntersecting: false }

        await intersectionCallback([mockEntry])

        expect(performSearch).not.toHaveBeenCalled()
    })

    it('should log error when main element is not found', () => {
        document.body.innerHTML = ''
        setupInfiniteScroll()

        expect(console.error).toHaveBeenCalledWith('Main element not found')
    })
})
