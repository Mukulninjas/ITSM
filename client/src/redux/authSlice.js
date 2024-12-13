import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  email: null,
  userId: null,
  name: null,
  role: null,
  employeeID: null,
  profileImage: null,
  permissions: [],
  isAuthenticated: false,
  loading: true,
};

const setTokenDetails = (state, token) => {
  const decodedToken = jwtDecode(token);
  state.token = token;
  state.permissions = decodedToken.permissions || [];
  state.email = decodedToken.email;
  state.userId = decodedToken.userId;
  state.name = decodedToken.name;
  state.role = decodedToken.role;
  state.profileImage = decodedToken.profileImage || null;
  state.employeeID = decodedToken.employeeID;
  state.isAuthenticated = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const token = action.payload;
      try {
        setTokenDetails(state, token);
        state.loading = false;
        localStorage.setItem('token', token);
      } catch (error) {
        console.error('Failed to decode token during login', error);
      }
    },
    logout(state) {
      Object.assign(state, {
        token: null,
        email: null,
        userId: null,
        name: null,
        role: null,
        employeeID: null,
        permissions: [],
        profileImage: null,
        isAuthenticated: false,
        loading: false,
      });
      localStorage.removeItem('token');
    },
    initializeAuth(state) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
          } else {
            setTokenDetails(state, token);
          }
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('token');
        }
      }
      state.loading = false;
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
