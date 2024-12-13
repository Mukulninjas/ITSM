import { useEffect } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store.js';
import { initializeAuth } from './redux/authSlice.js';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import CreateTicket from './components/CreateTicket';
import ListTickets from './components/ListTickets';
import CreateUsers from './components/CreateUsers.jsx';
import ListUsers from './components/ListUsers.jsx';
import Profile from './pages/Profile.jsx';

function AppContent() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:email/:token" element={<ResetPasswordPage />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} >
        <Route path="/profile" element={
          <ProtectedRoute requiredPermissions={[]}>
            <Profile/>
          </ProtectedRoute>
        } />
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute requiredPermissions={['create_read_tickets']}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-tickets"
          element={
            <ProtectedRoute requiredPermissions={['create_read_tickets']}>
              <ListTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-users"
          element={
            <ProtectedRoute requiredPermissions={['manage_users']}>
              <CreateUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-users"
          element={
            <ProtectedRoute requiredPermissions={['manage_users']}>
              <ListUsers />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;