import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/HeroSection'
import FeaturedPosts from '../components/FeaturedPosts'
import BlogGrid from '../components/BlogGrid'
import NewsletterForm from '../components/NewsletterForm'
import TagCloud from '../components/TagCloud'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Inside Design: Stories and interviews</title>
        <meta 
          name="description" 
          content="Discover the latest design stories, interviews, and insights from industry experts." 
        />
      </Helmet>

      <HeroSection />
      <FeaturedPosts />
      <BlogGrid />
      
      <section className="py-16 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay up to date with the latest news, announcements, and articles
            </h2>
            <div className="mt-8">
              <NewsletterForm />
            </div>
            <TagCloud />
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage