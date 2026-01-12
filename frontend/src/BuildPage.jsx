import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    Code2,
    BookOpen,
    Terminal,
    Wrench,
    Rocket,
    FileCode,
    FolderTree,
    GitBranch,
    Package,
    Smartphone,
    Monitor,
    Download,
    PlayCircle,
    CheckCircle2,
    AlertCircle,
    Info,
    ExternalLink,
    Copy,
    ChevronRight,
    Layers,
    Settings,
    Zap,
    Database,
    Globe,
    Shield,
    Bug,
    Heart,
    Star,
    ArrowRight,
    FileText,
    Boxes
} from 'lucide-react';

export default function BuildPage() {
    const { theme, isDarkMode } = useOutletContext();
    const [activeGuide, setActiveGuide] = useState('react-native');
    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    // Quick Start Guides
    const guides = {
        'react-native': {
            title: 'React Native Quick Start',
            icon: Smartphone,
            description: 'Build native mobile apps for iOS and Android',
            steps: [
                {
                    title: 'Generate Your Project',
                    description: 'Use GenRAD to create your React Native project structure',
                    code: '1. Go to Generator\n2. Select "React Native"\n3. Describe your app\n4. Click "Generate Project"',
                    codeId: 'rn-step1'
                },
                {
                    title: 'Download & Extract',
                    description: 'Download the ZIP file and extract it to your workspace',
                    code: 'cd ~/projects\nunzip my-app.zip\ncd my-app',
                    codeId: 'rn-step2'
                },
                {
                    title: 'Install Dependencies',
                    description: 'Install all required npm packages',
                    code: 'npm install\n# or\nyarn install',
                    codeId: 'rn-step3'
                },
                {
                    title: 'Start Metro Bundler',
                    description: 'Launch the React Native development server',
                    code: 'npx react-native start',
                    codeId: 'rn-step4'
                },
                {
                    title: 'Run on Device/Emulator',
                    description: 'Launch your app on Android or iOS',
                    code: '# Android\nnpx react-native run-android\n\n# iOS (Mac only)\nnpx react-native run-ios',
                    codeId: 'rn-step5'
                }
            ]
        },
        'react-vite': {
            title: 'React + Vite Quick Start',
            icon: Monitor,
            description: 'Build modern web applications with blazing fast development',
            steps: [
                {
                    title: 'Generate Your Project',
                    description: 'Use GenRAD to create your React + Vite project',
                    code: '1. Go to Generator\n2. Select "React + Vite"\n3. Describe your app\n4. Click "Generate Project"',
                    codeId: 'vite-step1'
                },
                {
                    title: 'Download & Extract',
                    description: 'Download the ZIP file and extract it to your workspace',
                    code: 'cd ~/projects\nunzip my-web-app.zip\ncd my-web-app',
                    codeId: 'vite-step2'
                },
                {
                    title: 'Install Dependencies',
                    description: 'Install all required npm packages',
                    code: 'npm install\n# or\nyarn install',
                    codeId: 'vite-step3'
                },
                {
                    title: 'Start Development Server',
                    description: 'Launch the Vite development server',
                    code: 'npm run dev\n# or\nyarn dev',
                    codeId: 'vite-step4'
                },
                {
                    title: 'Build for Production',
                    description: 'Create an optimized production build',
                    code: 'npm run build\n# or\nyarn build',
                    codeId: 'vite-step5'
                }
            ]
        }
    };

    // Development Resources
    const resources = [
        {
            category: 'Documentation',
            icon: BookOpen,
            items: [
                { name: 'React 19 Docs', url: 'https://react.dev', description: 'Official React documentation' },
                { name: 'React Native Docs', url: 'https://reactnative.dev', description: 'Official React Native guides' },
                { name: 'Vite Guide', url: 'https://vitejs.dev', description: 'Vite build tool documentation' },
                { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'Utility-first CSS framework' }
            ]
        },
        {
            category: 'Tools & Extensions',
            icon: Wrench,
            items: [
                { name: 'VS Code', url: 'https://code.visualstudio.com', description: 'Recommended code editor' },
                { name: 'React DevTools', url: 'https://react.dev/learn/react-developer-tools', description: 'Browser debugging extension' },
                { name: 'ESLint', url: 'https://eslint.org', description: 'JavaScript linting tool' },
                { name: 'Prettier', url: 'https://prettier.io', description: 'Code formatting tool' }
            ]
        },
        {
            category: 'Learning Resources',
            icon: Star,
            items: [
                { name: 'React Tutorial', url: 'https://react.dev/learn', description: 'Official React learning path' },
                { name: 'JavaScript.info', url: 'https://javascript.info', description: 'Modern JavaScript tutorial' },
                { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', description: 'Free coding bootcamp' },
                { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Web development reference' }
            ]
        }
    ];

    // Best Practices
    const bestPractices = [
        {
            title: 'Project Structure',
            icon: FolderTree,
            tips: [
                'Keep components in separate files for better organization',
                'Use folders to group related components and screens',
                'Maintain a consistent naming convention (PascalCase for components)',
                'Separate business logic from presentation components'
            ]
        },
        {
            title: 'Code Quality',
            icon: Code2,
            tips: [
                'Use functional components with hooks instead of class components',
                'Keep components small and focused on single responsibility',
                'Write descriptive variable and function names',
                'Add comments for complex logic, but prefer self-documenting code'
            ]
        },
        {
            title: 'Performance',
            icon: Zap,
            tips: [
                'Use React.memo() for expensive component renders',
                'Implement lazy loading for routes and heavy components',
                'Optimize images and assets before deployment',
                'Avoid unnecessary re-renders with useMemo and useCallback'
            ]
        },
        {
            title: 'Security',
            icon: Shield,
            tips: [
                'Never commit API keys or secrets to version control',
                'Validate and sanitize all user inputs',
                'Use environment variables for configuration',
                'Keep dependencies updated to patch security vulnerabilities'
            ]
        }
    ];

    // Common Issues & Solutions
    const troubleshooting = [
        {
            issue: 'Metro bundler connection refused (React Native)',
            solution: 'Restart Metro bundler and clear cache: npx react-native start --reset-cache',
            severity: 'warning'
        },
        {
            issue: 'Module not found errors',
            solution: 'Delete node_modules and package-lock.json, then run npm install again',
            severity: 'error'
        },
        {
            issue: 'Tailwind classes not working',
            solution: 'Ensure Tailwind is properly configured in vite.config.js and imported in index.css',
            severity: 'warning'
        },
        {
            issue: 'Build fails with "out of memory" error',
            solution: 'Increase Node memory: NODE_OPTIONS=--max-old-space-size=4096 npm run build',
            severity: 'error'
        },
        {
            issue: 'Hot reload not working',
            solution: 'Check that your dev server is running and firewall isn\'t blocking the port',
            severity: 'info'
        }
    ];

    // Deployment Options
    const deploymentOptions = [
        {
            platform: 'Vercel',
            icon: Globe,
            type: 'React + Vite',
            description: 'Deploy web apps instantly with zero configuration',
            steps: [
                'Push your code to GitHub',
                'Import project in Vercel dashboard',
                'Configure build settings (npm run build)',
                'Deploy with one click'
            ],
            url: 'https://vercel.com'
        },
        {
            platform: 'Netlify',
            icon: Globe,
            type: 'React + Vite',
            description: 'Modern web hosting with continuous deployment',
            steps: [
                'Connect your Git repository',
                'Set build command: npm run build',
                'Set publish directory: dist',
                'Deploy automatically on push'
            ],
            url: 'https://netlify.com'
        },
        {
            platform: 'Expo',
            icon: Smartphone,
            type: 'React Native',
            description: 'Build and submit to app stores easily',
            steps: [
                'Install Expo CLI: npm install -g expo-cli',
                'Initialize Expo: expo init',
                'Build for Android: expo build:android',
                'Build for iOS: expo build:ios'
            ],
            url: 'https://expo.dev'
        },
        {
            platform: 'App Store & Play Store',
            icon: Smartphone,
            type: 'React Native',
            description: 'Publish to native app stores',
            steps: [
                'Build release APK/IPA',
                'Create developer accounts',
                'Prepare store listings',
                'Submit for review'
            ],
            url: '#'
        }
    ];

    // Code Examples
    const codeExamples = [
        {
            title: 'Adding a New Screen (React Native)',
            language: 'jsx',
            code: `// src/screens/ProfileScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});`
        },
        {
            title: 'Adding a New Page (React + Vite)',
            language: 'jsx',
            code: `// src/pages/AboutPage.jsx
import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About Us
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Welcome to our application!
        </p>
      </div>
    </div>
  );
}`
        }
    ];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} py-8`}>
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl`}></div>
                <div className="relative">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-2xl ${theme.accentBg} border ${theme.accentBorder}`}>
                            <Wrench className={`w-12 h-12 ${theme.accentText}`} />
                        </div>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${theme.text}`}>
                        Build with GenRAD
                    </h1>

                    <p className={`max-w-3xl mx-auto text-center ${theme.textMuted} text-lg`}>
                        Complete guides, best practices, and resources to build amazing applications
                        with your GenRAD-generated projects
                    </p>
                </div>
            </div>

            {/* Quick Start Guides */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Rocket className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Quick Start Guides</h2>
                </div>

                {/* Guide Tabs */}
                <div className="flex gap-4 mb-6">
                    {Object.entries(guides).map(([key, guide]) => {
                        const Icon = guide.icon;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveGuide(key)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${activeGuide === key
                                        ? `${theme.accent} text-white`
                                        : `${theme.cardBg} border ${theme.border} ${theme.text} ${theme.hoverBg}`
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {guide.title}
                            </button>
                        );
                    })}
                </div>

                {/* Active Guide Content */}
                <div className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    <p className={`${theme.textMuted} mb-6`}>
                        {guides[activeGuide].description}
                    </p>
                    <div className="space-y-6">
                        {guides[activeGuide].steps.map((step, index) => (
                            <div key={index} className={`relative pl-8`}>
                                <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${theme.accentBg} border-2 ${theme.accentBorder} flex items-center justify-center`}>
                                    <span className={`text-xs font-bold ${theme.accentText}`}>{index + 1}</span>
                                </div>
                                <h3 className={`text-lg font-bold ${theme.text} mb-2`}>{step.title}</h3>
                                <p className={`text-sm ${theme.textMuted} mb-3`}>{step.description}</p>
                                <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border} rounded-lg p-4`}>
                                    <button
                                        onClick={() => copyToClipboard(step.code, step.codeId)}
                                        className={`absolute top-2 right-2 p-2 rounded ${theme.hoverBg} transition-all`}
                                        title="Copy code"
                                    >
                                        {copiedCode === step.codeId ? (
                                            <CheckCircle2 className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                        ) : (
                                            <Copy className={`w-4 h-4 ${theme.textMuted}`} />
                                        )}
                                    </button>
                                    <pre className={`text-sm ${theme.text} font-mono overflow-x-auto`}>
                                        {step.code}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best Practices */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Star className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Best Practices</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bestPractices.map((practice, index) => {
                        const Icon = practice.icon;
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
                                        {practice.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {practice.tips.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle2 className={`w-4 h-4 ${theme.accentText} flex-shrink-0 mt-1`} />
                                            <span className={`text-sm ${theme.textMuted}`}>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Code Examples */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <FileCode className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Code Examples</h2>
                </div>
                <div className="space-y-6">
                    {codeExamples.map((example, index) => (
                        <div key={index} className={`rounded-xl border ${theme.border} overflow-hidden`}>
                            <div className={`px-6 py-4 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'} border-b ${theme.border}`}>
                                <h3 className={`text-lg font-bold ${theme.text}`}>{example.title}</h3>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => copyToClipboard(example.code, `example-${index}`)}
                                    className={`absolute top-4 right-4 p-2 rounded ${theme.hoverBg} transition-all`}
                                    title="Copy code"
                                >
                                    {copiedCode === `example-${index}` ? (
                                        <CheckCircle2 className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                                    ) : (
                                        <Copy className={`w-4 h-4 ${theme.textMuted}`} />
                                    )}
                                </button>
                                <pre className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-auto`}>
                                    <code className={`text-sm ${theme.text} font-mono`}>
                                        {example.code}
                                    </code>
                                </pre>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Troubleshooting */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Bug className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Common Issues & Solutions</h2>
                </div>
                <div className="space-y-4">
                    {troubleshooting.map((item, index) => {
                        const severityColors = {
                            error: isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200',
                            warning: isDarkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200',
                            info: isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                        };
                        const severityIcons = {
                            error: <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />,
                            warning: <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />,
                            info: <Info className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        };

                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border ${severityColors[item.severity]}`}
                            >
                                <div className="flex items-start gap-3">
                                    {severityIcons[item.severity]}
                                    <div className="flex-1">
                                        <h3 className={`font-semibold ${theme.text} mb-1`}>
                                            {item.issue}
                                        </h3>
                                        <p className={`text-sm ${theme.textMuted}`}>
                                            <strong>Solution:</strong> {item.solution}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Deployment Options */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Rocket className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Deployment Options</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {deploymentOptions.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${theme.border} ${theme.hoverBg} transition-all`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-6 h-6 ${theme.accentText}`} />
                                        <h3 className={`text-lg font-bold ${theme.text}`}>
                                            {option.platform}
                                        </h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${theme.accentBg} ${theme.accentText}`}>
                                        {option.type}
                                    </span>
                                </div>
                                <p className={`text-sm ${theme.textMuted} mb-4`}>
                                    {option.description}
                                </p>
                                <ol className="space-y-2 mb-4">
                                    {option.steps.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <span className={`font-bold ${theme.accentText} flex-shrink-0`}>{idx + 1}.</span>
                                            <span className={`text-sm ${theme.textMuted}`}>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                                {option.url !== '#' && (
                                    <a
                                        href={option.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-2 text-sm ${theme.accentText} hover:underline`}
                                    >
                                        Learn More
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Development Resources */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Development Resources</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {resources.map((resource, index) => {
                        const Icon = resource.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Icon className={`w-5 h-5 ${theme.accentText}`} />
                                    <h3 className={`text-lg font-bold ${theme.text}`}>
                                        {resource.category}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {resource.items.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`block p-3 rounded-lg border ${theme.border} ${theme.hoverBg} transition-all`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className={`font-semibold ${theme.text} text-sm`}>
                                                    {item.name}
                                                </h4>
                                                <ExternalLink className={`w-4 h-4 ${theme.textMuted}`} />
                                            </div>
                                            <p className={`text-xs ${theme.textMuted}`}>
                                                {item.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <div className={`${theme.cardBg} rounded-2xl shadow-xl p-12 border ${theme.cardBorder} text-center`}>
                <h2 className={`text-3xl font-bold ${theme.text} mb-4`}>
                    Ready to Start Building?
                </h2>
                <p className={`${theme.textMuted} mb-8 text-lg max-w-2xl mx-auto`}>
                    Generate your project now and start developing with best practices built-in.
                </p>
                <Link
                    to="/generator"
                    className={`inline-flex items-center gap-2 px-8 py-4 ${theme.accent} text-white font-bold text-lg rounded-xl ${theme.accentHover} transition-all shadow-lg hover:shadow-xl`}
                >
                    <PlayCircle className="w-6 h-6" />
                    Generate Your Project
                </Link>
            </div>
        </div>
    );
}