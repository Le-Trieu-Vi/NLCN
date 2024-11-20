import React from 'react';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import AppRoutes from './router/AppRouter';

import Header from './components/Header';
import  Footer  from './components/Footer';

function App() {

  return (
    <Router>
      <div className="App w-full h-42">
        <Header />
        <AppRoutes className=" overflow-y-scroll no-scrollbar"/>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

