import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SelectPage from './pages/SelectPage';
import ProfilePage from './pages/ProfilePage';
import GamePage from './pages/GamePage';
import ClearPage from './pages/ClearPage';
import { Wrapper } from './components/Wrapper';

const App = () => (
  <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/" element={<Wrapper />}>
          <Route
            path="/select"
            element={
              <SelectPage />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage />
            }
          />
          <Route
            path="/game"
            element={
              <GamePage />
            }
          />
          <Route
            path="/clear"
            element={
              <ClearPage />
            }
          />
        </Route>
      </Routes>
    </Router>
  </div>
);

export default App;