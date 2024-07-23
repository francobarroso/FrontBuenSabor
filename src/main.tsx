import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0ProviderWithNavigate } from './components/auth0/Auth0ProviderWithNavigate.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
)
