import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './route/index';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// ✅ Google OAuth
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <GoogleOAuthProvider clientId="870422755736-89s1avp04108fa1esvapujrqriq6cps3.apps.googleusercontent.com">
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>,
)
