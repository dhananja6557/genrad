// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const PROFILE_API_URL = 'https://ai.esolution.lk:2508/user/profile';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Get token from storage
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(PROFILE_API_URL, {
                    // --- SEND THE TOKEN ---
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    // withCredentials: true, // <-- REMOVE THIS
                });

                setUser(response.data.user);
            } catch (error) {
                // If token is invalid, 401 error will be caught here
                setUser(null);
                localStorage.removeItem('jwtToken'); // Clean up invalid token
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, isLoggedIn: !!user };
};

export default useAuth;