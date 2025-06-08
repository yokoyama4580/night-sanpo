import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './router/index';

const AppRoutes = () => {
  return useRoutes(routes);
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-screen bg-emerald-50 flex flex-col">
        <header className="text-center text-lg font-semibold py-4 shadow bg-white text-teal-500">
          ダイアルーと
        </header>
        <main className="flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </Router>
  )
}

export default App;
