import api from '../axios';

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};