import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Sparkles, User, Settings, LifeBuoy, LogOut } from 'lucide-react';
import { Outlet, Link, useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

export default function App() {
    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { user } = useAuth();

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        // Redirect to home page
        window.location.href = '/';
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Check for system preference on mount
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateTheme = (matches) => {
            setIsDarkMode(matches);
            if (matches) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        };
        updateTheme(darkModeMediaQuery.matches);

        const handler = (e) => updateTheme(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prev => {
            const newIsDark = !prev;
            if (newIsDark) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
            return newIsDark;
        });
    };

    // State to manage the dropdown menu visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Ref to detect clicks outside the menu
    const menuRef = useRef(null);

    // Effect to handle clicks outside the dropdown menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean-up
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
    };

    // --- NEW: Top Navigation Bar Component ---
    const TopNav = () => (
        <nav className={`sticky top-0 z-50 w-full ${isDarkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md border-b ${theme.border}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Logo and Nav Links */}
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

                    {/* Right side: Try Button and Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`hidden sm:flex items-center justify-center w-9 h-9 ${theme.text} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full ${theme.hoverBg}`}
                                    title="User Profile"
                                    aria-haspopup="true"
                                    aria-expanded={isMenuOpen}
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className={`absolute right-0 top-full mt-2 w-48 ${theme.dropdownBg} border ${theme.border} rounded-md shadow-lg py-1 z-50`}>
                                        <a
                                            href="#"
                                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </a>
                                        <a
                                            href="#"
                                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                        >
                                            <LifeBuoy className="w-4 h-4" />
                                            <span>Support</span>
                                        </a>
                                        <div className={`border-t ${theme.border} my-1`}></div>
                                        <a
                                            onClick={handleLogout} // <-- ADD
                                            style={{ cursor: 'pointer' }} // <-- Make it look clickable
                                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${theme.text} ${theme.dropdownHoverBg}`}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log out</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/generator"
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
    // --- END NEW ---

    return (
        <div className={`${isDarkMode ? 'dark' : ''} ${theme.bg}`}>
            <TopNav />
            <main className="min-h-screen max-w-7xl mx-auto p-6">
                <Outlet context={{ theme, isDarkMode }} />
            </main>
        </div>
    );
}