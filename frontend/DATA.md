// src/main.jsx
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

// src/App.jsx
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

// src/HomePage.jsx
import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
    Sparkles,
    Package,
    FolderTree,
    FileDown,
    Search,
    Code2,
    Smartphone,
    Monitor,
    ArrowRight
} from 'lucide-react';

/**
 * --- NEW FILE ---
 * This is the new landing page, styled to match the image.
 */
export default function HomePage() {
    const { theme, isDarkMode } = useOutletContext(); // Get theme from layout

    // Mock data for feature cards, like in the image
    const features = [
        {
            title: 'Generate React Native Apps',
            description: 'Create complete, runnable React Native projects for iOS and Android from a single prompt.',
            icon: Smartphone,
            linkText: 'Try Mobile',
            date: 'OCT 2025'
        },
        {
            title: 'Generate React + Vite Apps',
            description: 'Instantly scaffold a modern web app with React, Vite, and Tailwind CSS, routing included.',
            icon: Monitor,
            linkText: 'Try Web',
            date: 'OCT 2025'
        },
        {
            title: 'Full Project Structure',
            description: 'GenRAD doesn\'t just write snippets. It builds the entire project folder structure for you.',
            icon: FolderTree,
            linkText: 'Learn more',
            date: 'SEP 2025'
        }
    ];

    return (
        <div className="flex flex-col items-center text-center p-4">
            {/* 1. "Get started" Section */}
            <h1 className={`text-4xl md:text-5xl font-semibold ${theme.text} mt-12 mb-6`}>
                Get started
            </h1>

            {/* Button Grid - styled like the image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-3 w-full max-w-2xl">
                <button disabled className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 ${theme.inputBorder} ${theme.inputBg} ${theme.textMuted} opacity-50 cursor-not-allowed`}>
                    <Search className="w-5 h-5" />
                    <span>Search with AI</span>
                </button>
                <button disabled className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 ${theme.inputBorder} ${theme.inputBg} ${theme.textMuted} opacity-50 cursor-not-allowed`}>
                    <Code2 className="w-5 h-5" />
                    <span>Ask GenRAD</span>
                </button>
                {/* The main "Call to Action" button is now a Link */}
                <Link
                    to="/generator"
                    className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${theme.accentBorder} ${theme.accentBg} ${theme.accentText} font-semibold hover:opacity-80`}
                >
                    <Sparkles className="w-5 h-5" />
                    <span>Create an App</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {/* 2. Feature Cards Section */}
            <div className="w-full max-w-5xl mt-24 text-left">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div key={index} className={`grid md:grid-cols-3 gap-8 items-center mb-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            {/* Text Content */}
                            <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                <h2 className={`text-3xl font-semibold ${theme.text} mb-4`}>
                                    {feature.title}
                                </h2>
                                <p className={`${theme.textMuted} text-lg mb-6`}>
                                    {feature.description}
                                </p>
                                <div className="flex items-center space-x-4">
                                    <span className={`text-xs font-medium ${theme.textMuted}`}>{feature.date}</span>
                                    <Link
                                        to="/generator"
                                        className={`text-sm font-medium ${theme.accentText} hover:underline`}
                                    >
                                        {feature.linkText}
                                    </Link>
                                </div>
                            </div>
                            {/* Icon / "Image" Placeholder */}
                            <div className={`flex items-center justify-center ${theme.cardBg} rounded-2xl border ${theme.cardBorder} h-64 p-8 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                <Icon className={`w-32 h-32 ${theme.accentText} opacity-50`} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// src/GeneratorPage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
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
    Monitor
} from 'lucide-react';
import useAuth from './hooks/useAuth';

// Define project types for the UI
const projectTypes = {
    'react-native': {
        name: 'React Native',
        icon: Smartphone,
        placeholder: 'A todo list app with tabs navigation...'
    },
    'react-vite': {
        name: 'React + Vite + Tailwind',
        icon: Monitor,
        placeholder: 'A personal blog with a home page and an about page...'
    }
};

// Backend API URL
const API_BASE_URL = 'https://ai.esolution.lk:2508';

export default function GeneratorPage() {
    // ------------------------------------------------------------------
    // 🔥 CRITICAL FIX: ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
    // ------------------------------------------------------------------

    // Auth and Navigation Hooks
    const { isLoggedIn, loading: authLoading } = useAuth(); // Use 'loading' state for better handling
    const navigate = useNavigate();

    // Context Hooks
    const { theme, isDarkMode } = useOutletContext();

    // State Hooks
    const [projectType, setProjectType] = useState('react-native');
    const [prompt, setPrompt] = useState('');
    const [projectFiles, setProjectFiles] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [activeFile, setActiveFile] = useState('');
    const [progress, setProgress] = useState({ step: '', current: 0, total: 0 });
    const [generatedFilesList, setGeneratedFilesList] = useState([]);
    const [skipFailedFiles, setSkipFailedFiles] = useState(false);
    const [skippedFiles, setSkippedFiles] = useState([]);

    // ------------------------------------------------------------------
    // 💡 Redirection Logic (Now inside useEffect)
    // ------------------------------------------------------------------
    useEffect(() => {
        // Only attempt to redirect if authentication state is finished loading
        if (!authLoading && !isLoggedIn) {
            navigate('/signin');
        }
    }, [authLoading, isLoggedIn, navigate]);

    // ------------------------------------------------------------------
    // 🔒 Conditional Render Guard (Show loading or redirect status)
    // ------------------------------------------------------------------
    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                {authLoading ? 'Loading authentication status...' : 'Redirecting to login...'}
            </div>
        );
    }
    // ------------------------------------------------------------------

    // --- Helper Functions ---

    // Loads JSZip (assumed to be loaded globally via <script> tag)
    const loadJSZip = () => {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            reject(new Error('JSZip not loaded'));
        });
    };

    // Core function for generating project structure and content
    const generateProject = async () => {
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

        const localFiles = {};

        try {
            // --- STAGE 1: Generate Structure ---
            setProgress({ step: `Planning ${projectTypes[projectType].name} structure...`, current: 0, total: 0 });

            const structureResponse = await axios.post(`${API_BASE_URL}/stage1-generate-structure`, {
                prompt: prompt,
                projectType: projectType
            });

            const { filePaths } = structureResponse.data;

            if (!filePaths || filePaths.length === 0) {
                throw new Error('Backend did not return any file paths.');
            }

            const totalFiles = filePaths.length;
            setProgress({ step: 'Generating files...', current: 0, total: totalFiles });

            // --- STAGE 2: Generate Content (Iteratively) ---
            for (let i = 0; i < totalFiles; i++) {
                const filePath = filePaths[i];
                setProgress(prev => ({ ...prev, step: `Generating ${filePath}...`, current: i + 1 }));

                try {
                    const contentResponse = await axios.post(`${API_BASE_URL}/stage2-generate-content`, {
                        prompt: prompt,
                        projectType: projectType,
                        filePath: filePath
                    });

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

        } catch (err) {
            setError(`Error: ${err.message || 'An unknown error occurred.'}`);
            console.error('Generation fatal error:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // Downloads all generated files as a ZIP archive
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

    // Copies the active file's content to the clipboard
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

    // Determines the appropriate icon for a file path
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

    // Instruction component for React Native
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

    // Instruction component for React + Vite
    const RenderViteInstructions = () => (
        <>
            <h3 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} mb-3 flex items-center gap-2`}>
                <Sparkles className="w-5 h-5" />
                How to use this project (React + Vite):
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
                    ✨ Project includes <strong>Vite</strong>, <strong>Tailwind CSS</strong>, and <strong>React Router</strong> setup.
                </p>
            </div>
        </>
    );

    // --- JSX Render ---
    return (
        <>
            <div className="text-center mb-8 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <h1 className={`text-4xl font-bold ${theme.text} mb-3`}>Create your App</h1>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`px-3 py-1 ${theme.accentBg} ${theme.accentText} text-xs font-semibold rounded-full`}>
                        Web & Mobile
                    </span>
                    <span className={`px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full`}>
                        React Native CLI
                    </span>
                    <span className={`px-3 py-1 bg-gray-800 text-gray-300 text-xs font-semibold rounded-full`}>
                        React + Vite
                    </span>
                </div>

                <p className={`${theme.textMuted} text-lg`}>
                    Generate a complete, runnable {projectTypes[projectType].name} project from a description.
                </p>
            </div>

            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-6 border ${theme.cardBorder}`}>

                <div className="my-4">
                    <label className={`flex flex-wrap gap-2 ${theme.text} mb-2 justify-end`}>
                        Select Project Type:
                    </label>
                    <div className="flex flex-wrap gap-2 justify-end">
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
                                    {config.name}
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
                    disabled={isGenerating}
                    className={`mt-4 w-full ${theme.accent} ${theme.accentHover} text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Project...
                        </>
                    ) : (
                        <>
                            <FolderTree className="w-5 h-5" />
                            Generate Complete Project
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
                        Continue generating even if some files fail (experimental)
                    </label>
                </div>

                {isGenerating && progress.total > 0 && (
                    <div className={`mt-4 p-4 ${theme.accentBg} border ${theme.accentBorder} rounded-xl`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>{progress.step}</span>
                            <span className={`text-sm font-semibold ${theme.accentText}`}>
                                {progress.current} / {progress.total}
                            </span>
                        </div>
                        <div className={`w-full ${isDarkMode ? 'bg-red-950' : 'bg-red-200'} rounded-full h-3 overflow-hidden`}>
                            <div
                                className="bg-red-600 h-3 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            />
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'} mt-2`}>
                            Please wait while AI generates your project files...
                        </p>
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
                        <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'} mt-3`}>
                            These files failed to generate. You can manually create them or try generating the project again.
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <div className="text-red-600 text-xl mt-0.5">⚠️</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-red-900 mb-1">Generation Error</h4>
                                <p className="text-sm text-red-700 mb-3">{error}</p>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={generateProject}
                                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <p className="text-xs text-red-600">
                                        Or try: Simplifying your description
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {projectFiles && (
                <div className="grid lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className={`${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.cardBorder} sticky top-6`}>
                            <div className="flex items-center gap-2 mb-4">
                                <FolderTree className={`w-5 h-5 ${theme.accentText}`} />
                                <h2 className={`text-lg font-bold ${theme.text}`}>Project Files</h2>
                            </div>

                            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                                <div className={`text-sm font-semibold ${theme.text} mb-2 flex items-center gap-2`}>
                                    <Package className="w-4 h-4" />
                                    {projectName}
                                </div>
                                {Object.keys(projectFiles).map((filePath) => (
                                    <button
                                        key={filePath}
                                        onClick={() => setActiveFile(filePath)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${activeFile === filePath
                                            ? `${theme.accentBg} ${theme.accentText} font-medium`
                                            : `${theme.textMMuted} ${theme.hoverBg}`
                                            }`}
                                    >
                                        <span>{getFileIcon(filePath)}</span>
                                        <span className="truncate">{filePath}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={downloadAsZip}
                                className={`mt-6 w-full px-4 py-3 ${theme.accent} ${theme.accentHover} text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
                            >
                                <FileDown className="w-4 h-4" />
                                Download ZIP
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className={`${theme.cardBg} rounded-2xl shadow-xl border ${theme.cardBorder}`}>
                            <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-2xl">{activeFile ? getFileIcon(activeFile) : <Code2 className="w-6 h-6 text-gray-500" />}</span>
                                    <h3 className={`text-xl font-bold ${theme.text} truncate`}>{activeFile || 'Select a file'}</h3>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!projectFiles || !activeFile}
                                    className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg font-medium transition-colors flex items-center gap-2 flex-shrink-0 disabled:opacity-50`}
                                >
                                    <Code2 className="w-4 h-4" />
                                    Copy
                                </button>
                            </div>

                            <div className="p-6">
                                <div className={`${isDarkMode ? 'bg-black' : 'bg-gray-900'} rounded-xl p-6 overflow-x-auto max-h-[600px] overflow-y-auto`}>
                                    <pre className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-100'} font-mono`}>
                                        <code>
                                            {projectFiles && activeFile
                                                ? projectFiles[activeFile]
                                                : <span className={theme.textMuted}>Select a file to view its content.</span>
                                            }
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-6 ${theme.accentBg} border ${theme.accentBorder} rounded-xl p-6`}>
                            {projectType === 'react-native' ? <RenderNativeInstructions /> : <RenderViteInstructions />}
                        </div>

                    </div>
                </div>
            )}

            {!projectFiles && (
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className={`${theme.cardBg} p-6 rounded-xl shadow-md border ${theme.cardBorder}`}>
                        <div className={`w-12 h-12 ${theme.accentBg} rounded-lg flex items-center justify-center mb-4`}>
                            <FolderTree className={`w-6 h-6 ${theme.accentText}`} />
                        </div>
                        <h3 className={`font-bold ${theme.text} mb-2`}>Complete Structure</h3>
                        <p className={`${theme.textMuted} text-sm`}>
                            Full project with components, screens/pages, navigation, and proper folder structure.
                        </p>
                    </div>

                    <div className={`${theme.cardBg} p-6 rounded-xl shadow-md border ${theme.cardBorder}`}>
                        <div className={`w-12 h-12 ${theme.accentBg} rounded-lg flex items-center justify-center mb-4`}>
                            <Sparkles className={`w-6 h-6 ${theme.accentText}`} />
                        </div>
                        <h3 className={`font-bold ${theme.text} mb-2`}>AI Powered</h3>
                        <p className={`${theme.textMMuted} text-sm`}>
                            Uses Google's Gemini AI to generate production-ready Web & Mobile projects.
                        </p>
                    </div>

                    <div className={`${theme.cardBg} p-6 rounded-xl shadow-md border ${theme.cardBorder}`}>
                        <div className={`w-12 h-12 ${theme.accentBg} rounded-lg flex items-center justify-center mb-4`}>
                            <FileDown className={`w-6 h-6 ${theme.accentText}`} />
                        </div>
                        <h3 className={`font-bold ${theme.text} mb-2`}>ZIP Download</h3>
                        <p className={`${theme.textMuted} text-sm`}>
                            Download complete project as ZIP, ready to extract and run.
                        </p>
                    </div>
                </div>
            )}
        </>
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

// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const PROFILE_API_URL = 'https://ai.esolution.lk:2508/user/profile';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Get token from storage
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(PROFILE_API_URL, {
                    // --- SEND THE TOKEN ---
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    // withCredentials: true, // <-- REMOVE THIS
                });

                setUser(response.data.user);
            } catch (error) {
                // If token is invalid, 401 error will be caught here
                setUser(null);
                localStorage.removeItem('jwtToken'); // Clean up invalid token
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, isLoggedIn: !!user };
};

export default useAuth;

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