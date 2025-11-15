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

                // --- FIX: PAUSE TO AVOID RATE LIMIT ---
                // Pause for 1.5s to avoid rate-limiting, unless it's the last file.
                if (i < totalFiles - 1) {
                    await sleep(1500);
                }
                // --- END OF FIX ---
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

            // Call the refetch function to update the header
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

    const hasCredits = user ? user.credits > 0 : true;

    return (
        <>
            <div className="text-center mb-8 pt-8 mt-8">
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
                    className={`mt-4 w-full ${theme.accent} ${theme.accentHover} text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Project...
                        </>
                    ) : !hasCredits ? (
                        <>
                            <AlertCircle className="w-5 h-5" />
                            No Credits Remaining
                        </>
                    ) : (
                        <>
                            <FolderTree className="w-5 h-5" />
                            Generate Complete Project (1 Credit)
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
                    <div className={`lg:col-span-1 ${theme.cardBg} rounded-2xl shadow-xl p-6 border ${theme.cardBorder}`}>
                        <div className="flex justify-between items-center mb-4">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                className={`w-full p-2 border-b-2 ${theme.inputBorder} ${theme.inputBg} ${theme.text} focus:outline-none focus:border-red-500`}
                            />
                        </div>
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={downloadAsZip}
                                className={`w-1/2 ${theme.accent} ${theme.accentHover} text-white py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all`}
                            >
                                <FileDown className="w-4 h-4" />
                                Download ZIP
                            </button>
                            <button
                                onClick={saveProject}
                                disabled={isSaving || loadedProjectId}
                                className={`w-1/2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme.text} py-2 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
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
                                <div className={`flex justify-between items-center p-4 border-b ${theme.border}`}>
                                    <div className="flex items-center gap-2">
                                        <span>{getFileIcon(activeFile)}</span>
                                        <span className={`font-mono text-sm ${theme.text}`}>{activeFile}</span>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`py-1 px-3 rounded-lg text-xs font-medium ${theme.hoverBg} ${theme.text} border ${theme.border}`}
                                    >
                                        Copy Code
                                    </button>
                                </div>
                                <pre className={`p-6 text-sm overflow-auto ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'} max-h-[600px] ${theme.text}`}>
                                    <code className="font-mono">{projectFiles[activeFile]}</code>
                                </pre>
                            </>
                        ) : (
                            <div className={`p-6 ${theme.accentBg} border-t-4 ${theme.accentBorder}`}>
                                {projectType === 'react-native' ? <RenderNativeInstructions /> : <RenderViteInstructions />}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}