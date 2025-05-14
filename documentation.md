# Inside Design Blog Documentation

This documentation provides instructions on how to set up, deploy, and maintain the Inside Design blog, which uses React for the frontend and WordPress as a headless CMS.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Setting Up the Frontend](#setting-up-the-frontend)
5. [Setting Up WordPress as a Headless CMS](#setting-up-wordpress-as-a-headless-cms)
6. [Connecting React to WordPress REST API](#connecting-react-to-wordpress-rest-api)
7. [Deployment](#deployment)
8. [Content Management](#content-management)
9. [Extending the Blog](#extending-the-blog)
10. [Troubleshooting](#troubleshooting)

## Project Overview

The Inside Design blog is a modern tech blog built with:

- **Frontend**: React + Vite, Tailwind CSS, React Router DOM
- **Backend**: WordPress (Headless CMS mode using REST API)
- **Data Fetching**: Axios and SWR for efficient data fetching and caching
- **SEO**: React Helmet for managing document head

The blog features a clean, minimalist design with:

- Home page with hero section, featured posts, and blog grid
- Detailed blog post pages
- Category and tag filtering
- Search functionality
- Newsletter subscription form

## Prerequisites

Before setting up the project, you need:

1. Node.js (v14 or higher) and npm
2. A WordPress installation (self-hosted or hosted)
3. Basic knowledge of React and WordPress

## Project Structure

The project follows a modular structure:

```
inside-design-blog/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components
│   ├── utils/           # Helper functions and API utilities
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## Setting Up the Frontend

1. Clone the repository:

```bash
git clone <repository-url>
cd inside-design-blog
```

2. Install dependencies:

```bash
npm install
```

3. Update the WordPress API URL:

Open `src/utils/api.js` and update the `API_BASE_URL` constant with your WordPress site URL:

```javascript
const API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2'
```

4. Start the development server:

```bash
npm run dev
```

## Setting Up WordPress as a Headless CMS

1. **Install and configure WordPress**:
   - Set up WordPress on your chosen hosting provider
   - Log in to the WordPress admin dashboard

2. **Required plugins**:
   - Install and activate the following plugins:
     - **ACF (Advanced Custom Fields)** - For custom fields (optional but recommended)
     - **Yoast SEO** - For better SEO control
     - **JWT Authentication for WP REST API** - For secure authentication (if you plan to implement authenticated actions)
     - **CORS control plugin** like "Enable CORS" or manually configure CORS

3. **Configure REST API settings**:
   
   Ensure the WordPress REST API is properly enabled. By default, it should be available at:
   
   `https://your-wordpress-site.com/wp-json/wp/v2/`

4. **Enable CORS**:
   
   Add the following to your WordPress site's `.htaccess` file:

   ```apache
   # Add headers for CORS
   <IfModule mod_headers.c>
     Header set Access-Control-Allow-Origin "*"
     Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
     Header set Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"
   </IfModule>
   ```

   Or use a CORS plugin to handle this configuration.

5. **Content structure**:
   - Create categories that match your blog's needs (e.g., Design, Research, Interviews)
   - Create a few initial blog posts with featured images
   - Add tags to your posts for better organization

## Connecting React to WordPress REST API

The frontend is already configured to connect to the WordPress REST API using the utilities in `src/utils/api.js`. Key functions include:

- `fetchPosts()` - Get a list of posts with pagination
- `fetchPostBySlug()` - Get a single post by its slug
- `fetchCategories()` - Get all categories
- `fetchTags()` - Get all tags
- `fetchPostsByCategory()` - Filter posts by category
- `fetchPostsByTag()` - Filter posts by tag
- `searchPosts()` - Search for posts

Make sure to update the `API_BASE_URL` in `src/utils/api.js` to point to your WordPress site:

```javascript
const API_BASE_URL = 'https://your-wordpress-site.com/wp-json/wp/v2'
```

## Deployment

### Frontend Deployment (React)

The React frontend can be deployed to various hosting platforms:

#### Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy to Netlify:

```bash
# If using Netlify CLI
netlify deploy --prod
```

Or connect your GitHub repository to Netlify for continuous deployment.

#### Vercel

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel --prod
```

Or connect your GitHub repository to Vercel for continuous deployment.

#### Traditional Hosting (cPanel)

1. Build the project:

```bash
npm run build
```

2. Upload the contents of the `dist` folder to your web server using FTP.

### WordPress Deployment

1. Choose a WordPress hosting provider (Bluehost, SiteGround, WP Engine, etc.)
2. Install WordPress on your chosen domain or subdomain (e.g., blog.yoursite.com)
3. Configure the necessary plugins and settings as described in the "Setting Up WordPress as a Headless CMS" section

## Content Management

All content management is done through the WordPress admin dashboard:

1. **Creating Posts**:
   - Log in to your WordPress admin dashboard
   - Navigate to Posts > Add New
   - Add title, content, featured image, categories, and tags
   - Publish the post

2. **Managing Categories and Tags**:
   - Use the Categories and Tags sections in the WordPress dashboard

3. **Featured Images**:
   - Always add featured images to your posts for better visual appearance
   - Recommended size: 1200x800 pixels

4. **Adding Custom Fields** (if using ACF):
   - Create custom fields for additional metadata
   - Access custom fields in the REST API

## Extending the Blog

### Adding New Features

1. **Newsletter Integration**:
   - Sign up for a newsletter service like Mailchimp
   - Replace the mock subscription form in `src/components/NewsletterForm.jsx` with actual integration code

2. **Comments**:
   - Enable comments in WordPress
   - Add a comments component to the blog post page
   - Fetch comments via the REST API

3. **Social Sharing**:
   - Add social sharing buttons to posts using a library like `react-share`

4. **Authentication**:
   - Implement JWT authentication for protected actions
   - Add login/register functionality

### Customizing the Design

The blog uses Tailwind CSS for styling. To customize:

1. Modify the theme colors in `tailwind.config.js`
2. Update component styles in their respective files
3. Add new utility classes as needed

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your WordPress site has proper CORS headers
   - Check that the API URL is correct

2. **Missing Images**:
   - Verify that featured images are properly set in WordPress
   - Check the REST API response to ensure image URLs are included

3. **API Connection Failures**:
   - Confirm your WordPress site is online and accessible
   - Verify the REST API endpoint is working by visiting it directly in a browser

4. **Deployment Issues**:
   - Make sure the build process completes successfully
   - Check for environment-specific configuration issues

### Support and Resources

- React Documentation: [https://reactjs.org/docs](https://reactjs.org/docs)
- WordPress REST API Documentation: [https://developer.wordpress.org/rest-api/](https://developer.wordpress.org/rest-api/)
- Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- SWR Documentation: [https://swr.vercel.app/docs](https://swr.vercel.app/docs)