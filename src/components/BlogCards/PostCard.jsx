import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import DefaultAvatar from '../../components/DefaultAvatar'

const PostCard = ({ post }) => {
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
    <article className="flex flex-col bg-white rounded-lg transition-shadow duration-300 hover:shadow-md h-full">
      <div className="overflow-hidden rounded-t-lg">
        <Link to={`/post/${slug}`}>
          <img 
            src={featuredImageUrl} 
            alt={title?.rendered || 'Post'} 
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-6 flex flex-col flex-grow">
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
        
        <Link to={`/post/${slug}`} className="group mb-3">
          <h2 
            className="text-lg font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: title?.rendered || 'Untitled' }}
          />
        </Link>
        
        <div 
          className="text-secondary mb-4 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{ __html: excerpt?.rendered || '' }}
        />
        
        <div className="mt-auto flex items-center">
          <Link to={`/author/${author.slug}`} className="flex items-center group">
            <DefaultAvatar
              name={author.name}
              size={24}
              className="mr-2"
            />
            <span className="text-tertiary text-sm group-hover:text-accent transition-colors">
              {author.name || 'Unknown author'}
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard