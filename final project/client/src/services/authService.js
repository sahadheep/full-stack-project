import api from '../utils/apiClient';

const register = (payload) => api.post('/auth/register', payload).then(res => res.data);
const login = (payload) => api.post('/auth/login', payload).then(res => res.data);
const refresh = () => api.post('/auth/refresh').then(res => res.data);
const logout = () => api.post('/auth/logout').then(res => res.data);

export default { register, login, refresh, logout };
