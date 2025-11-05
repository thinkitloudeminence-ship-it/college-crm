import React from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material'
import {
  Dashboard,
  People,
  Phone,
  Upload,
  Assessment,
  School,
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Sidebar = ({ drawerWidth = 240, mobileOpen, onDrawerToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Admin menu items
  const adminMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Employees', icon: <People />, path: '/admin/employees' },
    { text: 'Leads', icon: <Phone />, path: '/admin/leads' },
    { text: 'Upload Leads', icon: <Upload />, path: '/admin/upload' },
    { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
  ]

  // Telecaller menu items
  const telecallerMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/telecaller/dashboard' },
    { text: 'My Leads', icon: <Phone />, path: '/telecaller/leads' },
    { text: 'Performance', icon: <Assessment />, path: '/telecaller/performance' },
  ]

  const menuItems = user?.role === 'admin' ? adminMenuItems : telecallerMenuItems

  const handleNavigation = (path) => {
    navigate(path)
    if (onDrawerToggle) {
      onDrawerToggle()
    }
  }

  const drawerContent = (
    <div>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <School color="primary" />
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            College CRM
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      
      {/* User Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Welcome back,
        </Typography>
        <Typography variant="body1" fontWeight="medium" noWrap>
          {user?.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.role === 'admin' ? 'Administrator' : 
           user?.designation ? user.designation.charAt(0).toUpperCase() + user.designation.slice(1) : 'Employee'}
        </Typography>
        {user?.employeeId && (
          <Typography variant="caption" color="primary" display="block">
            ID: {user.employeeId}
          </Typography>
        )}
      </Box>
      <Divider />

      {/* Navigation Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'white' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar