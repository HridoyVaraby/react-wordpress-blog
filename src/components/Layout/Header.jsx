import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <circle cx="24" cy="24" r="23" stroke="black" strokeWidth="2"/>
              <path d="M24 13.2V34.8" stroke="black" strokeWidth="2"/>
              <path d="M13.2 24H34.8" stroke="black" strokeWidth="2"/>
            </svg>
            <span className="text-lg font-medium">Inside Design</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-primary hover:text-accent transition-colors">Home</Link>
            <Link to="/category/design" className="text-primary hover:text-accent transition-colors">Design</Link>
            <Link to="/category/interviews" className="text-primary hover:text-accent transition-colors">Interviews</Link>
            <Link to="/category/research" className="text-primary hover:text-accent transition-colors">Research</Link>
          </nav>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="hidden md:flex items-center mr-4">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-light-gray rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <button type="submit" className="ml-2 text-primary hover:text-accent">
                <FiSearch size={20} />
              </button>
            </form>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 text-primary md:hidden focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/category/design" 
                className="text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Design
              </Link>
              <Link 
                to="/category/interviews" 
                className="text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Interviews
              </Link>
              <Link 
                to="/category/research" 
                className="text-primary hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Research
              </Link>
              <form onSubmit={handleSearch} className="flex items-center pt-4">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-light-gray rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button type="submit" className="ml-2 text-primary hover:text-accent">
                  <FiSearch size={20} />
                </button>
              </form>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header