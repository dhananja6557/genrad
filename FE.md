// package.json
{
    "name": "vite-project",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview"
    },
    "dependencies": {
        "@react-oauth/google": "^0.12.2",
        "@tailwindcss/vite": "^4.1.16",
        "axios": "^1.13.1",
        "lucide-react": "^0.548.0",
        "react": "^19.1.1",
        "react-dom": "^19.1.1",
        "react-router-dom": "^7.9.4",
        "tailwindcss": "^4.1.16"
    },
    "devDependencies": {
        "@eslint/js": "^9.36.0",
        "@types/react": "^19.1.16",
        "@types/react-dom": "^19.1.9",
        "@vitejs/plugin-react": "^5.0.4",
        "eslint": "^9.36.0",
        "eslint-plugin-react-hooks": "^5.2.0",
        "eslint-plugin-react-refresh": "^0.4.22",
        "globals": "^16.4.0",
        "vite": "^7.1.7"
    }
}

// src/main.jsx
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

// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Sparkles, User, Settings, LifeBuoy, LogOut, History, Database } from 'lucide-react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

export default function App() {
    // --- 1. MODIFIED: Initialize state from localStorage or system preference ---
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // If no saved theme, fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    const { user, refetchUser } = useAuth();
    const navigate = useNavigate();

    // Event Listener for Auth Refresh
    useEffect(() => {
        const handleAuthRefresh = () => {
            if (refetchUser) {
                refetchUser();
            }
        };
        window.addEventListener('auth-refresh', handleAuthRefresh);
        return () => {
            window.removeEventListener('auth-refresh', handleAuthRefresh);
        };
    }, [refetchUser]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        window.dispatchEvent(new Event('auth-refresh'));
        // Use navigate for a "soft" navigation without page refresh
        navigate('/');
    };

    // --- 2. REMOVED: The old "Check for system preference on mount" useEffect is no longer needed ---
    // (The useState initializer above now handles this)

    // --- 3. ADDED: This useEffect runs when isDarkMode changes ---
    // It updates the document body and saves the choice to localStorage.
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]); // Re-runs ONLY when isDarkMode changes

    // --- 4. MODIFIED: toggleTheme is now simpler ---
    const toggleTheme = () => {
        // Just update the state. The useEffect above will handle the rest.
        setIsDarkMode(prev => !prev);
    };

    // State to manage the dropdown menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Effect to handle clicks outside the dropdown menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    // Theme classes
    const theme = {
        bg: isDarkMode ? 'bg-black' : 'bg-gray-50',
        text: isDarkMode ? 'text-white' : 'text-black',
        textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-600',
        border: isDarkMode ? 'border-gray-800' : 'border-gray-200',
        cardBg: isDarkMode ? 'bg-gray-900' : 'bg-white',
        cardBorder: isDarkMode ? 'border-gray-800' : 'border-gray-100',
        inputBg: isDarkMode ? 'bg-gray-900' : 'bg-white',
        inputBorder: isDarkMode ? 'border-gray-700' : 'border-gray-200',
        hoverBg: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
        accent: 'bg-red-600',
        accentHover: 'hover:bg-red-700',
        accentText: 'text-red-600',
        accentBg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
        accentBorder: isDarkMode ? 'border-red-800' : 'border-red-200',
        dropdownBg: isDarkMode ? 'bg-gray-900' : 'bg-white',
        dropdownHoverBg: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    };

    const TopNav = () => (
        <nav className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md border-b ${theme.border}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                            <Sparkles className={`w-7 h-7 ${theme.accentText}`} />
                            <span className={`font-bold text-xl ${theme.text}`}>GenRAD</span>
                        </Link>
                        <div className="hidden sm:flex sm:space-x-6">
                            {['Products', 'Build', 'Research', 'Responsibility'].map((item) => (
                                <a key={item} href="#" className={`text-sm font-medium ${theme.textMuted} hover:${isDarkMode ? 'text-white' : 'text-black'}`}>
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={menuRef}>

                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`hidden sm:flex items-center justify-center w-9 h-9 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full ${theme.hoverBg} overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
                                    title="User Profile"
                                    aria-haspopup="true"
                                    aria-expanded={isMenuOpen}
                                >
                                    {user.image ? (
                                        <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className={`w-5 h-5 ${theme.text}`} />
                                    )}
                                </button>

                                {isMenuOpen && (
                                    <div className={`absolute right-0 top-full mt-2 w-64 ${theme.dropdownBg} border ${theme.border} rounded-lg shadow-lg z-50 overflow-hidden`}>

                                        <div className="px-4 py-3">
                                            <p className={`text-sm font-semibold ${theme.text} truncate`}>{user.displayName}</p>
                                            <p className={`text-xs ${theme.textMuted} truncate`}>{user.email}</p>
                                        </div>
                                        <div className={`border-t ${theme.border}`}></div>

                                        <div className="px-4 py-3">
                                            <p className={`text-xs ${theme.textMuted} mb-1`}>Credits remaining</p>
                                            <div className="flex items-center gap-2">
                                                <Database className={`w-4 h-4 ${theme.accentText}`} />
                                                <p className={`text-sm font-medium ${theme.text}`}>
                                                    <span className="text-base font-bold">{user.credits}</span> / {user.totalCredits}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`border-t ${theme.border}`}></div>

                                        <div className="py-2">
                                            <Link
                                                to="/history"
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center space-x-3 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                            >
                                                <History className="w-5 h-5" />
                                                <span>Project History</span>
                                            </Link>
                                            <a
                                                href="#"
                                                className={`flex items-center space-x-3 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                            >
                                                <Settings className="w-5 h-5" />
                                                <span>Settings</span>
                                            </a>
                                            <a
                                                href="#"
                                                className={`flex items-center space-x-3 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                            >
                                                <LifeBuoy className="w-5 h-5" />
                                                <span>Support</span>
                                            </a>
                                        </div>

                                        <div className={`border-t ${theme.border}`}></div>

                                        <div className="py-2">
                                            <a
                                                onClick={handleLogout}
                                                style={{ cursor: 'pointer' }}
                                                className={`flex items-center space-x-3 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                            >
                                                <LogOut className="w-5 h-5" />
                                                <span>Log out</span>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/" // Go to landing page to sign in
                                className={`hidden sm:flex items-center space-x-1.5 text-sm font-medium ${theme.text} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} px-3 py-1.5 rounded-full ${theme.hoverBg}`}
                            >
                                <span className={`${theme.accentText} text-lg`}>+</span>
                                <span>Try GenRAD</span>
                            </Link>
                        )}

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${theme.hoverBg} ${theme.textMuted}`}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );

    return (
        <div className={`${isDarkMode ? 'dark' : ''} ${theme.bg}`}>
            <TopNav />
            {/* Remember to remove the top padding 'pt-6' from here */}
            <main className="min-h-screen max-w-7xl mx-auto px-6 pb-6">
                <Outlet context={{ theme, isDarkMode, refetchUser }} />
            </main>
        </div>
    );
}

// src/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Store the token
            localStorage.setItem('jwtToken', token);
            // 2. Redirect to the generator (URL is now clean)
            navigate('/generator', { replace: true });
        } else {
            // No token found, go to signin
            navigate('/signin', { replace: true });
        }
    }, [searchParams, navigate]);

    // You can render a loading spinner here
    return <div>Logging you in...</div>;
};

export default AuthCallback;

// src/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
    Sparkles,
    Zap,
    Code2,
    Smartphone,
    Monitor,
    Clock,
    Download,
    History,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import useAuth from './hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ai.esolution.lk:2508';

export default function LandingPage() {
    const { user, isLoggedIn, loading: authLoading, refetchUser } = useAuth();
    const navigate = useNavigate();
    const { theme, isDarkMode } = useOutletContext();

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (!authLoading && isLoggedIn) {
            navigate('/generator');
        }
    }, [isLoggedIn, authLoading, navigate]);

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoggingIn(true);
        setLoginError('');

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/google`, {
                token: credentialResponse.credential
            });

            if (response.data.token) {
                localStorage.setItem('jwtToken', response.data.token);
                window.dispatchEvent(new Event('auth-refresh'));

                if (refetchUser) {
                    await refetchUser();
                }
                navigate('/generator');
            } else {
                setLoginError('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.response?.data?.error || 'Failed to login. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGoogleError = () => {
        setLoginError('Google login failed. Please try again.');
    };

    const features = [
        {
            icon: Smartphone,
            title: 'React Native',
            description: 'Generate complete mobile apps with navigation, screens, and components'
        },
        {
            icon: Monitor,
            title: 'React + Vite',
            description: 'Create modern web applications with Tailwind CSS and routing'
        },
        {
            icon: Zap,
            title: 'AI-Powered',
            // MODIFIED: Updated text
            description: 'Powered by Anthropic Claude 3.5 Sonnet for superior code generation'
        },
        {
            icon: History,
            title: 'Project History',
            description: 'Save and manage unlimited projects for future access'
        },
        {
            icon: Download,
            title: 'Easy Export',
            description: 'Download your projects as JSON files instantly'
        },
        {
            icon: Clock,
            title: 'Fast Generation',
            description: 'Get complete project structures in seconds'
        }
    ];

    const benefits = [
        'Complete project structure with best practices',
        'TypeScript/JSX support out of the box',
        'Modern styling with Tailwind CSS',
        'Ready-to-run code with proper imports',
        'Commented code for easy understanding',
        'Production-ready architecture'
    ];

    const accentTextClass = theme.accentText;
    const accentBorderClass = theme.accentBorder;
    const accentBgClass = theme.accentBg;

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen bg-gradient-to-br from-red-500 to-red-500 opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <div className={`p-4 rounded-2xl ${accentBgClass} 
                                backdrop-blur-sm border ${accentBorderClass}`}>
                                <Sparkles
                                    className={accentTextClass}
                                    size={48}
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${theme.text}`}>
                            Build Projects with
                            <span className="block bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                AI in Seconds
                            </span>
                        </h1>

                        <p className={`text-xl sm:text-2xl ${theme.textMuted} max-w-3xl mx-auto mb-12`}>
                            Generate complete React Native or React + Vite projects instantly.
                            Just describe what you want to build, and let Claude AI do the rest.
                        </p>

                        {/* Login Section */}
                        <div className="flex flex-col items-center gap-6">
                            {(!isLoggingIn && !isLoggedIn) ? (
                                <div className={`${theme.cardBg} p-8 rounded-2xl border ${theme.cardBorder} shadow-lg`}>
                                    <p className={`text-lg mb-4 ${theme.text} font-medium`}>
                                        Get Started with Google
                                    </p>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        size="large"
                                        theme={isDarkMode ? 'filled_black' : 'outline'}
                                        text="signin_with"
                                        shape="rectangular"
                                    />
                                    <p className={`text-sm ${theme.textMuted} mt-4`}>
                                        🎁 Get {user?.totalCredits || 5} free credits per month
                                    </p>
                                </div>
                            ) : (
                                <div className={`${theme.cardBg} p-8 rounded-2xl border ${theme.cardBorder} shadow-lg`}>
                                    <Loader2 className={`animate-spin ${accentTextClass} mx-auto`} size={48} />
                                    <p className={`text-lg mt-4 ${theme.text}`}>
                                        {isLoggedIn ? 'Redirecting...' : 'Logging you in...'}
                                    </p>
                                </div>
                            )}

                            {loginError && (
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                                    <p className="text-red-500 text-sm">{loginError}</p>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${theme.text}`}>{user?.totalCredits || 5}</div>
                                    <div className={`text-sm ${theme.textMuted}`}>Free Credits/Month</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${theme.text}`}>2</div>
                                    <div className={`text-sm ${theme.textMuted}`}>Project Types</div>
                                </div>
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${theme.text}`}>∞</div>
                                    <div className={`text-sm ${theme.textMuted}`}>Saved Projects</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className={`py-20 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme.text}`}>
                            Everything You Need
                        </h2>
                        <p className={`text-xl ${theme.textMuted}`}>
                            Powerful features to accelerate your development
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`${theme.cardBg} p-6 rounded-xl border ${theme.cardBorder} 
                                        hover:border-red-500 transition-all duration-300 hover:shadow-lg`}
                                >
                                    <div className={`p-3 rounded-lg ${accentBgClass} 
                                        w-fit mb-4`}>
                                        <Icon className={accentTextClass} size={24} />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>
                                        {feature.title}
                                    </h3>
                                    <p className={theme.textMuted}>
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme.text}`}>
                            How It Works
                        </h2>
                        <p className={`text-xl ${theme.textMuted}`}>
                            From idea to code in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Describe Your Project',
                                description: 'Tell us what you want to build in plain English'
                            },
                            {
                                step: '2',
                                title: 'AI Generates Code',
                                description: 'Claude AI creates a complete project structure for you'
                            },
                            {
                                step: '3',
                                title: 'Download & Build',
                                description: 'Get your project files and start developing'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                {index < 2 && (
                                    <div className={`hidden md:block absolute top-12 left-1/2 w-full h-0.5 
                                        ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                                )}

                                <div className="relative text-center">
                                    <div className={`w-24 h-24 mx-auto mb-6 rounded-full 
                                        ${accentBgClass} border-2 ${accentBorderClass} 
                                        flex items-center justify-center`}>
                                        <span className={`text-3xl font-bold ${accentTextClass}`}>
                                            {item.step}
                                        </span>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>
                                        {item.title}
                                    </h3>
                                    <p className={theme.textMuted}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className={`py-20 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${theme.text}`}>
                                Production-Ready Code
                            </h2>
                            <p className={`text-xl ${theme.textMuted} mb-8`}>
                                Get professionally structured projects with modern best practices
                            </p>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`p-1 rounded-full ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'} mt-0.5`}>
                                            <ChevronRight className={isDarkMode ? 'text-green-400' : 'text-green-600'} size={20} />
                                        </div>
                                        <span className={theme.text}>{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`${theme.cardBg} p-8 rounded-2xl border ${theme.cardBorder} shadow-xl`}>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code2 size={16} className={theme.textMuted} />
                                        <span className={`text-sm ${theme.textMuted}`}>Example Output</span>
                                    </div>
                                    <pre className={`text-xs ${theme.text} overflow-x-auto`}>
                                        {`{
                                        "projectName": "todo-app",
                                        "src": [
                                            {
                                            "name": "App.tsx",
                                            "content": "// Complete app..."
                                            },
                                            {
                                            "name":"screens/Home.tsx",
                                            "content": "// Home screen..."
                                            }
                                        ]
                                        }`}
                                    </pre>
                                </div>
                                <p className={`text-sm ${theme.textMuted}`}>
                                    Complete project structure with all files, imports, and configurations ready to use.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${theme.text}`}>
                        Ready to Build Something Amazing?
                    </h2>
                    <p className={`text-xl ${theme.textMuted} mb-8`}>
                        Start generating projects today with {user?.totalCredits || 5} free credits
                    </p>

                    {(!isLoggedIn && !isLoggingIn) && (
                        <div className={`${theme.cardBg} inline-block p-8 rounded-2xl border ${theme.cardBorder} shadow-lg`}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                size="large"
                                theme={isDarkMode ? 'filled_black' : 'outline'}
                                text="signup_with"
                                shape="rectangular"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className={`border-t ${theme.border} py-8`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className={theme.textMuted}>
                            &copy; 2025 AKSD Dhananja (S23014525). All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// src/GeneratorPage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FileDown,
    Loader2,
    Code2,
    Sparkles,
    FolderTree,
    Package,
    CheckCircle,
    Smartphone,
    Monitor,
    Save,
    AlertCircle
} from 'lucide-react';
import useAuth from './hooks/useAuth';

// --- MODIFIED PROJECT TYPES ---
const projectTypes = {
    'react-native': {
        name: 'React Native',
        icon: Smartphone,
        placeholder: 'A todo list app with tabs navigation...'
    },
    'react-vite': {
        name: 'React 19 + Vite + Tailwind v4', 
        icon: Monitor,
        placeholder: 'A modern dashboard with a sidebar layout using React Router v7...'
    }
};

const API_BASE_URL = 'https://ai.esolution.lk:2508';

// HELPER FUNCTION TO PREVENT RATE-LIMITING
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function GeneratorPage() {
    // Auth and Navigation Hooks
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get refetchUser from the context
    const { theme, isDarkMode, refetchUser } = useOutletContext();

    // State Hooks
    const [projectType, setProjectType] = useState('react-native');
    const [prompt, setPrompt] = useState('');
    const [projectFiles, setProjectFiles] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [activeFile, setActiveFile] = useState('');
    const [progress, setProgress] = useState({ step: '', current: 0, total: 0 });
    const [generatedFilesList, setGeneratedFilesList] = useState([]);
    const [skipFailedFiles, setSkipFailedFiles] = useState(false);
    const [skippedFiles, setSkippedFiles] = useState([]);
    const [loadedProjectId, setLoadedProjectId] = useState(null);

    // Load project from history if passed via navigation state
    useEffect(() => {
        if (location.state?.loadedProject) {
            const project = location.state.loadedProject;
            setProjectType(project.projectType);
            setPrompt(project.prompt);
            setProjectName(project.projectName);
            setProjectFiles(project.files);
            setLoadedProjectId(project.id);

            const keyFile = project.projectType === 'react-native' ? 'App.jsx' : 'src/App.jsx';
            setActiveFile(Object.keys(project.files).includes(keyFile) ? keyFile : Object.keys(project.files)[0]);

            // Clear the navigation state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            navigate('/'); // Redirect to landing page
        }
    }, [authLoading, isLoggedIn, navigate]);

    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                {authLoading ? 'Loading authentication status...' : 'Redirecting...'}
            </div>
        );
    }

    // --- Helper Functions ---

    const loadJSZip = () => {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            reject(new Error('JSZip not loaded'));
        });
    };

    const saveProject = async () => {
        if (!projectFiles || !projectName) {
            alert('No project to save');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                navigate('/');
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/projects/save`,
                {
                    projectName,
                    projectType,
                    prompt,
                    files: projectFiles
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setLoadedProjectId(response.data.project.id);
            alert('✅ Project saved successfully!');
        } catch (err) {
            console.error('Save project error:', err);
            setError(`Failed to save project: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const generateProject = async () => {
        if (user && user.credits <= 0) {
            setError('You have no project generation credits remaining. Your credits will reset on the 1st of next month.');
            return;
        }

        if (!prompt.trim()) {
            setError('Please enter a description.');
            return;
        }
        if (!projectType) {
            setError('Please select a project type.');
            return;
        }

        setIsGenerating(true);
        setError('');
        setProjectFiles(null);
        setActiveFile('');
        setProgress({ step: 'Starting...', current: 0, total: 0 });
        setGeneratedFilesList([]);
        setSkippedFiles([]);
        setLoadedProjectId(null);

        const localFiles = {};

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            navigate('/');
            return;
        }
        const authHeaders = { headers: { 'Authorization': `Bearer ${token}` } };

        try {
            setProgress({ step: `Planning ${projectTypes[projectType].name} structure...`, current: 0, total: 0 });

            const structureResponse = await axios.post(`${API_BASE_URL}/stage1-generate-structure`, {
                prompt: prompt,
                projectType: projectType
            }, authHeaders);

            const { filePaths } = structureResponse.data;

            if (!filePaths || filePaths.length === 0) {
                throw new Error('Backend did not return any file paths.');
            }

            const totalFiles = filePaths.length;
            setProgress({ step: 'Generating files...', current: 0, total: totalFiles });

            for (let i = 0; i < totalFiles; i++) {
                const filePath = filePaths[i];
                setProgress(prev => ({ ...prev, step: `Generating ${filePath}...`, current: i + 1 }));

                try {
                    const contentResponse = await axios.post(`${API_BASE_URL}/stage2-generate-content`, {
                        prompt: prompt,
                        projectType: projectType,
                        filePath: filePath
                    }, authHeaders);

                    const { content } = contentResponse.data;
                    localFiles[filePath] = content;
                    setGeneratedFilesList(prev => [...prev, filePath]);

                } catch (err) {
                    console.error(`Failed to generate ${filePath}:`, err);
                    const errorMessage = err.response?.data?.error || err.message;
                    if (skipFailedFiles) {
                        setSkippedFiles(prev => [...prev, `${filePath} (${errorMessage})`]);
                    } else {
                        throw new Error(`Failed on file: ${filePath}. ${errorMessage}`);
                    }
                }

                if (i < totalFiles - 1) {
                    await sleep(1500);
                }
            }

            setProgress({ step: 'Project complete!', current: totalFiles, total: totalFiles });

            if (Object.keys(localFiles).length === 0) {
                throw new Error('No files were successfully generated.');
            }

            const name = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 30);
            setProjectName(name || (projectType === 'react-native' ? 'my-rn-app' : 'my-web-app'));
            setProjectFiles(localFiles);

            const keyFile = projectType === 'react-native' ? 'App.jsx' : 'src/App.jsx';
            setActiveFile(Object.keys(localFiles).includes(keyFile) ? keyFile : Object.keys(localFiles)[0]);

            if (refetchUser) {
                await refetchUser();
            }

        } catch (err) {
            if (err.response?.status === 403) {
                setError(err.response.data.error || 'You have no credits remaining.');
            } else {
                setError(`Error: ${err.message || 'An unknown error occurred.'}`);
            }
            console.error('Generation fatal error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadAsZip = async () => {
        if (!projectFiles) return;
        try {
            const JSZip = await loadJSZip();
            const zip = new JSZip();
            const projectFolder = zip.folder(projectName);

            Object.entries(projectFiles).forEach(([filePath, content]) => {
                projectFolder.file(filePath, content);
            });

            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${projectName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(`ZIP error: ${err.message}`);
        }
    };

    const copyToClipboard = () => {
        if (!activeFile || !projectFiles) return;
        const ta = document.createElement('textarea');
        ta.value = projectFiles[activeFile];
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            alert('Code copied!');
        } catch (err) {
            alert('Failed to copy code.');
        }
        document.body.removeChild(ta);
    };

    const getFileIcon = (filename) => {
        if (filename.endsWith('.json')) return '📦';
        if (filename.endsWith('.md')) return '📝';
        if (filename.endsWith('.js') || filename.endsWith('.jsx')) return '⚛️';
        if (filename.endsWith('.html')) return '🌐';
        if (filename.endsWith('.css')) return '🎨';
        if (filename.startsWith('vite.config')) return '⚡️';
        if (filename.startsWith('tailwind.config')) return '💨';
        if (filename.startsWith('postcss.config')) return '🔧';
        if (filename.includes('navigation') || filename.includes('Navigator')) return '🧭';
        if (filename.includes('screen') || filename.includes('page')) return '📱';
        if (filename.includes('component')) return '🧩';
        return '📄';
    };

    const RenderNativeInstructions = () => (
        <>
            <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} mb-3 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5" />
                How to use this project (React Native):
            </h3>
            <ol className={`list-decimal list-inside space-y-2 text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                <li>Click "Download ZIP" and extract the file.</li>
                <li>Open terminal and `cd` into the extracted folder.</li>
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>npm install</code></li>
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'text-red-900'} px-2 py-1 rounded`}>npx react-native start</code></li>
                <li>In a new terminal, run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'text-red-900'} px-2 py-1 rounded`}>npx react-native run-android</code> or <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'text-red-900'} px-2 py-1 rounded`}>run-ios</code></li>
            </ol>
            <div className={`mt-4 pt-4 border-t ${theme.accentBorder}`}>
                <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    ✨ All components use modern <strong>.jsx</strong> file extensions with ES6+ syntax and <strong>React Navigation</strong>.
                </p>
            </div>
        </>
    );

    const RenderViteInstructions = () => (
        <>
            <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} mb-3 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5" />
                How to use this project (React 19 + Vite):
            </h3>
            <ol className={`list-decimal list-inside space-y-2 text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                <li>Click "Download ZIP" and extract the file.</li>
                <li>Open terminal and `cd` into the extracted folder.</li>
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>npm install</code></li>
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'text-red-900'} px-2 py-1 rounded`}>npm run dev</code></li>
                <li>Open the URL (e.g., `http://localhost:5173`) in your browser.</li>
            </ol>
            <div className={`mt-4 pt-4 border-t ${theme.accentBorder}`}>
                <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    ✨ Project includes <strong>React 19</strong>, <strong>Tailwind CSS v4</strong>, and <strong>React Router v7</strong>.
                </p>
            </div>
        </>
    );

    const hasCredits = user ? user.credits > 0 : true;

    return (
        <>
            <div className="text-center mb-8 pt-4 md:pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h1 className={`text-3xl sm:text-4xl font-bold ${theme.text} mb-3`}>Create your App</h1>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                    <span className={`px-3 py-1 ${theme.accentBg} ${theme.accentText} text-xs font-semibold rounded-full`}>
                        Web & Mobile
                    </span>
                    <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>
                        React Native CLI
                    </span>
                    <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>
                        React 19 + Vite
                    </span>
                </div>

                <p className={`${theme.textMuted} text-base sm:text-lg max-w-2xl mx-auto`}>
                    Generate a complete, runnable {projectTypes[projectType].name} project from a description.
                </p>
            </div>

            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-6 border ${theme.cardBorder}`}>

                <div className="my-4">
                    <label className={`flex flex-wrap gap-2 ${theme.text} mb-2 justify-center font-semibold`}>
                        Select Project Type
                    </label>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {Object.keys(projectTypes).map(key => {
                            const config = projectTypes[key];
                            const isActive = projectType === key;
                            const Icon = config.icon;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setProjectType(key)}
                                    disabled={isGenerating}
                                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${isActive
                                        ? `${theme.accentBorder} ${theme.accentBg} ${theme.accentText} font-semibold`
                                        : `${theme.inputBorder} ${theme.inputBg} ${theme.textMuted} hover:border-gray-500`
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {/* {config.name} */}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <label className={`block text-lg font-semibold ${theme.text} mb-3`}>
                    What app do you want to build?
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Example: ${projectTypes[projectType].placeholder}`}
                    className={`w-full h-32 p-4 border-2 ${theme.inputBorder} rounded-xl focus:border-red-500 focus:outline-none resize-none ${theme.text} placeholder-gray-400 ${theme.inputBg}`}
                    disabled={isGenerating}
                />

                <button
                    onClick={generateProject}
                    disabled={isGenerating || !hasCredits}
                    className={`mt-4 w-full ${theme.accent} ${theme.accentHover} text-white py-3 md:py-4 px-6 rounded-xl font-semibold text-base md:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generating Project...</span>
                        </>
                    ) : !hasCredits ? (
                        <>
                            <AlertCircle className="w-5 h-5" />
                            <span>No Credits Remaining</span>
                        </>
                    ) : (
                        <>
                            <FolderTree className="hidden sm:block w-5 h-5" />
                            <span>Generate Project <span className="hidden sm:inline">(1 Credit)</span></span>
                        </>
                    )}
                </button>

                <div className="mt-3 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="skipFailedFiles"
                        checked={skipFailedFiles}
                        onChange={(e) => setSkipFailedFiles(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        disabled={isGenerating}
                    />
                    <label htmlFor="skipFailedFiles" className={`text-sm ${theme.textMuted} cursor-pointer`}>
                        Continue generating even if some files fail
                    </label>
                </div>

                {isGenerating && progress.total > 0 && (
                    <div className={`mt-4 p-4 ${theme.accentBg} border ${theme.accentBorder} rounded-xl`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-900'} truncate pr-2`}>{progress.step}</span>
                            <span className={`text-sm font-semibold ${theme.accentText} flex-shrink-0`}>
                                {progress.current} / {progress.total}
                            </span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-red-950' : 'bg-red-200'} rounded-full h-3 overflow-hidden`}>
                            <div
                                className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {generatedFilesList.length > 0 && (
                    <div className={`mt-4 p-4 ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-xl`}>
                        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-900'} mb-3 flex items-center gap-2`}>
                            <CheckCircle className="w-4 h-4" />
                            Generated Files ({generatedFilesList.length})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {generatedFilesList.map((file, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-green-300 bg-green-950/30' : 'text-green-800 bg-white'} px-3 py-2 rounded-lg`}
                                >
                                    <CheckCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-500' : 'text-green-600'} flex-shrink-0`} />
                                    <span>{getFileIcon(file)}</span>
                                    <span className="font-mono truncate">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {skippedFiles.length > 0 && (
                    <div className={`mt-4 p-4 ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border rounded-xl`}>
                        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'} mb-3 flex items-center gap-2`}>
                            <span className="text-lg">⚠️</span>
                            Skipped Files ({skippedFiles.length})
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {skippedFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-yellow-300 bg-yellow-950/30' : 'text-yellow-800 bg-white'} px-3 py-2 rounded-lg`}
                                >
                                    <span className={isDarkMode ? 'text-yellow-500' : 'text-yellow-600'}>⚠️</span>
                                    <span>{getFileIcon(file)}</span>
                                    <span className="font-mono truncate">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className={`mt-4 p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl`}>
                        <div className="flex items-start gap-3">
                            <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                            <div className="flex-1">
                                <h4 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} mb-1`}>Generation Error</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {projectFiles && (
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>

                    <div className={`lg:col-span-1 ${theme.cardBg} rounded-2xl shadow-xl p-4 sm:p-6 border ${theme.cardBorder}`}>
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                className={`w-full p-2 border-b-2 ${theme.inputBorder} ${theme.inputBg} ${theme.text} focus:outline-none focus:border-red-500`}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                            <button
                                onClick={downloadAsZip}
                                className={`w-full sm:w-1/2 ${theme.accent} ${theme.accentHover} text-white py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all`}
                            >
                                <FileDown className="w-4 h-4" />
                                Download ZIP
                            </button>
                            <button
                                onClick={saveProject}
                                disabled={isSaving || loadedProjectId}
                                className={`w-full sm:w-1/2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme.text} py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : loadedProjectId ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {loadedProjectId ? 'Saved' : 'Save'}
                            </button>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {Object.keys(projectFiles).map((file, index) => (
                                <div
                                    key={index}
                                    onClick={() => setActiveFile(file)}
                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm truncate ${activeFile === file
                                        ? `${theme.accentBg} ${theme.accentText} font-medium`
                                        : `${theme.textMuted} ${theme.hoverBg}`
                                        }`}
                                >
                                    <span>{getFileIcon(file)}</span>
                                    <span className="font-mono">{file}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`lg:col-span-2 ${theme.cardBg} rounded-2xl shadow-xl border ${theme.cardBorder} overflow-hidden`}>
                        {activeFile ? (
                            <>
                                <div className={`flex justify-between items-center p-3 sm:p-4 border-b ${theme.border}`}>
                                    <div className="flex items-center gap-2 truncate">
                                        <span>{getFileIcon(activeFile)}</span>
                                        <span className={`font-mono text-sm ${theme.text} truncate`}>{activeFile}</span>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`py-1 px-3 rounded-lg text-xs font-medium ${theme.hoverBg} ${theme.text} border ${theme.border} flex-shrink-0`}
                                    >
                                        Copy Code
                                    </button>
                                </div>
                                <pre className={`p-4 sm:p-6 text-sm overflow-auto ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'} max-h-[600px] ${theme.text}`}>
                                    <code className="font-mono">{projectFiles[activeFile]}</code>
                                </pre>
                            </>
                        ) : (
                            <div className={`p-4 sm:p-6 ${theme.accentBg} border-t-4 ${theme.accentBorder}`}>
                                {projectType === 'react-native' ? <RenderNativeInstructions /> : <RenderViteInstructions />}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

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

// src/hooks/useAuth.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://ai.esolution.lk:2508';

// This hook manages the user's authentication state
export default function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setUser(null);
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            // We set loading to true on refetch to ensure we get fresh data
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data.user);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Auth error:', error);
            localStorage.removeItem('jwtToken');
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Return the state AND the refetch function
    return { user, isLoggedIn, loading, refetchUser: fetchUser };
}