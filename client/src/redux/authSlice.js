import { createSlice } from '@reduxjs/toolkit';
import {jwtDecode} from 'jwt-decode';

const initialState = {
  token: null,
  permissions: [],
  isAuthenticated: false,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const token = action.payload;
      const decodedToken = jwtDecode(token);
      state.token = token;
      state.permissions = decodedToken.permissions || [];
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('token', token);
    },
    logout(state) {
      state.token = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('token');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            state.loading = false;
          } else {
            state.token = token;
            state.permissions = decodedToken.permissions || [];
            state.isAuthenticated = true;
            state.loading = false;
          }
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('token');
          state.loading = false;
        }
      } else {
        state.loading = false;
      }
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;

export default authSlice.reducer;
