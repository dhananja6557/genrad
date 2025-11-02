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
const API_BASE_URL = 'http://localhost:3000';

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