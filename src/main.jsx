import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './route/index';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { HelmetProvider } from 'react-helmet-async';

// ✅ Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId="870422755736-mdp8oejit7itu6tctefpahh6vj364upa.apps.googleusercontent.com">
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
