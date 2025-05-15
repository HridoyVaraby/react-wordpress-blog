import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SWRConfig } from 'swr'
import App from './App.jsx'
import './index.css'
import { fetcher } from './utils/api.js'
import { getGravatarUrl } from './utils/gravatar'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <SWRConfig value={{ 
        fetcher,
        revalidateOnFocus: false
      }}>
        <BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }}>
          <App />
        </BrowserRouter>
      </SWRConfig>
    </HelmetProvider>
  </React.StrictMode>,
)