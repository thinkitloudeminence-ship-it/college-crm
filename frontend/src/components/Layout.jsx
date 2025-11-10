// import React, { useState } from 'react'
// import { Outlet, useNavigate, useLocation } from 'react-router-dom'
// import {
//   AppBar,
//   Box,
//   CssBaseline,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Typography,
//   Menu,
//   MenuItem,
//   Avatar,
//   Badge,
//   Chip
// } from '@mui/material'
// import {
//   Menu as MenuIcon,
//   Dashboard,
//   People,
//   Assignment,
//   Leaderboard,
//   Chat as ChatIcon,
//   Logout,
//   Person,
//   Report,
//   Group
// } from '@mui/icons-material'
// import { useAuth } from '../context/AuthContext'

// const drawerWidth = 260

// const Layout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [anchorEl, setAnchorEl] = useState(null)
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen)
//   }

//   const handleMenu = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleClose = () => {
//     setAnchorEl(null)
//   }

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const getMenuItems = () => {
//     const baseItems = [
//       { text: 'Dashboard', icon: <Dashboard />, path: `/${user?.role}/dashboard` },
//       { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
//       { text: 'Profile', icon: <Person />, path: '/profile' }
//     ]

//     if (user?.role === 'admin') {
//       return [
//         ...baseItems,
//         { text: 'User Management', icon: <People />, path: '/admin/users' },
//         { text: 'Lead Management', icon: <Leaderboard />, path: '/admin/leads' },
//         { text: 'Task Management', icon: <Assignment />, path: '/admin/tasks' },
//         { text: 'Reports', icon: <Report />, path: '/admin/reports' }
//       ]
//     } else if (user?.role === 'manager') {
//       return [
//         ...baseItems,
//         { text: 'Team Management', icon: <Group />, path: '/manager/team' },
//         { text: 'Tasks', icon: <Assignment />, path: '/manager/tasks' },
//         { text: 'Leads Overview', icon: <Leaderboard />, path: '/manager/leads' }
//       ]
//     } else if (user?.role === 'employee') {
//       return [
//         ...baseItems,
//         { text: 'My Tasks', icon: <Assignment />, path: '/employee/tasks' },
//         { text: 'Attendance', icon: <Assignment />, path: '/employee/attendance' }
//       ]
//     } else if (user?.role === 'telecaller') {
//       return [
//         ...baseItems,
//         { text: 'Leads', icon: <Leaderboard />, path: '/telecaller/leads' },
//         { text: 'Dashboard', icon: <Dashboard />, path: '/telecaller/dashboard' }
//       ]
//     }

//     return baseItems
//   }

//   const drawer = (
//     <div>
//       <Toolbar sx={{ 
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         color: 'white'
//       }}>
//         <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
//           CRM System
//         </Typography>
//       </Toolbar>
//       <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
//         <Chip 
//           label={user?.role?.toUpperCase()} 
//           color="primary" 
//           size="small"
//           sx={{ mb: 1 }}
//         />
//         <Typography variant="body2" color="text.secondary">
//           {user?.name}
//         </Typography>
//         <Typography variant="caption" color="text.secondary">
//           {user?.employeeId}
//         </Typography>
//       </Box>
//       <List>
//         {getMenuItems().map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton 
//               onClick={() => navigate(item.path)}
//               selected={location.pathname === item.path}
//               sx={{
//                 '&.Mui-selected': {
//                   backgroundColor: 'primary.main',
//                   color: 'white',
//                   '& .MuiListItemIcon-root': {
//                     color: 'white',
//                   },
//                 },
//                 '&.Mui-selected:hover': {
//                   backgroundColor: 'primary.dark',
//                 },
//               }}
//             >
//               <ListItemIcon sx={{ 
//                 color: location.pathname === item.path ? 'white' : 'inherit' 
//               }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.text} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   )

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         }}
//       >
//         <Toolbar>
//           <IconButton
//             color="inherit"
//             aria-label="open drawer"
//             edge="start"
//             onClick={handleDrawerToggle}
//             sx={{ mr: 2, display: { sm: 'none' } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//             {user?.department?.toUpperCase()} - {user?.role?.toUpperCase()} Portal
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Chip 
//               label={user?.isActive ? 'Online' : 'Offline'} 
//               color={user?.isActive ? 'success' : 'default'}
//               size="small"
//               variant="outlined"
//               sx={{ color: 'white', borderColor: 'white' }}
//             />
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleMenu}
//               color="inherit"
//             >
//               <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#667eea' }}>
//                 {user?.name?.charAt(0).toUpperCase()}
//               </Avatar>
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorEl}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//             >
//               <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
//                 <ListItemIcon>
//                   <Person fontSize="small" />
//                 </ListItemIcon>
//                 Profile
//               </MenuItem>
//               <MenuItem onClick={handleLogout}>
//                 <ListItemIcon>
//                   <Logout fontSize="small" />
//                 </ListItemIcon>
//                 Logout
//               </MenuItem>
//             </Menu>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//       >
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>
//       <Box
//         component="main"
//         sx={{ 
//           flexGrow: 1, 
//           p: 3, 
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           background: '#f5f5f5',
//           minHeight: '100vh'
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   )
// }

// export default Layout

import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Chip
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Assignment,
  Leaderboard,
  Chat as ChatIcon,
  Logout,
  Person,
  Report,
  Group
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const drawerWidth = 260

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getMenuItems = () => {
    const baseItems = [
      { 
        text: 'Dashboard', 
        icon: <Dashboard />, 
        path: `/${user?.role}/dashboard`,
        key: 'main-dashboard' // Unique key
      },
      { 
        text: 'Chat', 
        icon: <ChatIcon />, 
        path: '/chat',
        key: 'chat'
      },
      { 
        text: 'Profile', 
        icon: <Person />, 
        path: '/profile',
        key: 'profile'
      }
    ]

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { 
          text: 'User Management', 
          icon: <People />, 
          path: '/admin/users',
          key: 'admin-users'
        },
        { 
          text: 'Lead Management', 
          icon: <Leaderboard />, 
          path: '/admin/leads',
          key: 'admin-leads'
        },
        { 
          text: 'Task Management', 
          icon: <Assignment />, 
          path: '/admin/tasks',
          key: 'admin-tasks'
        },
        { 
          text: 'Reports', 
          icon: <Report />, 
          path: '/admin/reports',
          key: 'admin-reports'
        }
      ]
    } else if (user?.role === 'manager') {
      return [
        ...baseItems,
        { 
          text: 'Team Management', 
          icon: <Group />, 
          path: '/manager/team',
          key: 'manager-team'
        },
        { 
          text: 'Tasks', 
          icon: <Assignment />, 
          path: '/manager/tasks',
          key: 'manager-tasks'
        },
        { 
          text: 'Leads Overview', 
          icon: <Leaderboard />, 
          path: '/manager/leads',
          key: 'manager-leads'
        }
      ]
    } else if (user?.role === 'employee') {
      return [
        ...baseItems,
        { 
          text: 'My Tasks', 
          icon: <Assignment />, 
          path: '/employee/tasks',
          key: 'employee-tasks'
        },
        { 
          text: 'Attendance', 
          icon: <Assignment />, 
          path: '/employee/attendance',
          key: 'employee-attendance'
        }
      ]
    } else if (user?.role === 'telecaller') {
      return [
        ...baseItems,
        { 
          text: 'Leads', 
          icon: <Leaderboard />, 
          path: '/telecaller/leads',
          key: 'telecaller-leads'
        },
        { 
          text: 'Performance', 
          icon: <Dashboard />, 
          path: '/telecaller/dashboard',
          key: 'telecaller-dashboard'
        }
      ]
    }

    return baseItems
  }

  const drawer = (
    <div>
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          CRM System
        </Typography>
      </Toolbar>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Chip 
          label={user?.role?.toUpperCase()} 
          color="primary" 
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.employeeId}
        </Typography>
      </Box>
      <List>
        {getMenuItems().map((item) => (
          <ListItem key={item.key} disablePadding> {/* Use unique key here */}
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path ? 'white' : 'inherit' 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.department?.toUpperCase()} - {user?.role?.toUpperCase()} Portal
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={user?.isActive ? 'Online' : 'Offline'} 
              color={user?.isActive ? 'success' : 'default'}
              size="small"
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'white', color: '#667eea' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout