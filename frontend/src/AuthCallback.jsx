import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Store the token
            localStorage.setItem('jwtToken', token);
            // 2. Redirect to the generator (URL is now clean)
            navigate('/generator', { replace: true });
        } else {
            // No token found, go to signin
            navigate('/signin', { replace: true });
        }
    }, [searchParams, navigate]);

    // You can render a loading spinner here
    return <div>Logging you in...</div>;
};

export default AuthCallback;