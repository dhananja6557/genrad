const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'React Native Generator Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Proxy endpoint for Anthropic API
app.post('/api/messages', async (req, res) => {
    try {
        console.log(process.env.ANTHROPIC_API_KEY);
        
        // Validate API key
        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({
                error: 'ANTHROPIC_API_KEY not configured. Please set it in .env file'
            });
        }

        // Validate request body
        if (!req.body.model || !req.body.messages) {
            return res.status(400).json({
                error: 'Invalid request. Required fields: model, messages'
            });
        }

        console.log(`[${new Date().toISOString()}] Generating response for model: ${req.body.model}`);

        // Call Anthropic API
        const message = await anthropic.messages.create({
            model: req.body.model,
            max_tokens: req.body.max_tokens || 2000,
            messages: req.body.messages,
        });

        console.log(`[${new Date().toISOString()}] Response generated successfully`);

        // Return response
        res.json(message);

    } catch (error) {
        console.error('Error calling Anthropic API:', error);

        // Handle specific error types
        if (error.status === 401) {
            return res.status(401).json({
                error: 'Invalid API key. Please check your ANTHROPIC_API_KEY in .env file'
            });
        }

        if (error.status === 429) {
            return res.status(429).json({
                error: 'Rate limit exceeded. Please try again in a moment.'
            });
        }

        res.status(500).json({
            error: error.message || 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log('========================================');
    console.log('React Native Generator Backend');
    console.log('========================================');
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoint: http://localhost:${PORT}/api/messages`);
    console.log('========================================');

    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not found in environment variables!');
        console.warn('   Please create a .env file with your API key.');
    } else {
        console.log('✅ ANTHROPIC_API_KEY configured');
    }

    console.log('========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});
