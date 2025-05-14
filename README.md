# React WordPress Blog

A modern React frontend for a WordPress blog using the WordPress REST API.

## Features
- Fetch and display WordPress posts with pagination
- View single posts with related posts
- Filter posts by categories and tags
- Search functionality
- Responsive design

## Prerequisites
- Node.js v14+ and npm
- WordPress installation with REST API enabled

## Setup
1. Clone this repository
2. Install dependencies: `npm install`
3. Configure WordPress API URL in `.env` file:
   ```
   VITE_WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
   ```
4. Start development server: `npm run dev`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Configuration
API configuration is handled in `src/utils/api.js`. Key functions include:
- `fetchPosts()` - Get paginated posts
- `fetchPostBySlug()` - Get single post
- `fetchCategories()`/`fetchTags()` - Get taxonomy terms
- `searchPosts()` - Search functionality