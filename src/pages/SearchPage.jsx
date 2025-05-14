import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PostCard from '../components/BlogCards/PostCard'
import { searchPosts } from '../utils/api'
import { FiSearch } from 'react-icons/fi'

const SearchPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const searchQuery = queryParams.get('q') || ''
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setPosts([])
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        
        const result = await searchPosts(searchQuery, currentPage, 9)
        
        setPosts(result.posts)
        setTotalPages(result.totalPages)
        setTotalPosts(result.total)
      } catch (err) {
        console.error('Error searching posts:', err)
        setError('Failed to search. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    performSearch()
    setLocalSearchQuery(searchQuery)
  }, [searchQuery, currentPage])

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`)
      setCurrentPage(1)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Helmet>
        <title>{searchQuery ? `Search results for "${searchQuery}"` : 'Search'} | Inside Design</title>
        <meta 
          name="description" 
          content={searchQuery ? `Search results for "${searchQuery}" on Inside Design` : 'Search articles on Inside Design'} 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex items-center mb-8">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search articles..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-tertiary" size={20} />
            </div>
            <button
              type="submit"
              className="ml-4 px-6 py-3 bg-primary text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>

          {searchQuery && (
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {totalPosts > 0 
                  ? `Found ${totalPosts} result${totalPosts !== 1 ? 's' : ''} for "${searchQuery}"`
                  : `No results found for "${searchQuery}"`
                }
              </h1>
              {totalPosts === 0 && !loading && (
                <p className="text-secondary">
                  Try different keywords or check for typos.
                </p>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-light-gray rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 mr-2 rounded ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-light-gray text-primary hover:bg-gray transition-colors'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1
                    // Show limited page numbers to avoid overcrowding
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 mx-1 rounded-full ${
                            currentPage === pageNumber
                              ? 'bg-primary text-white'
                              : 'bg-light-gray text-primary hover:bg-gray transition-colors'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={pageNumber} className="mx-1">...</span>
                    }
                    return null
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 ml-2 rounded ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-light-gray text-primary hover:bg-gray transition-colors'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No posts match your search criteria.</p>
            <p className="text-secondary">Try different keywords or check for typos.</p>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default SearchPage