import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Shield,
    Lock,
    Users,
    Heart,
    Eye,
    AlertTriangle,
    CheckCircle2,
    Globe,
    Code,
    BookOpen,
    Scale,
    Sparkles,
    UserCheck,
    Database,
    FileCheck,
    Zap,
    Ban,
    Info,
    MessageSquare,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Brain
} from 'lucide-react';

export default function ResponsibilityPage() {
    const { theme, isDarkMode } = useOutletContext();
    const [expandedFaq, setExpandedFaq] = useState(null);

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    // Core Principles
    const principles = [
        {
            icon: Shield,
            title: "Data Privacy First",
            description: "We collect only essential information for authentication and service delivery. Your project data remains private and is never used to train AI models.",
            color: "blue"
        },
        {
            icon: Lock,
            title: "Secure by Design",
            description: "End-to-end encryption, JWT authentication, and industry-standard security practices protect your account and generated code.",
            color: "green"
        },
        {
            icon: Users,
            title: "User Control",
            description: "You own your generated code. Delete projects, export data, and manage your account at any time without restrictions.",
            color: "purple"
        },
        {
            icon: Heart,
            title: "Fair Access",
            description: "Credit-based system ensures equitable access. Monthly resets guarantee everyone gets resources to build their projects.",
            color: "red"
        },
        {
            icon: Eye,
            title: "Transparency",
            description: "Clear documentation on how AI generates code, what data we collect, and how the platform operates.",
            color: "yellow"
        },
        {
            icon: Scale,
            title: "Ethical AI Use",
            description: "Claude AI is used responsibly, with safeguards against generating harmful code or violating intellectual property.",
            color: "indigo"
        }
    ];

    // Privacy Commitments
    const privacyCommitments = [
        {
            title: "Minimal Data Collection",
            items: [
                "Google ID, name, email, and profile picture (via OAuth)",
                "Project descriptions and generated code (stored temporarily)",
                "Credit usage logs for fair resource allocation",
                "Session tokens for authentication (JWT, 24-hour expiry)"
            ]
        },
        {
            title: "What We DON'T Collect",
            items: [
                "No tracking of browsing behavior outside GenRAD",
                "No sale or sharing of personal data with third parties",
                "No use of your code to train AI models",
                "No storage of sensitive credentials or API keys"
            ]
        },
        {
            title: "Data Retention",
            items: [
                "Saved projects: Until you delete them",
                "Credit history: Current month + 12 months archive",
                "Session data: 24 hours maximum",
                "Account data: Until account deletion requested"
            ]
        },
        {
            title: "Your Rights",
            items: [
                "Access all your stored data at any time",
                "Export projects in standard formats (JSON, ZIP)",
                "Request complete account deletion",
                "Opt-out of optional features"
            ]
        }
    ];

    // Security Measures
    const securityMeasures = [
        {
            category: "Authentication",
            measures: [
                "Google OAuth 2.0 for secure, password-free login",
                "JWT tokens with 24-hour expiration",
                "No password storage or management required",
                "Automatic session timeout on inactivity"
            ],
            icon: UserCheck
        },
        {
            category: "Data Protection",
            measures: [
                "HTTPS encryption for all data in transit",
                "Database-level encryption at rest",
                "SQL injection prevention via parameterized queries",
                "Row-level locking for credit transactions"
            ],
            icon: Database
        },
        {
            category: "API Security",
            measures: [
                "Rate limiting to prevent abuse (1.5s between requests)",
                "API key protection via environment variables",
                "CORS policies restrict unauthorized access",
                "Request validation and sanitization"
            ],
            icon: Zap
        },
        {
            category: "Code Safety",
            measures: [
                "AI safeguards prevent malicious code generation",
                "No execution of generated code on servers",
                "Client-side ZIP creation (no server processing)",
                "Content validation before storage"
            ],
            icon: Code
        }
    ];

    // Responsible AI Use
    const aiGuidelines = [
        {
            title: "What GenRAD AI Will Do",
            icon: CheckCircle2,
            items: [
                "Generate functional, well-structured React and React Native code",
                "Follow modern best practices and coding standards",
                "Create production-ready project scaffolds",
                "Provide educational code with inline comments",
                "Respect intellectual property and licenses"
            ],
            positive: true
        },
        {
            title: "What GenRAD AI Won't Do",
            icon: Ban,
            items: [
                "Generate malicious code, exploits, or security vulnerabilities",
                "Create copyright-infringing content",
                "Produce code that violates privacy or ethical standards",
                "Generate code for illegal purposes",
                "Bypass security measures or create harmful applications"
            ],
            positive: false
        }
    ];

    // Fair Use Policy
    const fairUsePolicy = [
        {
            title: "Credit System",
            description: "5 free credits per month to ensure fair access for all users",
            details: [
                "Automatic reset on the 1st of each month",
                "One credit per project generation",
                "Unlimited project saves and downloads",
                "No hidden fees or surprise charges"
            ]
        },
        {
            title: "Acceptable Use",
            description: "GenRAD is designed for legitimate software development",
            details: [
                "Educational projects and learning",
                "Rapid prototyping and MVPs",
                "Personal and commercial applications",
                "Open-source contributions"
            ]
        },
        {
            title: "Prohibited Use",
            description: "Activities that harm others or violate laws are strictly forbidden",
            details: [
                "Generating malware, viruses, or exploits",
                "Creating fraudulent or deceptive applications",
                "Violating intellectual property rights",
                "Automated abuse or credit farming"
            ]
        }
    ];

    // Environmental Responsibility
    const environmentalCommitments = [
        "Efficient API usage reduces unnecessary AI compute",
        "Client-side processing minimizes server energy consumption",
        "Optimized database queries reduce resource waste",
        "Serverless architecture scales down during low usage"
    ];

    // FAQs
    const faqs = [
        {
            question: "Can Anthropic see my generated code?",
            answer: "When you use GenRAD, your prompt is sent to Anthropic's Claude API to generate code. Anthropic processes this data to provide the service but does not use your prompts or generated code to train future AI models. Refer to Anthropic's privacy policy for details on their data handling practices."
        },
        {
            question: "What happens to my saved projects?",
            answer: "Saved projects are stored in our secure MySQL database with encryption at rest. Only you can access your projects through your authenticated account. You can delete any project at any time, and it will be permanently removed from our servers within 24 hours."
        },
        {
            question: "Do you share data with third parties?",
            answer: "No. We only share the minimum data necessary with Google (for OAuth authentication) and Anthropic (for AI code generation). We never sell or share your personal information or project data with advertisers, data brokers, or other third parties."
        },
        {
            question: "How do I delete my account and data?",
            answer: "Contact us at the email provided below with your account deletion request. We will permanently delete all your data including saved projects, credit history, and account information within 30 days. Some anonymized usage statistics may be retained for service improvement."
        },
        {
            question: "Is the generated code safe to use?",
            answer: "GenRAD generates code based on best practices and modern standards. However, AI-generated code should always be reviewed before deployment. We recommend security audits, testing, and code review for production applications. GenRAD does not guarantee the code is bug-free or production-ready."
        },
        {
            question: "Can I use GenRAD for commercial projects?",
            answer: "Yes! You retain full ownership of all code generated through GenRAD. You can use it for personal projects, commercial applications, or even sell products built with GenRAD-generated code. The code is yours without restrictions or royalties."
        },
        {
            question: "What if the AI generates problematic code?",
            answer: "GenRAD includes safeguards to prevent generating harmful code. If you encounter issues, please report them immediately. We continuously improve our prompts and validation to ensure code quality and safety. You are responsible for reviewing and testing all generated code before use."
        },
        {
            question: "How is my credit usage tracked?",
            answer: "Every project generation deducts one credit, which is logged in our CreditHistory table with timestamps. You can view your remaining credits in your user profile. This system ensures fair resource allocation and prevents abuse while maintaining transparency."
        }
    ];

    // Contact Information
    const contactInfo = {
        email: "info@esolution.lk",
        researcher: "AKSD Dhananja (S23014525)",
        institution: "Wrexham University - MSc Computing",
        reportIssues: "info@esolution.lk"
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: {
                bg: isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50',
                border: isDarkMode ? 'border-blue-800' : 'border-blue-200',
                text: isDarkMode ? 'text-blue-400' : 'text-blue-600'
            },
            green: {
                bg: isDarkMode ? 'bg-green-900/20' : 'bg-green-50',
                border: isDarkMode ? 'border-green-800' : 'border-green-200',
                text: isDarkMode ? 'text-green-400' : 'text-green-600'
            },
            purple: {
                bg: isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50',
                border: isDarkMode ? 'border-purple-800' : 'border-purple-200',
                text: isDarkMode ? 'text-purple-400' : 'text-purple-600'
            },
            red: {
                bg: isDarkMode ? 'bg-red-900/20' : 'bg-red-50',
                border: isDarkMode ? 'border-red-800' : 'border-red-200',
                text: isDarkMode ? 'text-red-400' : 'text-red-600'
            },
            yellow: {
                bg: isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50',
                border: isDarkMode ? 'border-yellow-800' : 'border-yellow-200',
                text: isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            },
            indigo: {
                bg: isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50',
                border: isDarkMode ? 'border-indigo-800' : 'border-indigo-200',
                text: isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
            }
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} py-8`}>
            {/* Hero Section */}
            <div className="relative mb-12">
                <div className={`absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 blur-3xl`}></div>
                <div className="relative">
                    <div className="flex items-center justify-center mb-6">
                        <div className={`p-4 rounded-2xl ${theme.accentBg} border ${theme.accentBorder}`}>
                            <Shield className={`w-12 h-12 ${theme.accentText}`} />
                        </div>
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${theme.text}`}>
                        Responsibility & Ethics
                    </h1>

                    <p className={`max-w-3xl mx-auto text-center ${theme.textMuted} text-lg`}>
                        GenRAD is committed to responsible AI development, data privacy, and ethical software generation.
                        Your trust and security are our top priorities.
                    </p>
                </div>
            </div>

            {/* Core Principles */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Sparkles className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Our Core Principles</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {principles.map((principle, index) => {
                        const Icon = principle.icon;
                        const colorClasses = getColorClasses(principle.color);
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${colorClasses.border} ${colorClasses.bg} transition-all hover:shadow-lg`}
                            >
                                <div className={`p-3 rounded-lg ${colorClasses.bg} border ${colorClasses.border} w-fit mb-4`}>
                                    <Icon className={`w-6 h-6 ${colorClasses.text}`} />
                                </div>
                                <h3 className={`text-lg font-bold ${theme.text} mb-2`}>
                                    {principle.title}
                                </h3>
                                <p className={`text-sm ${theme.textMuted}`}>
                                    {principle.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Privacy Commitments */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Lock className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Privacy Commitments</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {privacyCommitments.map((commitment, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}
                        >
                            <h3 className={`text-lg font-bold ${theme.text} mb-4`}>
                                {commitment.title}
                            </h3>
                            <ul className="space-y-3">
                                {commitment.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className={`w-5 h-5 ${theme.accentText} flex-shrink-0 mt-0.5`} />
                                        <span className={`text-sm ${theme.textMuted}`}>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Security Measures */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Shield className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Security Measures</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {securityMeasures.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${theme.border} ${theme.hoverBg} transition-all`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${theme.accentBg}`}>
                                        <Icon className={`w-5 h-5 ${theme.accentText}`} />
                                    </div>
                                    <h3 className={`text-lg font-bold ${theme.text}`}>
                                        {section.category}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {section.measures.map((measure, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <ArrowRight className={`w-4 h-4 ${theme.accentText} flex-shrink-0 mt-1`} />
                                            <span className={`text-sm ${theme.textMuted}`}>{measure}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Responsible AI Use */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Brain className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Responsible AI Use</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiGuidelines.map((guideline, index) => {
                        const Icon = guideline.icon;
                        return (
                            <div
                                key={index}
                                className={`p-6 rounded-xl border ${guideline.positive
                                        ? (isDarkMode ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50')
                                        : (isDarkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50')
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Icon className={`w-6 h-6 ${guideline.positive
                                            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                            : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                        }`} />
                                    <h3 className={`text-lg font-bold ${theme.text}`}>
                                        {guideline.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {guideline.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <ArrowRight className={`w-4 h-4 ${guideline.positive
                                                    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                                                    : (isDarkMode ? 'text-red-400' : 'text-red-600')
                                                } flex-shrink-0 mt-1`} />
                                            <span className={`text-sm ${theme.textMuted}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Fair Use Policy */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Scale className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Fair Use Policy</h2>
                </div>
                <div className="space-y-6">
                    {fairUsePolicy.map((policy, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}
                        >
                            <h3 className={`text-lg font-bold ${theme.text} mb-2`}>
                                {policy.title}
                            </h3>
                            <p className={`text-sm ${theme.textMuted} mb-4`}>
                                {policy.description}
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {policy.details.map((detail, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <CheckCircle2 className={`w-4 h-4 ${theme.accentText} flex-shrink-0 mt-1`} />
                                        <span className={`text-sm ${theme.textMuted}`}>{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Environmental Responsibility */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Globe className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Environmental Responsibility</h2>
                </div>
                <p className={`${theme.textMuted} mb-6`}>
                    We recognize that AI computation has environmental impacts. GenRAD implements efficient practices to minimize our carbon footprint:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {environmentalCommitments.map((commitment, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 p-4 rounded-lg border ${theme.border} ${theme.hoverBg} transition-all`}
                        >
                            <CheckCircle2 className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'} flex-shrink-0 mt-0.5`} />
                            <span className={`text-sm ${theme.textMuted}`}>{commitment}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQs */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 mb-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Frequently Asked Questions</h2>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border ${theme.border} rounded-xl overflow-hidden`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className={`w-full p-6 text-left ${theme.hoverBg} transition-all flex items-center justify-between`}
                            >
                                <h3 className={`text-lg font-semibold ${theme.text} pr-4`}>
                                    {faq.question}
                                </h3>
                                {expandedFaq === index ? (
                                    <ChevronUp className={`w-5 h-5 ${theme.textMuted} flex-shrink-0`} />
                                ) : (
                                    <ChevronDown className={`w-5 h-5 ${theme.textMuted} flex-shrink-0`} />
                                )}
                            </button>
                            {expandedFaq === index && (
                                <div className={`px-6 pb-6 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact & Reporting */}
            <section className={`${theme.cardBg} rounded-2xl shadow-xl p-8 border ${theme.cardBorder}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Info className={`w-6 h-6 ${theme.accentText}`} />
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Contact & Reporting</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-xl border ${theme.border} ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>General Inquiries</h3>
                        <div className="space-y-3">
                            <div>
                                <p className={`text-xs ${theme.textMuted} uppercase mb-1`}>Support Email</p>
                                <a href={`mailto:${contactInfo.email}`} className={`text-sm ${theme.accentText} hover:underline`}>
                                    {contactInfo.email}
                                </a>
                            </div>
                            <div>
                                <p className={`text-xs ${theme.textMuted} uppercase mb-1`}>Researcher</p>
                                <p className={`text-sm ${theme.text}`}>{contactInfo.researcher}</p>
                            </div>
                            <div>
                                <p className={`text-xs ${theme.textMuted} uppercase mb-1`}>Institution</p>
                                <p className={`text-sm ${theme.text}`}>{contactInfo.institution}</p>
                            </div>
                        </div>
                    </div>
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'border-red-800 bg-red-900/20' : 'border-red-200 bg-red-50'}`}>
                        <h3 className={`text-lg font-bold ${theme.text} mb-4`}>Security Issues</h3>
                        <p className={`text-sm ${theme.textMuted} mb-4`}>
                            If you discover a security vulnerability or concerning AI behavior, please report it immediately:
                        </p>
                        <a
                            href={`mailto:${contactInfo.reportIssues}`}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${theme.accent} text-white font-medium ${theme.accentHover} transition-all`}
                        >
                            <AlertTriangle className="w-4 h-4" />
                            Report Security Issue
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <div className="text-center mt-12">
                <div className={`inline-flex items-center gap-2 px-6 py-3 ${theme.accentBg} rounded-full border ${theme.accentBorder}`}>
                    <FileCheck className={`w-4 h-4 ${theme.accentText}`} />
                    <span className={`text-sm ${theme.accentText} font-medium`}>
                        Last Updated: January 2025 • GenRAD MSc Dissertation Project
                    </span>
                </div>
            </div>
        </div>
    );
}