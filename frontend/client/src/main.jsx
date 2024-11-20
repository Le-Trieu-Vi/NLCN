import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store';

import './index.css'
import App from './App.jsx'

import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>,
  {/* </StrictMode>, */}
)