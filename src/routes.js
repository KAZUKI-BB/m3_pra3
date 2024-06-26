// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SelectPage from './pages/SelectPage';
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
        </Routes>
    </Router>
);

export default AppRoutes;  // default export を追加
