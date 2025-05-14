import { useState, useEffect } from 'react'
import FeaturedPostCard from './BlogCards/FeaturedPostCard'
import { fetchPosts } from '../utils/api'

const FeaturedPosts = () => {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        setLoading(true)
        // In a real implementation, you might fetch posts with a specific tag or category for "featured"
        // Or you might have a custom field like "featured" set to true
        const { posts } = await fetchPosts({
          per_page: 2, // Only get two featured posts
          orderby: 'date', // Get the most recent
        })
        setFeaturedPosts(posts)
      } catch (err) {
        setError('Failed to load featured posts. Please try again later.')
        console.error('Error loading featured posts:', err)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedPosts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Recent blog posts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
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

  if (featuredPosts.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-8">Recent blog posts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {featuredPosts.map(post => (
          <FeaturedPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default FeaturedPosts