import NewsletterForm from './NewsletterForm'

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Inside Design: Stories and interviews
          </h1>
          <p className="text-xl text-secondary mb-8">
            Subscribe to learn about new product features, the latest in technology, and updates.
          </p>
          <div className="max-w-lg mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection