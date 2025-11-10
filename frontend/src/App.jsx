// import React from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, useAuth } from './context/AuthContext'
// import Layout from './components/Layout'
// import Login from './pages/Login'

// // Admin Pages
// import AdminDashboard from './pages/Admin/Dashboard'
// import UserManagement from './pages/Admin/UserManagement'
// import LeadManagement from './pages/Admin/LeadManagement'
// import TaskManagement from './pages/Admin/TaskManagement'
// import Reports from './pages/Admin/Reports'

// // Manager Pages
// import ManagerDashboard from './pages/Manager/Dashboard'
// import TeamManagement from './pages/Manager/TeamManagement'
// import ManagerTasks from './pages/Manager/Tasks'
// import ManagerLeads from './pages/Manager/Leads'

// // Employee Pages
// import EmployeeDashboard from './pages/Employee/Dashboard'
// import EmployeeTasks from './pages/Employee/Tasks'
// import EmployeeAttendance from './pages/Employee/Attendance'

// // Telecaller Pages
// import TelecallerDashboard from './pages/Telecaller/Dashboard'
// import TelecallerLeads from './pages/Telecaller/Leads'

// // Common Pages
// import Chat from './pages/Chat'
// import Profile from './pages/Profile'

// const ProtectedRoute = ({ children, allowedRoles = [] }) => {
//   const { user } = useAuth()
  
//   if (!user) {
//     return <Navigate to="/login" />
//   }
  
//   if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
//     return <Navigate to="/" />
//   }
  
//   return children
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<Layout />}>
//           <Route index element={<DashboardRedirect />} />
          
//           {/* Admin Routes */}
//           <Route path="admin/dashboard" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="admin/users" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <UserManagement />
//             </ProtectedRoute>
//           } />
//           <Route path="admin/leads" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <LeadManagement />
//             </ProtectedRoute>
//           } />
//           <Route path="admin/tasks" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <TaskManagement />
//             </ProtectedRoute>
//           } />
//           <Route path="admin/reports" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <Reports />
//             </ProtectedRoute>
//           } />

//           {/* Manager Routes */}
//           <Route path="manager/dashboard" element={
//             <ProtectedRoute allowedRoles={['manager']}>
//               <ManagerDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="manager/team" element={
//             <ProtectedRoute allowedRoles={['manager']}>
//               <TeamManagement />
//             </ProtectedRoute>
//           } />
//           <Route path="manager/tasks" element={
//             <ProtectedRoute allowedRoles={['manager']}>
//               <ManagerTasks />
//             </ProtectedRoute>
//           } />
//           <Route path="manager/leads" element={
//             <ProtectedRoute allowedRoles={['manager']}>
//               <ManagerLeads />
//             </ProtectedRoute>
//           } />

//           {/* Employee Routes */}
//           <Route path="employee/dashboard" element={
//             <ProtectedRoute allowedRoles={['employee']}>
//               <EmployeeDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="employee/tasks" element={
//             <ProtectedRoute allowedRoles={['employee']}>
//               <EmployeeTasks />
//             </ProtectedRoute>
//           } />
//           <Route path="employee/attendance" element={
//             <ProtectedRoute allowedRoles={['employee']}>
//               <EmployeeAttendance />
//             </ProtectedRoute>
//           } />

//           {/* Telecaller Routes */}
//           <Route path="telecaller/dashboard" element={
//             <ProtectedRoute allowedRoles={['telecaller']}>
//               <TelecallerDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="telecaller/leads" element={
//             <ProtectedRoute allowedRoles={['telecaller']}>
//               <TelecallerLeads />
//             </ProtectedRoute>
//           } />

//           {/* Common Routes */}
//           <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
//           <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
//         </Route>
//       </Routes>
//     </AuthProvider>
//   )
// }

// function DashboardRedirect() {
//   const { user } = useAuth()
  
//   if (!user) return <Navigate to="/login" />
  
//   switch (user.role) {
//     case 'admin':
//       return <Navigate to="/admin/dashboard" />
//     case 'manager':
//       return <Navigate to="/manager/dashboard" />
//     case 'employee':
//       return <Navigate to="/employee/dashboard" />
//     case 'telecaller':
//       return <Navigate to="/telecaller/dashboard" />
//     default:
//       return <Navigate to="/login" />
//   }
// }

// export default App

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Loading from './components/Loading'

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard'
import UserManagement from './pages/Admin/UserManagement'
import LeadManagement from './pages/Admin/LeadManagement'
import TaskManagement from './pages/Admin/TaskManagement'
import Reports from './pages/Admin/Reports'

// Manager Pages
import ManagerDashboard from './pages/Manager/Dashboard'
import TeamManagement from './pages/Manager/TeamManagement'
import ManagerTasks from './pages/Manager/Tasks'
import ManagerLeads from './pages/Manager/Leads'

// Employee Pages
import EmployeeDashboard from './pages/Employee/Dashboard'
import EmployeeTasks from './pages/Employee/Tasks'
import EmployeeAttendance from './pages/Employee/Attendance'

// Telecaller Pages
import TelecallerDashboard from './pages/Telecaller/Dashboard'
import TelecallerLeads from './pages/Telecaller/Leads'

// Common Pages
import Chat from './pages/Chat'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Loading message="Checking authentication..." />
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }
  
  return children
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardRedirect />} />
          
          {/* Admin Routes */}
          <Route path="admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/leads" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LeadManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/tasks" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TaskManagement />
            </ProtectedRoute>
          } />
          <Route path="admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          } />

          {/* Manager Routes */}
          <Route path="manager/dashboard" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="manager/team" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <TeamManagement />
            </ProtectedRoute>
          } />
          <Route path="manager/tasks" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerTasks />
            </ProtectedRoute>
          } />
          <Route path="manager/leads" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerLeads />
            </ProtectedRoute>
          } />

          {/* Employee Routes */}
          <Route path="employee/dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="employee/tasks" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeTasks />
            </ProtectedRoute>
          } />
          <Route path="employee/attendance" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeAttendance />
            </ProtectedRoute>
          } />

          {/* Telecaller Routes */}
          <Route path="telecaller/dashboard" element={
            <ProtectedRoute allowedRoles={['telecaller']}>
              <TelecallerDashboard />
            </ProtectedRoute>
          } />
          <Route path="telecaller/leads" element={
            <ProtectedRoute allowedRoles={['telecaller']}>
              <TelecallerLeads />
            </ProtectedRoute>
          } />

          {/* Common Routes */}
          <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function DashboardRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <Loading message="Redirecting to dashboard..." />
  }
  
  if (!user) return <Navigate to="/login" />
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" />
    case 'manager':
      return <Navigate to="/manager/dashboard" />
    case 'employee':
      return <Navigate to="/employee/dashboard" />
    case 'telecaller':
      return <Navigate to="/telecaller/dashboard" />
    default:
      return <Navigate to="/login" />
  }
}

export default App