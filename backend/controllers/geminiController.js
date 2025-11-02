// controllers/geminiController.js
const fetchModule = require('node-fetch');
const fetch = fetchModule.default || fetchModule;

// NOTE: The API key is now loaded from environment variables
const API_KEY = process.env.GEMINI_API_KEY;

// Project configuration moved here
const promptConfig = {
    'react-native': {
        name: 'React Native',
        icon: '📱',
        structureExample: ["App.jsx", "package.json", "src/screens/HomeScreen.jsx"],
        structurePrompt: `List files for a React Native CLI project. Must include routing.`,
        contentRequirements: `- Use .jsx and functional components. - Implement React Navigation.`,
        packageJsonHint: `- Valid JSON with dependencies.`
    },
    'react-vite': {
        name: 'React + Vite + Tailwind',
        icon: '🖥️',
        structureExample: ["index.html", "package.json", "src/App.jsx"],
        structurePrompt: `List files for a React + Vite + Tailwind CSS project. Must include routing.`,
        contentRequirements: `- Use .jsx and functional components. - Implement React Router DOM (v6+).`,
        packageJsonHint: `- Valid JSON with dependencies.`
    }
};

// Helper function to call the Gemini API
const callGemini = async (payload) => {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Check your .env file.");
    }

    const GEMINI_MODEL = 'gemini-2.5-flash';
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes timeout

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(errorData.error?.message || `API returned status ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
            throw new Error('Invalid response structure (no candidates)');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
            throw new Error('Gemini request timed out after 5 minutes.');
        }
        throw err;
    }
};

/**
 * Stage 1: File List Generation
 */
exports.generateStructure = async (req, res) => {
    const { prompt, projectType } = req.body;

    if (!prompt || !projectType) {
        return res.status(400).json({ error: 'Missing prompt or projectType' });
    }

    const config = promptConfig[projectType];
    if (!config) {
        return res.status(400).json({ error: 'Invalid projectType' });
    }

    const payload = {
        contents: [{
            parts: [{
                text: `Based on: "${prompt}"\n\n${config.structurePrompt}\n\nRespond with ONLY a JSON array of file paths. Example:\n${JSON.stringify(config.structureExample)}`
            }]
        }]
    };

    try {
        const responseText = await callGemini(payload);
        const filePathsText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const filePaths = JSON.parse(filePathsText);

        if (!Array.isArray(filePaths) || filePaths.length === 0) {
            throw new Error('Could not determine project structure.');
        }

        res.json({ filePaths });

    } catch (err) {
        console.error('Stage 1 Error:', err);
        res.status(500).json({ error: err.message || 'Failed to generate project structure.' });
    }
};

/**
 * Stage 2: File Content Generation
 */
exports.generateContent = async (req, res) => {
    const { prompt, projectType, filePath } = req.body;

    if (!prompt || !projectType || !filePath) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const config = promptConfig[projectType];
    if (!config) {
        return res.status(400).json({ error: 'Invalid projectType' });
    }

    let content = '';
    let retries = 2;
    let lastError = null;

    while (retries > 0 && !content) {
        try {
            const payload = {
                contents: [{
                    parts: [{
                        text: `Generate ${filePath} for: "${prompt}"\n\nProject Type: ${config.name}\n\nRequirements:\n${config.contentRequirements}\n${filePath.includes('package.json') ? config.packageJsonHint : ''}\n- For ${filePath}, generate complete, runnable, production-ready code.\n\nONLY file content. No markdown, no backticks, no explanations.`
                    }]
                }]
            };

            let generatedText = await callGemini(payload);
            generatedText = generatedText.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '').trim();

            if (generatedText.length < 10) {
                throw new Error('Generated content too short');
            }

            // Add Tailwind CSS directives if missing for index.css
            if (filePath === 'src/index.css' && !generatedText.includes('@tailwind')) {
                generatedText = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Custom styles below */\n${generatedText}`;
            }

            content = generatedText; // Success

        } catch (err) {
            lastError = err;
            retries--;
            if (retries > 0) {
                console.log(`Retrying ${filePath}... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    if (content) {
        res.json({ filePath, content });
    } else {
        console.error(`Failed to generate ${filePath} after all retries:`, lastError);
        res.status(500).json({
            error: `Failed to generate file: ${filePath}. ${lastError.message}`,
            filePath: filePath
        });
    }
};