import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    Sparkles,
    Zap,
    Code2,
    Smartphone,
    Monitor,
    Download,
    History,
    Database,
    CheckCircle2,
    ArrowRight,
    Clock,
    Layers,
    Palette,
    FileCode,
    Package,
    Globe,
    Users,
    TrendingUp,
    Shield,
    Play,
    ChevronRight,
    Rocket,
    Brain,
    GitBranch,
    Terminal,
    Layout,
    Component,
    Boxes,
    Settings,
    Star
} from 'lucide-react';

export default function ProductsPage() {
    const { theme, isDarkMode } = useOutletContext();
    const [activeTab, setActiveTab] = useState('features');

    // Hero Stats
    const stats = [
        { label: 'AI Model', value: 'Claude 4.5', icon: Brain },
        { label: 'Project Types', value: '2', icon: Code2 },
        { label: 'Free Credits', value: '5/month', icon: Database },
        { label: 'Setup Time', value: '<5 min', icon: Clock }
    ];

    // Main Features
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Generation',
            description: 'Powered by Anthropic\'s Claude Sonnet 4.5, the most advanced AI model for code generation',
            highlights: [
                'Two-stage generation pipeline',
                'Context-aware code creation',
                'Best practices built-in',
                'Production-ready output'
            ],
            color: 'red'
        },
        {
            icon: Smartphone,
            title: 'React Native Projects',
            description: 'Generate complete mobile applications with navigation, screens, and components',
            highlights: [
                'React Navigation setup',
                'Functional components with hooks',
                'StyleSheet-based styling',
                'Cross-platform compatibility'
            ],
            color: 'blue'
        },
        {
            icon: Monitor,
            title: 'React + Vite Projects',
            description: 'Create modern web applications with React 19, Vite, and Tailwind CSS',
            highlights: [
                'Lightning-fast Vite build',
                'React Router v7 integration',
                'Tailwind CSS v4 styling',
                'Optimized production builds'
            ],
            color: 'green'
        },
        {
            icon: History,
            title: 'Project History',
            description: 'Save, manage, and retrieve unlimited generated projects',
            highlights: [
                'Unlimited storage',
                'Quick project reload',
                'Export to ZIP anytime',
                'Search and filter'
            ],
            color: 'purple'
        },
        {
            icon: Download,
            title: 'Easy Export',
            description: 'Download your projects as ZIP files with complete folder structure',
            highlights: [
                'One-click download',
                'Proper file organization',
                'Ready to run locally',
                'No manual setup needed'
            ],
            color: 'yellow'
        },
        {
            icon: Database,
            title: 'Credit Management',
            description: 'Fair usage system with monthly credit resets',
            highlights: [
                '5 free credits monthly',
                'Automatic monthly reset',
                'Transparent tracking',
                'No hidden fees'
            ],
            color: 'indigo'
        }
    ];

    // Use Cases
    const useCases = [
        {
            title: 'Rapid Prototyping',
            description: 'Build MVPs and prototypes in minutes instead of hours',
            icon: Rocket,
            scenarios: [
                'Startup pitch demos',
                'Client presentations',
                'Proof of concepts',
                'Technical feasibility tests'
            ]
        },
        {
            title: 'Learning & Education',
            description: 'Study modern development patterns and best practices',
            icon: Users,
            scenarios: [
                'React Native tutorials',
                'Web development courses',
                'Code structure examples',
                'Framework learning'
            ]
        },
        {
            title: 'Project Scaffolding',
            description: 'Start new projects with solid foundations',
            icon: Layout,
            scenarios: [
                'Client projects',
                'Personal applications',
                'Open source contributions',
                'Hackathon starters'
            ]
        },
        {
            title: 'Code Reference',
            description: 'Generate templates and boilerplate code',
            icon: FileCode,
            scenarios: [
                'Navigation patterns',
                'Component structures',
                'Routing setups',
                'Build configurations'
            ]
        }
    ];

    // Technical Capabilities
    const capabilities = [
        {
            category: 'Frontend Technologies',
            items: [
                { name: 'React 19', description: 'Latest React with modern features' },
                { name: 'React Native CLI', description: 'Native mobile development' },
                { name: 'Vite 7.1', description: 'Next-gen build tool' },
                { name: 'Tailwind CSS 4.1', description: 'Utility-first CSS framework' },
                { name: 'React Router v7', description: 'Declarative routing' },
                { name: 'React Navigation', description: 'Mobile navigation library' }
            ]
        },
        {
            category: 'Code Quality',
            items: [
                { name: 'Best Practices', description: 'Industry-standard patterns' },
                { name: 'Functional Components', description: 'Modern React approach' },
                { name: 'Hooks Integration', description: 'useState, useEffect, etc.' },
                { name: 'Clean Architecture', description: 'Organized file structure' },
                { name: 'Comments & Docs', description: 'Inline documentation' },
                { name: 'TypeScript Ready', description: 'Easy migration path' }
            ]
        },
        {
            category: 'Project Features',
            items: [
                { name: 'Complete Setup', description: 'All configs included' },
                { name: 'Package.json', description: 'Dependencies specified' },
                { name: 'Ready to Run', description: 'No manual configuration' },
                { name: 'Production Ready', description: 'Deployment-ready code' },
                { name: 'Responsive Design', description: 'Mobile-first approach' },
                { name: 'Dark Mode Support', description: 'Theme switching ready' }
            ]
        }
    ];

    // Workflow Steps
    const workflowSteps = [
        {
            step: 1,
            title: 'Describe Your Project',
            description: 'Tell GenRAD what you want to build in plain English',
            icon: Terminal,
            example: '"A todo app with tabs navigation and dark mode"'
        },
        {
            step: 2,
            title: 'AI Generates Structure',
            description: 'Claude AI creates a complete file structure tailored to your needs',
            icon: GitBranch,
            example: 'App.jsx, screens/Home.jsx, components/TodoItem.jsx...'
        },
        {
            step: 3,
            title: 'Code Generation',
            description: 'Each file is populated with production-ready code',
            icon: Code2,
            example: 'Functional components, routing, styling, state management'
        },
        {
            step: 4,
            title: 'Download & Deploy',
            description: 'Export your project and start building immediately',
            icon: Download,
            example: 'npm install && npm start - that\'s it!'
        }
    ];

    // Comparison Table
    const comparison = [
        { feature: 'Setup Time', traditional: '2-4 hours', genrad: '<5 minutes', improvement: '95% faster' },
        { feature: 'Configuration', traditional: 'Manual setup', genrad: 'Auto-generated', improvement: 'Zero config' },
        { feature: 'Best Practices', traditional: 'Self-research', genrad: 'Built-in', improvement: 'Always current' },
        { feature: 'File Structure', traditional: 'Create manually', genrad: 'AI-organized', improvement: 'Optimized' },
        { feature: 'Dependencies', traditional: 'Install separately', genrad: 'Pre-configured', improvement: 'Complete' },
        { feature: 'Learning Curve', traditional: 'Steep', genrad: 'Gentle', improvement: 'Beginner-friendly' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            red: {
                bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
                border: isDarkMode ? 'border-red-800' : 'border-red-200',
                text: isDarkMode ? 'text-red-400' : 'text-red-600',
                icon: isDarkMode ? 'text-red-400' : 'text-red-600'
            },
            blue: {
                bg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
                border: isDarkMode ? 'border-blue-800' : 'border-blue-200',
                text: isDarkMode ? 'text-blue-400' : 'text-blue-600',
                icon: isDarkMode ? 'text-blue-400' : 'text-blue-600'
            },
            green: {
                bg: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
                border: isDarkMode ? 'border-green-800' : 'border-green-200',
                text: isDarkMode ? 'text-green-400' : 'text-green-600',
                icon: isDarkMode ? 'text-green-400' : 'text-green-600'
            },
            purple: {
                bg: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50',
                border: isDarkMode ? 'border-purple-800' : 'border-purple-200',
                text: isDarkMode ? 'text-purple-400' : 'text-purple-600',
                icon: isDarkMode ? 'text-purple-400' : 'text-purple-600'
            },
            yellow: {
                bg: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
                border: isDarkMode ? 'border-yellow-800' : 'border-yellow-200',
                text: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
                icon: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            },
            indigo: {
                bg: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
                border: isDarkMode ? 'border-indigo-800' : 'border-indigo-200',
                text: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
                icon: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }
        };
        return colors[color] || colors.red;
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} py-8`}>
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl`}></div>
                <div className="relative">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-2xl ${theme.accentBg} border ${theme.accentBorder}`}>
                            <Package className={`w-12 h-12 ${theme.accentText}`} />
                        </div>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${theme.text}`}>
                        GenRAD Products
                    </h1>

                    <p className={`max-w-3xl mx-auto text-center ${theme.textMuted} text-lg mb-8`}>
                        AI-powered rapid application development platform that generates production-ready
                        React Native and React+Vite projects in seconds
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className={`${theme.cardBg} border ${theme.cardBorder} rounded-xl p-4 text-center`}
                                >
                                    <Icon className={`w-6 h-6 ${theme.accentText} mx-auto mb-2`} />
                                    <div className={`text-2xl font-bold ${theme.text}`}>{stat.value}</div>
                                    <div className={`text-xs ${theme.textMuted}`}>{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder} text-center`}>
                <h2 className={`text-2xl font-bold ${theme.text} mb-4`}>
                    Start Building Today
                </h2>
                <p className={`${theme.textMuted} mb-6 max-w-2xl mx-auto`}>
                    Get 5 free project generations every month. No credit card required.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        to="/generator"
                        className={`inline-flex items-center gap-2 px-6 py-3 ${theme.accent} text-white font-semibold rounded-xl ${theme.accentHover} transition-all shadow-lg hover:shadow-xl`}
                    >
                        <Play className="w-5 h-5" />
                        Try GenRAD Now
                    </Link>
                    <Link
                        to="/research"
                        className={`inline-flex items-center gap-2 px-6 py-3 ${theme.cardBg} border-2 ${theme.border} ${theme.text} font-semibold rounded-xl ${theme.hoverBg} transition-all`}
                    >
                        Learn More
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Main Features */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Core Features</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const colorClasses = getColorClasses(feature.color);
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${colorClasses.border} ${colorClasses.bg} transition-all hover:shadow-lg`}
                            >
                                <div className={`p-3 rounded-lg ${colorClasses.bg} border ${colorClasses.border} w-fit mb-4`}>
                                    <Icon className={`w-6 h-6 ${colorClasses.icon}`} />
                                </div>
                                <h3 className={`text-lg font-bold ${theme.text} mb-2`}>
                                    {feature.title}
                                </h3>
                                <p className={`text-sm ${theme.textMuted} mb-4`}>
                                    {feature.description}
                                </p>
                                <ul className="space-y-2">
                                    {feature.highlights.map((highlight, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle2 className={`w-4 h-4 ${colorClasses.icon} flex-shrink-0 mt-0.5`} />
                                            <span className={`text-xs ${theme.textMuted}`}>{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* How It Works */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Zap className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>How It Works</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {workflowSteps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                {index < workflowSteps.length - 1 && (
                                    <div className={`hidden lg:block absolute top-12 left-1/2 w-full h-0.5 ${theme.border}`}></div>
                                )}
                                <div className="relative text-center">
                                    <div className={`w-24 h-24 mx-auto mb-4 rounded-full ${theme.accentBg} border-2 ${theme.accentBorder} flex items-center justify-center`}>
                                        <Icon className={`w-10 h-10 ${theme.accentText}`} />
                                    </div>
                                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${theme.accentBg} ${theme.accentText} mb-2`}>
                                        Step {step.step}
                                    </div>
                                    <h3 className={`text-lg font-bold ${theme.text} mb-2`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm ${theme.textMuted} mb-3`}>
                                        {step.description}
                                    </p>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} font-mono p-2 rounded ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                        {step.example}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Use Cases */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Boxes className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Use Cases</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {useCases.map((useCase, index) => {
                        const Icon = useCase.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${theme.border} ${theme.hoverBg} transition-all`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-lg ${theme.accentBg}`}>
                                        <Icon className={`w-6 h-6 ${theme.accentText}`} />
                                    </div>
                                    <h3 className={`text-lg font-bold ${theme.text}`}>
                                        {useCase.title}
                                    </h3>
                                </div>
                                <p className={`text-sm ${theme.textMuted} mb-4`}>
                                    {useCase.description}
                                </p>
                                <ul className="grid grid-cols-2 gap-2">
                                    {useCase.scenarios.map((scenario, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <ChevronRight className={`w-4 h-4 ${theme.accentText} flex-shrink-0 mt-0.5`} />
                                            <span className={`text-xs ${theme.textMuted}`}>{scenario}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Technical Capabilities */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Settings className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Technical Capabilities</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {capabilities.map((capability, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}
                        >
                            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>
                                {capability.category}
                            </h3>
                            <div className="space-y-3">
                                {capability.items.map((item, idx) => (
                                    <div key={idx}>
                                        <div className={`text-sm font-semibold ${theme.text}`}>
                                            {item.name}
                                        </div>
                                        <div className={`text-xs ${theme.textMuted}`}>
                                            {item.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>GenRAD vs Traditional Setup</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={`border-b ${theme.border}`}>
                                <th className={`text-left p-4 ${theme.text} font-semibold`}>Feature</th>
                                <th className={`text-left p-4 ${theme.text} font-semibold`}>Traditional</th>
                                <th className={`text-left p-4 ${theme.text} font-semibold`}>GenRAD</th>
                                <th className={`text-left p-4 ${theme.text} font-semibold`}>Improvement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.map((row, index) => (
                                <tr
                                    key={index}
                                    className={`border-b ${theme.border} ${theme.hoverBg} transition-all`}
                                >
                                    <td className={`p-4 font-medium ${theme.text}`}>{row.feature}</td>
                                    <td className={`p-4 ${theme.textMuted}`}>{row.traditional}</td>
                                    <td className={`p-4 ${theme.accentText} font-semibold`}>{row.genrad}</td>
                                    <td className={`p-4`}>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                                            <Star className="w-3 h-3" />
                                            {row.improvement}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Final CTA */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-12 border ${theme.cardBorder} text-center`}>
                <h2 className={`text-3xl font-bold ${theme.text} mb-4`}>
                    Ready to Build Faster?
                </h2>
                <p className={`${theme.textMuted} mb-8 text-lg max-w-2xl mx-auto`}>
                    Join developers who are accelerating their workflow with AI-powered project generation.
                </p>
                <Link
                    to="/generator"
                    className={`inline-flex items-center gap-2 px-8 py-4 ${theme.accent} text-white font-bold text-lg rounded-xl ${theme.accentHover} transition-all shadow-lg hover:shadow-xl`}
                >
                    <Rocket className="w-6 h-6" />
                    Start Generating Now
                </Link>
                <p className={`text-sm ${theme.textMuted} mt-4`}>
                    Free • No Credit Card Required • 5 Credits/Month
                </p>
            </div>
        </div>
    );
}