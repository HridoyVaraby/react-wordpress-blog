import axios from 'axios'
import { mutate } from 'swr'

// WordPress API base URL - using environment variable or fallback to a default URL
import { useCachedSWR, prefetchData } from './cacheService';

const API_BASE_URL = import.meta.env.VITE_WP_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

const getFullUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export const useApi = (endpoint) => {
  const url = getFullUrl(endpoint);
  return useCachedSWR(url);
};

export const prefetchApi = async (endpoint) => {
  const url = getFullUrl(endpoint);
  return await prefetchData(url);
};

export const prefetchPosts = async (posts) => {
  if (!posts?.length) return;

  await Promise.all(posts.map(async (post) => {
    const cacheKey = `post-${post.slug}`;
    
    // Check existing cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { timestamp, version } = JSON.parse(cached);
      if (version === CACHE_VERSION && Date.now() - timestamp < 3600000) {
        return;
      }
    }

    // Prefetch and cache
    try {
      const response = await api.get(`/posts/${post.id}`, {
        params: { _embed: true }
      });
      
      localStorage.setItem(cacheKey, JSON.stringify({
        post: response.data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      }));
    } catch (error) {
      console.error('Prefetch failed for post:', post.slug, error);
    }
  }));
};

// Create an axios instance with request/response interceptors for loading state
export const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add request interceptor for loading state
api.interceptors.request.use(
  (config) => {
    // Dispatch loading start event
    document.dispatchEvent(new CustomEvent('loading', { detail: { isLoading: true } }))
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for loading state
api.interceptors.response.use(
  (response) => {
    // Dispatch loading end event
    document.dispatchEvent(new CustomEvent('loading', { detail: { isLoading: false } }))
    return response
  },
  (error) => {
    document.dispatchEvent(new CustomEvent('loading', { detail: { isLoading: false } }))
    return Promise.reject(error)
  }
)

// Generic fetcher for SWR with enhanced caching
export const CACHE_VERSION = 'v1';

export const fetcher = async (url) => {
  try {
    // Check cache first
    const cacheKey = `swr-cache-${url}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp, version } = JSON.parse(cached);
      if (version === CACHE_VERSION && Date.now() - timestamp < 3600000) {
        return data;
      }
    }

    // Fetch fresh data if cache invalid
    const response = await api.get(url);
    
    // Cache with version and timestamp
    localStorage.setItem(cacheKey, JSON.stringify({
      data: response.data,
      timestamp: Date.now(),
      version: CACHE_VERSION
    }));
    
    return response.data;
  } catch (error) {
    const cacheKey = `swr-cache-${url}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const { data, timestamp, version } = JSON.parse(cached);
      if (version === CACHE_VERSION && Date.now() - timestamp < 86400000) {
        return data;
      }
    }
    
    throw error;
  }
};

// Fetch posts with optional parameters
export const fetchPosts = async (params = {}) => {
  try {
    // Sanitize and validate parameters
    const sanitizedParams = {
      _embed: true,
      per_page: Math.min(Math.max(1, parseInt(params.per_page) || 10), 100),
      page: Math.max(1, parseInt(params.page) || 1),
      ...params,
    }

    // Remove any undefined or null values
    Object.keys(sanitizedParams).forEach(key => {
      if (sanitizedParams[key] === undefined || sanitizedParams[key] === null) {
        delete sanitizedParams[key]
      }
    })
    
    const response = await api.get('/posts', { params: sanitizedParams })
    
    return {
      posts: response.data,
      totalPages: parseInt(response.headers['x-wp-totalpages'] || 1, 10),
      total: parseInt(response.headers['x-wp-total'] || 0, 10),
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw new Error(error.response?.data?.message || 'Failed to load posts')
  }
}

// Fetch a single post by slug
export const fetchPostBySlug = async (slug) => {
  try {
    // Check cache first
    const cacheKey = `post-${slug}`;
    const cachedPost = localStorage.getItem(cacheKey);
    
    if (cachedPost) {
      const { post, timestamp, version } = JSON.parse(cachedPost);
      if (version === CACHE_VERSION && Date.now() - timestamp < 3600000) {
        return post;
      }
    }

    // Fetch from API if no valid cache
    const response = await api.get('/posts', {
      params: { slug, _embed: true }
    });

    if (response.data.length === 0) {
      throw new Error('Post not found');
    }

    const postData = response.data[0];
    
    // Cache the post individually
    localStorage.setItem(cacheKey, JSON.stringify({
      post: postData,
      timestamp: Date.now(),
      version: CACHE_VERSION
    }));

    return postData;
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw error;
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories', {
      params: {
        per_page: 100, // Ensure we get all categories
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to load categories')
  }
}

// Fetch tags
export const fetchTags = async () => {
  try {
    const response = await api.get('/tags', {
      params: {
        per_page: 100, // Ensure we get all tags
      }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to load tags')
  }
}

// Fetch posts by category slug
export const fetchPostsByCategory = async (categorySlug, page = 1, perPage = 10) => {
  try {
    if (!categorySlug) {
      throw new Error('Category slug is required')
    }

    // First get the category ID from the slug
    const categoriesResponse = await api.get('/categories', {
      params: {
        slug: categorySlug,
        per_page: 1, // We only need one category
      }
    })
    
    if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
      throw new Error(`Category "${categorySlug}" not found`)
    }
    
    const categoryId = categoriesResponse.data[0].id
    
    // Then fetch posts with that category ID
    return fetchPosts({ 
      categories: categoryId,
      page: Math.max(1, parseInt(page) || 1),
      per_page: Math.min(Math.max(1, parseInt(perPage) || 10), 100),
    })
  } catch (error) {
    console.error(`Error fetching posts for category "${categorySlug}":`, error)
    throw new Error(error.message || `Failed to load posts for category "${categorySlug}"`)
  }
}

// Fetch posts by tag slug
export const fetchPostsByTag = async (tagSlug, page = 1, perPage = 10) => {
  try {
    if (!tagSlug) {
      throw new Error('Tag slug is required')
    }

    // First get the tag ID from the slug
    const tagsResponse = await api.get('/tags', {
      params: {
        slug: tagSlug,
        per_page: 1, // We only need one tag
      }
    })
    
    if (!tagsResponse.data || tagsResponse.data.length === 0) {
      throw new Error(`Tag "${tagSlug}" not found`)
    }
    
    const tagId = tagsResponse.data[0].id
    
    // Then fetch posts with that tag ID
    return fetchPosts({ 
      tags: tagId,
      page: Math.max(1, parseInt(page) || 1),
      per_page: Math.min(Math.max(1, parseInt(perPage) || 10), 100),
    })
  } catch (error) {
    console.error(`Error fetching posts for tag "${tagSlug}":`, error)
    throw new Error(error.message || `Failed to load posts for tag "${tagSlug}"`)
  }
}

// Search posts
export const searchPosts = async (query, page = 1, perPage = 10) => {
  try {
    return fetchPosts({
      search: query,
      page: Math.max(1, parseInt(page) || 1),
      per_page: Math.min(Math.max(1, parseInt(perPage) || 10), 100),
    })
  } catch (error) {
    console.error(`Error searching posts with query "${query}":`, error)
    throw new Error(`Failed to search posts: ${error.message}`)
  }
}

// Fetch related posts
export const fetchRelatedPosts = async (postId, categoryIds, tagIds, limit = 3) => {
  try {
    const sanitizedLimit = Math.min(Math.max(1, parseInt(limit) || 3), 10)
    
    // Try to find related posts based on categories
    if (categoryIds && categoryIds.length > 0) {
      const response = await api.get('/posts', {
        params: {
          categories: categoryIds.join(','),
          exclude: postId,
          per_page: sanitizedLimit,
          _embed: true,
        }
      })
      
      if (response.data.length >= sanitizedLimit) {
        return response.data
      }
      
      // If we didn't get enough posts by category, try tags
      if (tagIds && tagIds.length > 0) {
        const tagResponse = await api.get('/posts', {
          params: {
            tags: tagIds.join(','),
            exclude: postId,
            per_page: sanitizedLimit - response.data.length,
            _embed: true,
          }
        })
        
        return [...response.data, ...tagResponse.data]
      }
      
      return response.data
    }
    
    // If no categories, try tags
    if (tagIds && tagIds.length > 0) {
      const response = await api.get('/posts', {
        params: {
          tags: tagIds.join(','),
          exclude: postId,
          per_page: sanitizedLimit,
          _embed: true,
        }
      })
      
      return response.data
    }
    
    // If no categories or tags, just get recent posts
    const response = await api.get('/posts', {
      params: {
        exclude: postId,
        per_page: sanitizedLimit,
        _embed: true,
      }
    })
    
    return response.data
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}