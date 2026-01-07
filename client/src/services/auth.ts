import API from './api';

export const login = (credentials: any) => API.post('/auth/login', credentials);
export const register = (data: any) => API.post('/auth/register', data);
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
};
