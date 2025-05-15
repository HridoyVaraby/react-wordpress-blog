import { useState, useEffect } from 'react';
import useSWR from 'swr';

const CACHE_KEY_PREFIX = 'wp_cache_';
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

const getCacheKey = (url) => `${CACHE_KEY_PREFIX}${url}`;

const fetcher = async (url) => {
  // Check batch cache first
  const batchCacheKey = Object.keys(localStorage).find(key => key.startsWith('batch-posts-'));
  if (batchCacheKey) {
    const { posts, timestamp, version } = JSON.parse(localStorage.getItem(batchCacheKey));
    const postSlug = new URL(url).searchParams.get('slug');
    
    if (version === 'v2' && Date.now() - timestamp < 3600000 && posts[postSlug]) {
      return posts[postSlug];
    }
  }
  // Check localStorage first
  const cacheKey = getCacheKey(url);
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    
    // Return cached data if not expired
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
  }

  // Fetch fresh data if no cache or expired
  const response = await fetch(url);
  const data = await response.json();
  
  // Cache the new data
  localStorage.setItem(
    cacheKey, 
    JSON.stringify({ 
      data, 
      timestamp: Date.now() 
    })
  );
  
  return data;
};

export const useCachedSWR = (url) => {
  const { data, error } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false
  });

  return { data, error };
};

export const prefetchData = async (url) => {
  const data = await fetcher(url);
  return data;
};

export const prefetchPosts = async (posts) => {
  if (!posts?.length) return;

  // Batch cache all posts at once
  const batchCacheKey = `batch-posts-${posts.map(p => p.id).join('-')}`;
  localStorage.setItem(batchCacheKey, JSON.stringify({
    posts: posts.reduce((acc, post) => ({
      ...acc,
      [post.slug]: post
    }), {}),
    timestamp: Date.now(),
    version: 'v2'
  }));

  // Cache individual posts with TTL
  posts.forEach(post => {
    const cacheKey = `post-${post.slug}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      post,
      timestamp: Date.now(),
      version: 'v2'
    }));
  });
};

export const clearCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};