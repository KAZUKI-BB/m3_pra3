// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import SelectPage from './pages/SelectPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path='/select' element={<SelectPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;  // default export を追加
