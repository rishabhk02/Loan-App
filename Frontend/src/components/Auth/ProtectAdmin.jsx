import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../../AxiosConfig';

const ProtectAdmin = ({ Component }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const checkToken = async () => {
        try {
            const response = await Instance.get('/auth/validateToken',{
                headers: {
                    Authorization: `Bearer ${loggedInUser.token}`
                }
            });
            if(response?.data?.role === 'ADMIN') {
                setIsAuthenticated(true);
            }else{
                navigate('/');
            }
        } catch (error) {
            console.error(error);
            navigate('/');
        }
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <>
            {isAuthenticated && <Component />}
        </>
    )
}

export default ProtectAdmin;