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