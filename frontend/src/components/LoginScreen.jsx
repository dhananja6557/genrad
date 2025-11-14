// src/components/LoginScreen.jsx
import React, { useEffect } from 'react';
// --- NEW: Import hooks for theme and icons ---
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Mail, Facebook, Github, Apple } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const LoginScreen = () => {
    // --- NEW: Get theme from the App.jsx layout ---
    const { theme } = useOutletContext();

    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/generator');
        }
    }, [navigate]);

    // --- MODIFIED: Use port 3001 to match your backend ---
    const GOOGLE_AUTH_URL = 'https://ai.esolution.lk:2508/auth/google';

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    // --- NEW: A reusable button component for social logins ---
    const SocialButton = ({ icon, text, onClick, disabled = false }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center justify-center space-x-3 py-3 px-4 border rounded-lg text-lg font-medium transition duration-150 ease-in-out
            ${disabled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                    : `${theme.inputBg} ${theme.inputBorder} ${theme.text} hover:${theme.hoverBg}`
                }
            `}
        >
            {icon}
            <span>{text}</span>
        </button>
    );

    return (
        // --- MODIFIED: Use theme styles for page background ---
        <div className="flex justify-center items-center min-h-[80vh] py-12">
            {/* --- MODIFIED: Use theme styles for login card --- */}
            <div className={`p-8 ${theme.cardBg} rounded-xl shadow-2xl w-full max-w-sm text-center border ${theme.cardBorder}`}>
                <h1 className={`text-3xl font-extrabold ${theme.text} mb-6`}>
                    Sign In
                </h1>

                <div className="space-y-4">
                    {/* Active Google Button */}
                    <SocialButton
                        icon={<Mail className="w-5 h-5" />} // Using Mail as a stand-in for Google
                        text="Sign in with Google"
                        onClick={handleGoogleLogin}
                    />

                    {/* --- NEW: Disabled Social Buttons --- */}
                    <SocialButton
                        icon={<Facebook className="w-5 h-5" />}
                        text="Sign in with Facebook"
                        disabled={true}
                    />

                    <SocialButton
                        icon={<Github className="w-5 h-5" />}
                        text="Sign in with GitHub"
                        disabled={true}
                    />

                    <SocialButton
                        icon={<Apple className="w-5 h-5" />}
                        text="Sign in with Apple"
                        disabled={true}
                    />
                </div>

                <p className={`mt-6 text-xs ${theme.textMuted}`}>
                    By signing in, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
