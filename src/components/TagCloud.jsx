import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchTags } from '../utils/api'

const TagCloud = () => {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTags = async () => {
      try {
        setLoading(true)
        const tagsData = await fetchTags()
        setTags(tagsData)
      } catch (err) {
        setError('Failed to load tags. Please try again later.')
        console.error('Error loading tags:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTags()
  }, [])

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-light-gray h-8 w-20 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return null
  }

  // Sort tags by count and limit to 15
  const popularTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 15)

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {popularTags.map(tag => (
          <Link
            key={tag.id}
            to={`/tag/${tag.slug}`}
            className="px-3 py-1 bg-light-gray text-primary text-sm rounded-md hover:bg-gray transition-colors"
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TagCloud