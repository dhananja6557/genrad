// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import the pages
import HomePage from './HomePage.jsx';
import GeneratorPage from './GeneratorPage.jsx';
import ProjectHistoryPage from './ProjectHistoryPage.jsx'; // NEW
import LoginScreen from './components/LoginScreen.jsx';
import AuthCallback from './AuthCallback.jsx';

// Set up React Router
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "generator",
                element: <GeneratorPage />
            },
            {
                path: "history", // NEW
                element: <ProjectHistoryPage />
            },
            {
                path: "signin",
                element: <LoginScreen />
            },
            { 
                path: "auth/callback", 
                element: <AuthCallback /> 
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)