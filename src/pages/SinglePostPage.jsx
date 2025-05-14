import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchPostBySlug, fetchRelatedPosts } from '../utils/api'
import { formatDate } from '../utils/formatDate'
import PostCard from '../components/BlogCards/PostCard'
import NewsletterForm from '../components/NewsletterForm'
import parse from 'html-react-parser'
import NotFoundPage from './NotFoundPage'

const SinglePostPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const postData = await fetchPostBySlug(slug)
        setPost(postData)
        
        // Fetch related posts
        if (postData) {
          const categories = postData._embedded?.['wp:term']?.[0] || []
          const tags = postData._embedded?.['wp:term']?.[1] || []
          
          const categoryIds = categories.map(cat => cat.id)
          const tagIds = tags.map(tag => tag.id)
          
          const relatedPostsData = await fetchRelatedPosts(
            postData.id,
            categoryIds,
            tagIds,
            3
          )
          
          setRelatedPosts(relatedPostsData)
        }
      } catch (err) {
        console.error('Error loading post:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [slug])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-light-gray w-1/3 rounded mb-4 animate-pulse"></div>
          <div className="h-12 bg-light-gray w-2/3 rounded mb-8 animate-pulse"></div>
          
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-light-gray animate-pulse"></div>
            <div className="ml-4">
              <div className="h-4 bg-light-gray w-32 rounded animate-pulse"></div>
              <div className="h-3 bg-light-gray w-24 mt-2 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="h-80 bg-light-gray rounded-lg mb-8 animate-pulse"></div>
          
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-light-gray rounded w-full mb-4 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !post) {
    return <NotFoundPage />
  }

  const {
    title,
    content,
    date,
    _embedded = {},
  } = post

  // Get featured image URL
  const featuredImageUrl = _embedded?.['wp:featuredmedia']?.[0]?.source_url || 
    'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg'

  // Get author
  const author = _embedded?.['author']?.[0] || {}
  
  // Get categories and tags
  const categories = _embedded?.['wp:term']?.[0] || []
  const tags = _embedded?.['wp:term']?.[1] || []

  return (
    <>
      <Helmet>
        <title>{title?.rendered || 'Blog Post'} | Inside Design</title>
        <meta 
          name="description" 
          content={post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Read this article on Inside Design'} 
        />
        <meta property="og:title" content={title?.rendered || 'Blog Post'} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={featuredImageUrl} />
      </Helmet>

      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Link 
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="inline-block px-3 py-1 bg-light-gray text-primary text-xs font-medium rounded-md hover:bg-gray transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              dangerouslySetInnerHTML={{ __html: title?.rendered || 'Untitled' }}
            />
            
            {/* Author & Date */}
            <div className="flex items-center mb-10">
              <Link to={`/author/${author.slug}`} className="flex items-center group">
                <img
                  src={author.avatar_urls?.['96'] || 'https://secure.gravatar.com/avatar/?s=96&d=mm&r=g'}
                  alt={author.name || 'Author'}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <span className="block text-primary font-medium group-hover:text-accent transition-colors">
                    {author.name || 'Unknown author'}
                  </span>
                  <time className="text-tertiary text-sm">{formatDate(date)}</time>
                </div>
              </Link>
            </div>
            
            {/* Featured Image */}
            <div className="mb-10">
              <img 
                src={featuredImageUrl} 
                alt={title?.rendered || 'Featured image'} 
                className="w-full h-auto rounded-lg"
              />
            </div>
            
            {/* Content */}
            <div className="post-content">
              {content?.rendered && parse(content.rendered)}
            </div>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-10 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
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
            )}
          </div>
        </div>
      </article>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to our newsletter
            </h2>
            <p className="text-secondary mb-8">
              Stay up to date with the latest news, announcements, and articles.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}

export default SinglePostPage