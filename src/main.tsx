import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './index.css'; // Your global styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* AuthProvider must wrap any component that uses the useAuth hook */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);