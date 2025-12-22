const Anthropic = require('@anthropic-ai/sdk');
const User = require('../models/User'); 

// 1. SAFE INITIALIZATION
// Check if key exists to prevent crashing immediately
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
    console.error("FATAL ERROR: ANTHROPIC_API_KEY is missing in .env file");
}

const anthropic = new Anthropic({
    apiKey: apiKey || 'dummy_key_to_prevent_init_crash', 
});

const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

// Helper: Extract JSON array from text (fixes "chatty" AI responses)
const extractJsonArray = (text) => {
    try {
        // Find the first '[' and the last ']'
        const start = text.indexOf('[');
        const end = text.lastIndexOf(']');
        
        if (start === -1 || end === -1 || start > end) {
            return null; // No array found
        }
        
        const jsonStr = text.substring(start, end + 1);
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
};

const promptConfig = {
    'react-native': {
        name: 'React Native',
        structureExample: ["App.jsx", "package.json", "src/screens/HomeScreen.jsx"],
        structurePrompt: `List files for a React Native CLI project. Must include routing (React Navigation).`,
        contentRequirements: `- Use .jsx and functional components.\n- Implement React Navigation.\n- Use StyleSheet for styling.`,
        packageJsonHint: `- Valid JSON with dependencies for react-native and navigation.`
    },
    'react-vite': {
        name: 'React + Vite + Tailwind',
        structureExample: ["index.html", "package.json", "src/App.jsx"],
        structurePrompt: `List files for a React + Vite + Tailwind CSS project. Must include routing.`,
        contentRequirements: `- Use .jsx and functional components.\n- Implement React Router (v7+).\n- Use Tailwind CSS classes.`,
        packageJsonHint: `- Valid JSON with dependencies.`
    }
};

/**
 * Stage 1: File List Generation
 */
exports.generateStructure = async (req, res) => {
    const { prompt, projectType } = req.body;
    const userId = req.user.id; 

    if (!prompt || !projectType) {
        return res.status(400).json({ error: 'Missing prompt or projectType' });
    }

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: ANTHROPIC_API_KEY is missing.' });
    }

    const config = promptConfig[projectType];
    if (!config) {
        return res.status(400).json({ error: 'Invalid projectType' });
    }

    try {
        // --- CREDIT CHECK ---
        const user = await User.checkAndResetCredits(userId);
        if (user.credits <= 0) {
            return res.status(403).json({ error: 'You have no project generation credits remaining.' });
        }

        await User.deductCredit(userId, prompt);
        // --- END CREDIT LOGIC ---

        const systemPrompt = `You are a senior software architect.
        Task: Return a JSON Array of file paths for a ${config.name} project.
        User Description: "${prompt}"
        
        RULES:
        1. Return ONLY the JSON array.
        2. No markdown, no explanations.
        3. Example: ${JSON.stringify(config.structureExample)}`;

        console.log(`[Stage 1] Calling Claude for structure: ${projectType}`);

        const message = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                { role: "user", content: "Generate file list." }
            ]
        });

        const responseText = message.content[0].text;
        console.log(`[Stage 1] Raw Response: ${responseText.substring(0, 100)}...`);

        // Use robust extraction
        const filePaths = extractJsonArray(responseText);

        if (!Array.isArray(filePaths) || filePaths.length === 0) {
            console.error('[Stage 1] Failed to parse JSON:', responseText);
            throw new Error('AI returned invalid JSON format. Please try again.');
        }

        res.json({ filePaths });

    } catch (err) {
        console.error('Stage 1 Fatal Error:', err);
        // Safely extract error message
        const errorMessage = err.message || 'Unknown server error';
        
        if (errorMessage.includes('credit')) {
            return res.status(403).json({ error: errorMessage });
        }
        res.status(500).json({ error: `Generation failed: ${errorMessage}` });
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

    const systemPrompt = `You are an expert ${config.name} developer.
    Task: Generate code for "${filePath}".
    Context: "${prompt}"
    
    Requirements:
    ${config.contentRequirements}
    ${filePath.includes('package.json') ? config.packageJsonHint : ''}
    
    Output: ONLY raw code. No markdown blocks.`;

    while (retries > 0 && !content) {
        try {
            console.log(`[Stage 2] Generating ${filePath}...`);
            
            const message = await anthropic.messages.create({
                model: CLAUDE_MODEL,
                max_tokens: 4096,
                system: systemPrompt,
                messages: [
                    { role: "user", content: "Generate code." }
                ]
            });

            let generatedText = message.content[0].text;
            
            // Clean markdown blocks if present
            generatedText = generatedText.replace(/```[a-z]*\n?/g, '').replace(/```\n?/g, '').trim();

            if (generatedText.length < 5) {
                throw new Error('Content too short');
            }

            if (filePath === 'src/index.css' && !generatedText.includes('@tailwind')) {
                generatedText = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${generatedText}`;
            }

            content = generatedText;

        } catch (err) {
            lastError = err;
            retries--;
            console.error(`[Stage 2] Error on ${filePath}:`, err.message);
            if (retries > 0) await new Promise(r => setTimeout(r, 1000));
        }
    }

    if (content) {
        res.json({ filePath, content });
    } else {
        res.status(500).json({
            error: `Failed to generate file: ${filePath}.`,
            filePath: filePath
        });
    }
};