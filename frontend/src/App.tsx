import React from 'react';
import Home from './pages/Home'
import MapView from './components/MapView';

const App: React.FC = () => {
  return (
    <div>
      <h1>地図アプリ</h1>
      <Home/>
      <MapView />
    </div>
  );
};

export default App;
