import { Link } from 'react-router-dom'
import NewsletterForm from '../NewsletterForm'
import { FiTwitter, FiLinkedin, FiGithub, FiInstagram, FiYoutube } from 'react-icons/fi'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white pt-16 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <circle cx="24" cy="24" r="23" stroke="black" strokeWidth="2"/>
                <path d="M24 13.2V34.8" stroke="black" strokeWidth="2"/>
                <path d="M13.2 24H34.8" stroke="black" strokeWidth="2"/>
              </svg>
              <span className="text-lg font-medium">Inside Design</span>
            </Link>
            <p className="text-sm text-secondary mb-4">
              Design amazing digital experiences that create more happy people in the world.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Overview</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Features</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Solutions</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Tutorials</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Releases</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">About us</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Careers</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Press</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">News</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Media kit</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Newsletter</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Events</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Help center</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Tutorials</Link></li>
              <li><Link to="/" className="text-sm text-secondary hover:text-accent transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-secondary mb-4 md:mb-0">
              © {year} Inside Design. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FiTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FiLinkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FiGithub size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FiInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FiYoutube size={20} />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer