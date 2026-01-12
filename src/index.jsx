import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './hooks/useTheme.jsx';
import './styles/global.css';

/**
 * PlacePulse - Real-Time Place Intelligence
 * Main entry point for the React application
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </ThemeProvider>
  </React.StrictMode>
);
