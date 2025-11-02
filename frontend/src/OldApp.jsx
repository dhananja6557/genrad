import React, { useState, useEffect } from 'react';
import { FileDown, Loader2, Code2, Sparkles, FolderTree, Package, CheckCircle, Moon, Sun, KeyRound, Smartphone, Monitor } from 'lucide-react';

// NEW: Define project types for the UI
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

// NEW: Backend API URL
const API_BASE_URL = 'http://localhost:3001';

const App = () => {
    // Theme state
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for system preference on mount
    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeMediaQuery.matches);

        const handler = (e) => setIsDarkMode(e.matches);
        darkModeMediaQuery.addEventListener('change', handler);
        return () => darkModeMediaQuery.removeEventListener('change', handler);
    }, []);

    // --- MODIFIED: Removed apiKey state ---
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

    const loadJSZip = () => {
        return new Promise((resolve, reject) => {
            if (window.JSZip) {
                resolve(window.JSZip);
                return;
            }
            // This script is loaded in index.html, but we double-check
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => resolve(window.JSZip);
            script.onerror = () => reject(new Error('Failed to load JSZip'));
            document.head.appendChild(script);
        });
    };

    /**
     * --- MODIFIED ---
     * This function now orchestrates calls to the backend.
     */
    const generateProject = async () => {
        // --- MODIFIED: Removed apiKey check ---
        if (!prompt.trim()) {
            setError('Please enter a description');
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

            const structureResponse = await fetch(`${API_BASE_URL}/stage1-generate-structure`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // --- MODIFIED: Removed apiKey from body ---
                body: JSON.stringify({ prompt, projectType })
            });

            if (!structureResponse.ok) {
                const err = await structureResponse.json();
                throw new Error(err.error || 'Failed to generate project structure.');
            }

            const { filePaths } = await structureResponse.json();
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
                    const contentResponse = await fetch(`${API_BASE_URL}/stage2-generate-content`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        // --- MODIFIED: Removed apiKey from body ---
                        body: JSON.stringify({ prompt, projectType, filePath })
                    });

                    if (!contentResponse.ok) {
                        const err = await contentResponse.json();
                        throw new Error(err.error || `Failed to generate file: ${filePath}`);
                    }

                    const { content } = await contentResponse.json();
                    localFiles[filePath] = content;
                    setGeneratedFilesList(prev => [...prev, filePath]);

                } catch (err) {
                    console.error(`Failed to generate ${filePath}:`, err);
                    if (skipFailedFiles) {
                        setSkippedFiles(prev => [...prev, filePath]);
                    } else {
                        // Halt generation
                        throw new Error(`Failed on file: ${filePath}. ${err.message}`);
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
            setError(`Error: ${err.message}`);
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
        }
    };
    // --- END MODIFICATION ---

    /**
     * --- UNCHANGED ---
     * Zipping is done on the client-side after all files are fetched.
     */
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
        // Use document.execCommand for iFrame compatibility
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

    // Theme classes (No changes)
    const theme = {
        bg: isDarkMode ? 'bg-black' : 'bg-white',
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

    // Instruction components (No changes)
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
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>npx react-native start</code></li>
                <li>In a new terminal, run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>npx react-native run-android</code> or <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>run-ios</code></li>
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
                <li>Run <code className={`${isDarkMode ? 'bg-red-950 text-red-300' : 'bg-red-100 text-red-900'} px-2 py-1 rounded`}>npm run dev</code></li>
                <li>Open the URL (e.g., `http://localhost:5173`) in your browser.</li>
            </ol>
            <div className={`mt-4 pt-4 border-t ${theme.accentBorder}`}>
                <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                    ✨ Project includes <strong>Vite</strong>, <strong>Tailwind CSS</strong>, and <strong>React Router</strong> setup.
                </p>
            </div>
        </>
    );

    // --- Main JSX (Almost identical, just placeholder text is dynamic) ---
    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center mb-8 pt-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Package className={`w-10 h-10 ${theme.accentText}`} />
                        <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            GenRAD: AI Project Generator
                        </h1>
                        <Sparkles className={`w-10 h-10 ${theme.accentText}`} />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className={`px-3 py-1 ${theme.accentBg} ${theme.accentText} text-xs font-semibold rounded-full`}>
                            Web & Mobile
                        </span>
                        <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>
                            React Native CLI
                        </span>
                        <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>
                            React + Vite
                        </span>
                        <span className={`px-3 py-1 ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'} text-xs font-semibold rounded-full`}>
                            Powered by Gemini 1.5 Flash
                        </span>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`ml-2 p-2 rounded-lg ${theme.cardBg} ${theme.border} border ${theme.hoverBg} transition-colors`}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-700" />}
                        </button>
                    </div>

                    <p className={`${theme.textMuted} text-lg`}>
                        Generate complete, runnable {projectTypes[projectType].name} projects with full file structure
                    </p>

                </div>

                <div className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-6 border ${theme.cardBorder}`}>

                    {/* --- MODIFIED: Removed API Key Input Field --- */}

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

                    <div className="my-4">
                        <label className={`block text-sm font-semibold ${theme.text} mb-2`}>
                            Select Project Type:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
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
                    {/* --- END NEW --- */}

                    <button
                        onClick={generateProject}
                        // --- MODIFIED: Removed apiKey check from disabled prop ---
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

                    {/* All the conditional rendering for progress, errors, and skipped files remains identical */}
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

                    {/* --- MODIFIED --- 
              I removed `!isGenerating` from this condition.
              Now, this list will appear and update *during* the generation
              process, as soon as the first file is successfully created.
          */}
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
                                            {/* --- MODIFIED: Removed "checking your API Key" --- */}
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
                                                : `${theme.textMuted} ${theme.hoverBg}`
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
                                        <span className="text-2xl">{getFileIcon(activeFile)}</span>
                                        <h3 className={`text-xl font-bold ${theme.text} truncate`}>{activeFile}</h3>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg font-medium transition-colors flex items-center gap-2 flex-shrink-0`}
                                    >
                                        <Code2 className="w-4 h-4" />
                                        Copy
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className={`${isDarkMode ? 'bg-black' : 'bg-gray-900'} rounded-xl p-6 overflow-x-auto max-h-[600px] overflow-y-auto`}>
                                        <pre className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-100'} font-mono`}>
                                            <code>{projectFiles[activeFile]}</code>
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
                            <p className={`${theme.textMuted} text-sm`}>
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
            </div>
        </div>
    );
}

export default App;