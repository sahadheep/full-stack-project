import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '../services/authService';
import storage from '../utils/storageService';
import reducer from './AuthReducer';

const AuthContext = createContext(null);

const initialState = { user: null, accessToken: null, refreshToken: null };

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const tokens = storage.getTokens();
    if (tokens?.access) {
      // If we have a valid access token, restore the session
      dispatch({ type: 'LOGIN', payload: { accessToken: tokens.access, user: tokens.user } });
    } else {
      // Try to refresh the token
      authService.refresh().then(res => {
        if (res.data) {
          const { accessToken, expiresIn, user } = res.data;
          dispatch({ type: 'LOGIN', payload: { accessToken, user } });
          storage.setTokens({ access: accessToken, user, expiresIn });
        }
      }).catch(() => storage.clearTokens());
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { accessToken, expiresIn, user } = res.data;
    storage.setTokens({ access: accessToken, user, expiresIn });
    dispatch({ type: 'LOGIN', payload: { accessToken, user } });
    return res;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    const { accessToken, expiresIn, user } = res.data;
    storage.setTokens({ access: accessToken, user, expiresIn });
    dispatch({ type: 'LOGIN', payload: { accessToken, user } });
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    storage.clearTokens();
    dispatch({ type: 'LOGOUT' });
  };

  return <AuthContext.Provider value={{ ...state, login, logout, register }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
