import { useState, useEffect } from 'react'
import PostCard from './BlogCards/PostCard'
import { fetchPosts } from '../utils/api'

const BlogGrid = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const { posts, totalPages } = await fetchPosts({
          per_page: 9,
          page: currentPage,
        })
        setPosts(posts)
        setTotalPages(totalPages)
      } catch (err) {
        setError('Failed to load posts. Please try again later.')
        console.error('Error loading posts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">All blog posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-light-gray rounded-lg h-96 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">All blog posts</h2>
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
    </div>
  )
}

export default BlogGrid