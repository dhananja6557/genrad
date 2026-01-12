// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- NEW
import App from './App.jsx';
import './index.css';

// Import the pages
import LandingPage from './LandingPage.jsx'; // <-- RENAMED
import GeneratorPage from './GeneratorPage.jsx';
import ProjectHistoryPage from './ProjectHistoryPage.jsx';
import ResearchPage from './ResearchPage.jsx';
import ResponsibilityPage from './ResponsibilityPage.jsx';
import ProductsPage from './ProductsPage.jsx';
import BuildPage from './BuildPage.jsx';

// REMOVED: LoginScreen and AuthCallback are no longer needed
// import LoginScreen from './components/LoginScreen.jsx';
// import AuthCallback from './AuthCallback.jsx';

// NEW: Get Client ID from environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
    console.error("FATAL: VITE_GOOGLE_CLIENT_ID is not defined in your .env file.");
}

// Set up React Router
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage /> // <-- CHANGED
            },
            {
                path: "generator",
                element: <GeneratorPage />
            },
            {
                path: "history",
                element: <ProjectHistoryPage />
            },
            {
                path: "research",
                element: <ResearchPage />
            },
            { 
                path: "responsibility", 
                element: <ResponsibilityPage /> 
            },
            {
                path: "products",
                element: <ProductsPage />
            },
            {
                path: "build",
                element: <BuildPage />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* NEW: Wrap app in GoogleOAuthProvider */}
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </React.StrictMode>,
)