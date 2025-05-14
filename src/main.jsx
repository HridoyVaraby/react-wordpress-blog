import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SWRConfig } from 'swr'
import App from './App.jsx'
import './index.css'
import { fetcher } from './utils/api.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <SWRConfig value={{ 
        fetcher,
        revalidateOnFocus: false
      }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SWRConfig>
    </HelmetProvider>
  </React.StrictMode>,
)