// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SelectPage from './pages/SelectPage';
import ProfilePage from '/pages/ProfilePage';
import GamePage from '/pages/GamePage';
import ClearPage from '/pages/ClearPage';
import RequireAuth from './components/RequireAuth';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route
                path="/select"
                element={
                    <RequireAuth>
                        <SelectPage />
                    </RequireAuth>
                }
            />
            <Route 
                path="/profile"
                element={
                    <RequireAuth>
                        <ProfilePage />
                    </RequireAuth>
                }
            />
            <Route 
                path="/game"
                element={
                    <RequireAuth>
                        <GamePage />
                    </RequireAuth>
                }
            />
            <Route 
                path="/clear"
                element={
                    <RequireAuth>
                        <ClearPage />
                    </RequireAuth>
                }
            />
        </Routes>
    </Router>
);

export default AppRoutes;
