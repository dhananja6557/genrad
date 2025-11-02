// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const PROFILE_API_URL = 'http://localhost:3000/user/profile';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // CRITICAL: Tells Axios to send the session cookie from the browser
                const response = await axios.get(PROFILE_API_URL, {
                    withCredentials: true,
                });

                // If the backend returns 200, we're logged in
                setUser(response.data.user);
            } catch (error) {
                // If backend returns 401, we set user to null
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading, isLoggedIn: !!user };
};

export default useAuth;