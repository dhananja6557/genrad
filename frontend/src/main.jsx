import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Import the new pages
import HomePage from './HomePage.jsx';
import GeneratorPage from './GeneratorPage.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import AuthCallback from './AuthCallback.jsx';

// Set up React Router
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />, // App is the main layout
        children: [
            {
                index: true, // This is the default route
                element: <HomePage />
            },
            {
                path: "generator", // The generator page
                element: <GeneratorPage />
            },
            {
                path: "signin", // The login page
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
        {/* This <RouterProvider> is what fixes the error */}
        <RouterProvider router={router} />
    </React.StrictMode>,
)