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
    // Get theme from parent, which includes the 'accent' colors
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
            description: 'Powered by Google Gemini AI for intelligent code generation'
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
        'TypeScript support out of the box',
        'Modern styling with Tailwind CSS',
        'Ready-to-run code with proper imports',
        'Commented code for easy understanding',
        'Production-ready architecture'
    ];

    // Use accent colors from the theme object for consistency
    const accentTextClass = theme.accentText; // 'text-red-600'
    const accentBorderClass = theme.accentBorder; // 'border-red-800' or 'border-red-200'
    const accentBgClass = theme.accentBg; // 'bg-red-900/20' or 'bg-red-50'

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen bg-gradient-to-br from-red-500 to-red-500 opacity-10"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center">
                        {/* Logo/Icon - CHANGED to red */}
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

                        {/* Main Heading - CHANGED to red */}
                        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${theme.text}`}>
                            Build Projects with
                            <span className="block bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                                AI in Seconds
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className={`text-xl sm:text-2xl ${theme.textMuted} max-w-3xl mx-auto mb-12`}>
                            Generate complete React Native or React + Vite projects instantly.
                            Just describe what you want to build, and let AI do the rest.
                        </p>

                        {/* Login Section */}
                        <div className="flex flex-col items-center gap-6">
                            {/* Google Login Button */}
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

                            {/* Error Message (already red) */}
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

            {/* Features Section - CHANGED to red */}
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

            {/* How It Works Section - CHANGED to red */}
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
                                description: 'Our AI creates a complete project structure for you'
                            },
                            {
                                step: '3',
                                title: 'Download & Build',
                                description: 'Get your project files and start developing'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                {/* Connector Line */}
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