import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';

// Components
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import TelecallerLayout from './components/layout/TelecallerLayout';

// Pages
import Login from './pages/auth/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import EmployeeManagement from './pages/admin/EmployeeManagement';
// import LeadManagement from './pages/admin/LeadManagement';
import LeadManagement from './components/admin/LeadManagement';
// Telecaller Pages
import TelecallerDashboard from './pages/telecaller/Dashboard';
import MyLeads from './pages/telecaller/MyLeads';
import CallInterface from './pages/telecaller/CallInterface';

function App() {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/telecaller/dashboard'} />} 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="leads" element={<LeadManagement />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Telecaller Routes */}
        <Route 
          path="/telecaller/*" 
          element={
            <ProtectedRoute allowedRoles={['telecaller']}>
              <TelecallerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TelecallerDashboard />} />
          <Route path="leads" element={<MyLeads />} />
          <Route path="call/:leadId" element={<CallInterface />} />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/telecaller/dashboard') : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;