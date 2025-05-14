import { useState } from 'react'

const NewsletterForm = ({ isDark = false }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')
    
    // Simulate API call to newsletter service
    try {
      // In a real implementation, you would send this to your newsletter API
      // await axios.post('/api/newsletter', { email })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`w-full ${isDark ? 'text-white' : 'text-primary'}`}>
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-accent
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white border border-gray'}`}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 font-medium rounded-md transition-colors
                ${isDark 
                  ? 'bg-white text-primary hover:bg-gray-100' 
                  : 'bg-primary text-white hover:bg-gray-800'
                } 
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </form>
      ) : (
        <div className="p-4 bg-green-50 text-green-800 rounded-md">
          <p>Thank you for subscribing! We've sent a confirmation to your email.</p>
        </div>
      )}
    </div>
  )
}

export default NewsletterForm