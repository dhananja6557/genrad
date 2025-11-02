// src/components/LoginScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            // If loading is finished AND user is not logged in, redirect to login
            navigate('/generator');
        }
    }, [isLoggedIn, navigate]);

    // Start the OAuth flow by redirecting to the backend
    const GOOGLE_AUTH_URL = 'http://localhost:3000/auth/google';

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-xl shadow-2xl w-full max-w-sm text-center">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                    Sign In
                </h1>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                    <span className="text-2xl">G</span>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;