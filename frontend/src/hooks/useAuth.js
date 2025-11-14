// src/hooks/useAuth.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://ai.esolution.lk:2508';

// This hook manages the user's authentication state
export default function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setUser(null);
            setIsLoggedIn(false);
            setLoading(false);
            return;
        }

        try {
            // We set loading to true on refetch to ensure we get fresh data
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/user/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data.user);
            setIsLoggedIn(response.data.isLoggedIn);
        } catch (error) {
            console.error('Auth error:', error);
            localStorage.removeItem('jwtToken');
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Return the state AND the refetch function
    return { user, isLoggedIn, loading, refetchUser: fetchUser };
}