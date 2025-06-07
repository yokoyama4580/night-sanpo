import React from 'react';
import Header from './components/Header';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './router/index';

const AppRoutes = () => {
  return useRoutes(routes);
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App;
