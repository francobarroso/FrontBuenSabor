import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Auth0ProviderWithNavigate } from './components/auth0/Auth0ProviderWithNavigate.tsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
)
