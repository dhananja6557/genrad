// src/ProjectHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Loader2,
    Trash2,
    FileDown,
    Calendar,
    Smartphone,
    Monitor,
    FolderTree,
    AlertCircle,
    History
} from 'lucide-react';

const API_BASE_URL = 'https://ai.esolution.lk:2508';

export default function ProjectHistoryPage() {
    const { theme, isDarkMode } = useOutletContext();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                navigate('/signin');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/projects/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProjects(response.data.projects);
        } catch (err) {
            console.error('Fetch projects error:', err);
            setError(err.response?.data?.error || 'Failed to load project history');
        } finally {
            setLoading(false);
        }
    };

    const handleViewProject = async (projectId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const project = response.data.project;

            // Navigate to generator page with project data
            navigate('/generator', {
                state: {
                    loadedProject: project
                }
            });
        } catch (err) {
            console.error('Load project error:', err);
            alert('Failed to load project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        setDeletingId(projectId);

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setProjects(projects.filter(p => p.id !== projectId));
        } catch (err) {
            console.error('Delete project error:', err);
            alert('Failed to delete project');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getProjectIcon = (projectType) => {
        return projectType === 'react-native' ? Smartphone : Monitor;
    };

    const getProjectTypeName = (projectType) => {
        return projectType === 'react-native' ? 'React Native' : 'React + Vite';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className={`w-12 h-12 animate-spin ${theme.accentText}`} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <History className={`w-10 h-10 ${theme.accentText}`} />
                    <h1 className={`text-4xl font-bold ${theme.text}`}>Project History</h1>
                </div>
                <p className={`${theme.textMuted} text-lg`}>
                    View and manage your saved projects
                </p>
            </div>

            {error && (
                <div className={`mb-6 p-4 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-xl flex items-start gap-3`}>
                    <AlertCircle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'} flex-shrink-0 mt-0.5`} />
                    <div>
                        <h4 className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'} mb-1`}>Error</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
                    </div>
                </div>
            )}

            {projects.length === 0 ? (
                <div className={`${theme.cardBg} rounded-2xl shadow-xl p-12 border ${theme.cardBorder} text-center`}>
                    <FolderTree className={`w-16 h-16 ${theme.textMuted} mx-auto mb-4 opacity-50`} />
                    <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>No saved projects yet</h3>
                    <p className={`${theme.textMuted} mb-6`}>
                        Generate and save your first project to see it here
                    </p>
                    <button
                        onClick={() => navigate('/generator')}
                        className={`${theme.accent} ${theme.accentHover} text-white px-6 py-3 rounded-lg font-medium transition-all`}
                    >
                        Create New Project
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const Icon = getProjectIcon(project.projectType);
                        const isDeleting = deletingId === project.id;

                        return (
                            <div
                                key={project.id}
                                className={`${theme.cardBg} rounded-xl shadow-lg border ${theme.cardBorder} overflow-hidden transition-all hover:shadow-xl`}
                            >
                                <div className={`p-6 border-b ${theme.border}`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-5 h-5 ${theme.accentText}`} />
                                            <span className={`text-xs font-medium ${theme.textMuted}`}>
                                                {getProjectTypeName(project.projectType)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            disabled={isDeleting}
                                            className={`p-1.5 rounded-lg ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'} transition-colors disabled:opacity-50`}
                                            title="Delete project"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    <h3 className={`text-lg font-bold ${theme.text} mb-2 truncate`}>
                                        {project.projectName}
                                    </h3>

                                    <p className={`text-sm ${theme.textMuted} line-clamp-2 mb-4`}>
                                        {project.prompt}
                                    </p>

                                    <div className="flex items-center gap-2 text-xs">
                                        <Calendar className={`w-3.5 h-3.5 ${theme.textMuted}`} />
                                        <span className={theme.textMuted}>
                                            {formatDate(project.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex gap-2">
                                    <button
                                        onClick={() => handleViewProject(project.id)}
                                        className={`flex-1 px-4 py-2 ${theme.accent} ${theme.accentHover} text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2`}
                                    >
                                        <FileDown className="w-4 h-4" />
                                        View & Download
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}