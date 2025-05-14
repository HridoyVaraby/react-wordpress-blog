import { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PostCard from '../components/BlogCards/PostCard'
import { fetchPostsByCategory, fetchPostsByTag } from '../utils/api'

const CategoryPage = () => {
  const { slug } = useParams()
  const location = useLocation()
  const isTagPage = location.pathname.includes('/tag/')
  
  const [posts, setPosts] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let result
        
        if (isTagPage) {
          result = await fetchPostsByTag(slug, currentPage, 9)
        } else {
          result = await fetchPostsByCategory(slug, currentPage, 9)
        }
        
        setPosts(result.posts)
        setTotalPages(result.totalPages)
        
        // Set metadata (category or tag info)
        if (result.posts.length > 0) {
          const terms = result.posts[0]._embedded?.['wp:term'] || []
          
          if (isTagPage && terms[1]) {
            const tag = terms[1].find(t => t.slug === slug)
            if (tag) setMetadata(tag)
          } else if (!isTagPage && terms[0]) {
            const category = terms[0].find(c => c.slug === slug)
            if (category) setMetadata(category)
          }
        }
      } catch (err) {
        console.error(`Error loading ${isTagPage ? 'tag' : 'category'} posts:`, err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [slug, isTagPage, currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const title = metadata?.name || (isTagPage ? `Tag: ${slug}` : `Category: ${slug}`)
  const description = metadata?.description || `Browse all posts ${isTagPage ? 'tagged with' : 'in category'} ${title}`

  return (
    <>
      <Helmet>
        <title>{title} | Inside Design</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          {metadata?.description && (
            <p className="text-lg text-secondary">{metadata.description}</p>
          )}
        </div>

        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-light-gray rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            <p>{`Failed to load ${isTagPage ? 'tag' : 'category'} posts. ${error}`}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl">No posts found in this {isTagPage ? 'tag' : 'category'}.</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  )
}

export default CategoryPage