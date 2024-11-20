import React, { useEffect, useState } from 'react';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import AppRoutes from '../src/router/AppRouter';
import Footer from './components/Footer';
import AuthService from './services/AuthService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated());
  }, []);

  return (
    <div className="App">
      <Router>
        {/* {isAuthenticated && <Header />} */}
        <Header />
        <AppRoutes />
        <Footer />
      </Router>
    </div>
  );
}

export default App;
