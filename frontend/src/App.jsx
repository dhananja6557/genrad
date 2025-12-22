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