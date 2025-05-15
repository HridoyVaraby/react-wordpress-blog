import { useState, useEffect } from 'react';
import useSWR from 'swr';

const CACHE_KEY_PREFIX = 'wp_cache_';
const CACHE_EXPIRY = 3600000; // 1 hour in milliseconds

const getCacheKey = (url) => `${CACHE_KEY_PREFIX}${url}`;

const fetcher = async (url) => {
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

export const clearCache = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};