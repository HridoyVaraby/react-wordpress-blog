import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

const FeaturedPostCard = ({ post }) => {
  if (!post) return null

  const {
    title,
    excerpt,
    date,
    slug,
    _embedded = {},
  } = post

  // Get featured image URL
  const featuredImageUrl = _embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg'

  // Get author
  const author = _embedded?.['author']?.[0] || {}
  
  // Get category
  const categories = _embedded?.['wp:term']?.[0] || []
  const mainCategory = categories[0] || { name: 'Uncategorized', slug: 'uncategorized' }

  return (
    <article className="flex flex-col md:flex-row overflow-hidden bg-white rounded-lg transition-shadow duration-300 hover:shadow-md h-full">
      <div className="md:w-1/2 overflow-hidden">
        <Link to={`/post/${slug}`}>
          <img 
            src={featuredImageUrl} 
            alt={title?.rendered || 'Featured post'} 
            className="w-full h-64 md:h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
      </div>
      <div className="md:w-1/2 p-6 flex flex-col">
        <div className="flex items-center mb-3">
          <Link 
            to={`/category/${mainCategory.slug}`}
            className="inline-block px-3 py-1 bg-light-gray text-primary text-xs font-medium rounded-md hover:bg-gray transition-colors"
          >
            {mainCategory.name}
          </Link>
          <span className="mx-2 text-gray">•</span>
          <time className="text-tertiary text-sm">{formatDate(date)}</time>
        </div>
        
        <Link to={`/post/${slug}`} className="group">
          <h2 
            className="text-xl md:text-2xl font-bold mb-3 group-hover:text-accent transition-colors"
            dangerouslySetInnerHTML={{ __html: title?.rendered || 'Untitled' }}
          />
        </Link>
        
        <div 
          className="text-secondary mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: excerpt?.rendered || '' }}
        />
        
        <div className="mt-auto flex items-center">
          <Link to={`/author/${author.slug}`} className="flex items-center group">
            <img
              src={author.avatar_urls?.['48'] || 'https://secure.gravatar.com/avatar/?s=48&d=mm&r=g'}
              alt={author.name || 'Author'}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-primary group-hover:text-accent transition-colors">
              {author.name || 'Unknown author'}
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default FeaturedPostCard