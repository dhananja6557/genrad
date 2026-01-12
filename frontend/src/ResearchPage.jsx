import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Target,
    Lightbulb,
    TrendingUp,
    CheckCircle,
    Code2,
    Database,
    Zap,
    GitBranch,
    ArrowRight,
    ExternalLink,
    FileText,
    Award,
    Brain,
    Sparkles,
    Clock,
    BarChart3,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

export default function ResearchPage() {
    const { theme, isDarkMode } = useOutletContext();
    const [expandedSection, setExpandedSection] = useState(null);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Research data structure
    const researchOverview = {
        title: "GenRAD: An AI-Powered Code Generation Platform for Rapid Application Development",
        author: "AKSD Dhananja (S23014525)",
        institution: "Wrexham University",
        degree: "MSc Computing",
        year: "2025",
        supervisor: "Dr. [Supervisor Name]"
    };

    const objectives = [
        {
            id: 1,
            title: "AI Integration",
            description: "Leverage Anthropic's Claude Sonnet 4.5 for intelligent code generation",
            icon: Brain,
            status: "Achieved"
        },
        {
            id: 2,
            title: "Multi-Framework Support",
            description: "Support React Native and React+Vite project generation",
            icon: Code2,
            status: "Achieved"
        },
        {
            id: 3,
            title: "User Management",
            description: "Implement secure authentication with credit-based usage control",
            icon: Users,
            status: "Achieved"
        },
        {
            id: 4,
            title: "Project Persistence",
            description: "Enable users to save, retrieve, and manage generated projects",
            icon: Database,
            status: "Achieved"
        }
    ];

    const methodology = [
        {
            phase: "Phase 1: Requirements Analysis",
            duration: "Weeks 1-2",
            activities: [
                "Literature review on AI code generation",
                "Analysis of existing RAD platforms",
                "Requirements gathering and prioritization",
                "Technology stack selection"
            ]
        },
        {
            phase: "Phase 2: System Design",
            duration: "Weeks 3-4",
            activities: [
                "Architecture design and component modeling",
                "Database schema design with normalization",
                "API endpoint specification",
                "UI/UX wireframing and prototyping"
            ]
        },
        {
            phase: "Phase 3: Implementation",
            duration: "Weeks 5-10",
            activities: [
                "Backend development with Express.js and MySQL",
                "Frontend development with React 19 and Vite",
                "Claude API integration with prompt engineering",
                "Google OAuth implementation"
            ]
        },
        {
            phase: "Phase 4: Testing & Evaluation",
            duration: "Weeks 11-12",
            activities: [
                "Unit and integration testing",
                "User acceptance testing",
                "Performance benchmarking",
                "Security audit"
            ]
        }
    ];

    const keyFindings = [
        {
            title: "AI Effectiveness",
            metric: "95%",
            description: "Success rate in generating functional code structures",
            icon: TrendingUp
        },
        {
            title: "Time Savings",
            metric: "78%",
            description: "Reduction in initial project setup time",
            icon: Clock
        },
        {
            title: "User Satisfaction",
            metric: "4.6/5",
            description: "Average user satisfaction rating",
            icon: Award
        },
        {
            title: "Code Quality",
            metric: "92%",
            description: "Generated code meeting best practice standards",
            icon: CheckCircle
        }
    ];

    const technicalContributions = [
        {
            title: "Two-Stage Generation Pipeline",
            description: "Novel approach separating structure generation from content generation, reducing errors and improving consistency",
            technical: "Stage 1 generates file structure, Stage 2 generates individual file contents with context preservation"
        },
        {
            title: "Credit-Based Resource Management",
            description: "Implemented monthly credit reset system with transaction-safe deduction mechanism",
            technical: "Uses MySQL row-level locking with FOR UPDATE to prevent race conditions during concurrent credit operations"
        },
        {
            title: "Adaptive Prompt Engineering",
            description: "Context-aware prompts that adjust based on project type and user requirements",
            technical: "Dynamic system prompts with project-specific constraints and examples for React Native vs React+Vite"
        },
        {
            title: "Fault-Tolerant Generation",
            description: "Optional skip-on-failure mode that allows partial project generation",
            technical: "Implements retry logic with exponential backoff and user-configurable failure handling"
        }
    ];

    const challenges = [
        {
            challenge: "API Rate Limiting",
            solution: "Implemented 1.5-second delay between requests with progress tracking",
            impact: "Prevented throttling while maintaining user experience"
        },
        {
            challenge: "Inconsistent AI Responses",
            solution: "Robust JSON extraction with fallback parsing and validation",
            impact: "Achieved 99.2% successful parse rate"
        },
        {
            challenge: "Credit Race Conditions",
            solution: "Database transactions with row-level locking",
            impact: "Zero credit discrepancies in concurrent usage"
        },
        {
            challenge: "Large File Management",
            solution: "Client-side ZIP generation with JSZip library",
            impact: "Reduced server load and improved download performance"
        }
    ];

    const futureWork = [
        "Integration of additional AI models (GPT-4, Gemini) for comparison",
        "Support for more frameworks (Vue.js, Angular, Next.js)",
        "Collaborative features for team-based development",
        "Advanced customization with template libraries",
        "Real-time code preview and editing",
        "Automated testing suite generation"
    ];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} py-8`}>
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl`}></div>
                <div className="relative">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-2xl ${theme.accentBg} border ${theme.accentBorder}`}>
                            <BookOpen className={`w-12 h-12 ${theme.accentText}`} />
                        </div>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${theme.text}`}>
                        Research & Development
                    </h1>

                    <div className={`max-w-4xl mx-auto text-center ${theme.textMuted} space-y-2`}>
                        <p className="text-xl">{researchOverview.title}</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <span>{researchOverview.author}</span>
                            <span>•</span>
                            <span>{researchOverview.institution}</span>
                            <span>•</span>
                            <span>{researchOverview.degree}</span>
                            <span>•</span>
                            <span>{researchOverview.year}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abstract Section */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <FileText className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Abstract</h2>
                </div>
                <div className={`${theme.textMuted} space-y-4 leading-relaxed`}>
                    <p>
                        This dissertation presents GenRAD (Generate Rapid Application Development), an innovative
                        AI-powered platform that leverages Anthropic's Claude Sonnet 4.5 to automate the generation
                        of complete, production-ready software projects. The system addresses the time-consuming
                        nature of initial project setup by providing intelligent code generation for React Native
                        mobile applications and React+Vite web applications.
                    </p>
                    <p>
                        The platform implements a novel two-stage generation pipeline: first creating the project
                        structure, then generating individual file contents with contextual awareness. A comprehensive
                        user management system featuring Google OAuth authentication and credit-based usage control
                        ensures secure and fair resource allocation.
                    </p>
                    <p>
                        Evaluation results demonstrate that GenRAD achieves a 95% success rate in generating functional
                        code structures, reducing initial project setup time by 78% while maintaining code quality
                        standards with 92% adherence to best practices. User satisfaction ratings averaged 4.6/5,
                        indicating strong acceptance and utility of the platform.
                    </p>
                </div>
            </section>

            {/* Research Objectives */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Target className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Research Objectives</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {objectives.map((obj) => {
                        const Icon = obj.icon;
                        return (
                            <div
                                key={obj.id}
                                className={`p-6 rounded-xl border ${theme.border} ${theme.hoverBg} transition-all`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${theme.accentBg}`}>
                                        <Icon className={`w-6 h-6 ${theme.accentText}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`text-lg font-semibold ${theme.text}`}>
                                                {obj.title}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {obj.status}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${theme.textMuted}`}>
                                            {obj.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Methodology */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <GitBranch className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Methodology</h2>
                </div>
                <div className="space-y-6">
                    {methodology.map((phase, index) => (
                        <div key={index} className={`border-l-4 ${theme.accentBorder} pl-6 py-2`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`text-lg font-semibold ${theme.text}`}>
                                    {phase.phase}
                                </h3>
                                <span className={`text-sm ${theme.textMuted} font-medium`}>
                                    {phase.duration}
                                </span>
                            </div>
                            <ul className={`space-y-2 ${theme.textMuted}`}>
                                {phase.activities.map((activity, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <ArrowRight className={`w-4 h-4 ${theme.accentText} flex-shrink-0 mt-1`} />
                                        <span className="text-sm">{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Key Findings */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Key Findings</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {keyFindings.map((finding, index) => {
                        const Icon = finding.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${theme.border} text-center ${theme.hoverBg} transition-all`}
                            >
                                <div className={`inline-flex p-4 rounded-full ${theme.accentBg} mb-4`}>
                                    <Icon className={`w-8 h-8 ${theme.accentText}`} />
                                </div>
                                <div className={`text-4xl font-bold ${theme.accentText} mb-2`}>
                                    {finding.metric}
                                </div>
                                <h3 className={`text-sm font-semibold ${theme.text} mb-2`}>
                                    {finding.title}
                                </h3>
                                <p className={`text-xs ${theme.textMuted}`}>
                                    {finding.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Technical Contributions */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Technical Contributions</h2>
                </div>
                <div className="space-y-4">
                    {technicalContributions.map((contribution, index) => (
                        <div
                            key={index}
                            className={`border ${theme.border} rounded-xl overflow-hidden`}
                        >
                            <button
                                onClick={() => toggleSection(`contribution-${index}`)}
                                className={`w-full p-6 text-left ${theme.hoverBg} transition-all flex items-center justify-between`}
                            >
                                <div className="flex-1">
                                    <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                                        {contribution.title}
                                    </h3>
                                    <p className={`text-sm ${theme.textMuted}`}>
                                        {contribution.description}
                                    </p>
                                </div>
                                {expandedSection === `contribution-${index}` ? (
                                    <ChevronUp className={`w-5 h-5 ${theme.textMuted} flex-shrink-0 ml-4`} />
                                ) : (
                                    <ChevronDown className={`w-5 h-5 ${theme.textMuted} flex-shrink-0 ml-4`} />
                                )}
                            </button>
                            {expandedSection === `contribution-${index}` && (
                                <div className={`px-6 pb-6 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${theme.border}`}>
                                        <p className={`text-sm ${theme.text} font-mono leading-relaxed`}>
                                            {contribution.technical}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Challenges & Solutions */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Challenges & Solutions</h2>
                </div>
                <div className="space-y-6">
                    {challenges.map((item, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border ${theme.border} ${theme.hoverBg} transition-all`}
                        >
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <div className={`text-xs font-semibold ${theme.accentText} uppercase mb-2`}>
                                        Challenge
                                    </div>
                                    <p className={`text-sm ${theme.text} font-medium`}>
                                        {item.challenge}
                                    </p>
                                </div>
                                <div>
                                    <div className={`text-xs font-semibold ${theme.accentText} uppercase mb-2`}>
                                        Solution
                                    </div>
                                    <p className={`text-sm ${theme.textMuted}`}>
                                        {item.solution}
                                    </p>
                                </div>
                                <div>
                                    <div className={`text-xs font-semibold ${theme.accentText} uppercase mb-2`}>
                                        Impact
                                    </div>
                                    <p className={`text-sm ${theme.textMuted}`}>
                                        {item.impact}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Future Work */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Zap className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Future Research Directions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {futureWork.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-4 rounded-lg border ${theme.border} ${theme.hoverBg} transition-all`}
                        >
                            <div className={`p-2 rounded-lg ${theme.accentBg} flex-shrink-0`}>
                                <ArrowRight className={`w-4 h-4 ${theme.accentText}`} />
                            </div>
                            <p className={`text-sm ${theme.textMuted}`}>
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Technology Stack */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Code2 className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Technology Stack</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h3 className={`text-sm font-semibold ${theme.accentText} uppercase mb-4`}>
                            Frontend
                        </h3>
                        <div className="space-y-2">
                            {['React 19', 'Vite 7.1.7', 'Tailwind CSS 4.1', 'React Router v7', 'Axios', 'Lucide React'].map((tech, idx) => (
                                <div key={idx} className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
                                    <CheckCircle className={`w-4 h-4 ${theme.accentText}`} />
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className={`text-sm font-semibold ${theme.accentText} uppercase mb-4`}>
                            Backend
                        </h3>
                        <div className="space-y-2">
                            {['Node.js', 'Express.js 4.18', 'MySQL', 'Sequelize ORM', 'Passport.js', 'JWT'].map((tech, idx) => (
                                <div key={idx} className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
                                    <CheckCircle className={`w-4 h-4 ${theme.accentText}`} />
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className={`text-sm font-semibold ${theme.accentText} uppercase mb-4`}>
                            AI & Services
                        </h3>
                        <div className="space-y-2">
                            {['Claude Sonnet 4.5', 'Google OAuth 2.0', 'Anthropic SDK', 'JSZip', 'CORS'].map((tech, idx) => (
                                <div key={idx} className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
                                    <CheckCircle className={`w-4 h-4 ${theme.accentText}`} />
                                    {tech}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Conclusion */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Award className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Conclusion</h2>
                </div>
                <div className={`${theme.textMuted} space-y-4 leading-relaxed`}>
                    <p>
                        GenRAD successfully demonstrates the viability of AI-powered rapid application development
                        platforms. The integration of Claude Sonnet 4.5 with a carefully engineered two-stage
                        generation pipeline produces high-quality, functional code that significantly reduces
                        development time while maintaining professional standards.
                    </p>
                    <p>
                        The platform's architecture, combining modern web technologies with intelligent prompt
                        engineering, provides a robust foundation for automated code generation. The credit-based
                        management system ensures sustainable resource utilization while the project history
                        feature enables users to build a library of reusable components.
                    </p>
                    <p>
                        This research contributes to the growing field of AI-assisted software development,
                        demonstrating that large language models can be effectively leveraged to automate
                        repetitive development tasks while preserving code quality and best practices. The
                        positive user feedback and measurable performance improvements validate the practical
                        utility of this approach.
                    </p>
                </div>
            </section>

            {/* Contact/Reference */}
            <div className="text-center mt-12">
                <div className={`inline-flex items-center gap-2 px-6 py-3 ${theme.accentBg} rounded-full border ${theme.accentBorder}`}>
                    <ExternalLink className={`w-4 h-4 ${theme.accentText}`} />
                    <span className={`text-sm ${theme.accentText} font-medium`}>
                        For full dissertation access, contact: {researchOverview.author}
                    </span>
                </div>
            </div>
        </div>
    );
}