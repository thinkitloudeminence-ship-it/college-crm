// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   List,
//   ListItem,
//   ListItemText,
//   Button
// } from '@mui/material'
// import {
//   People,
//   Assignment,
//   Leaderboard,
//   Schedule
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalEmployees: 0,
//     activeEmployees: 0,
//     onLeave: 0,
//     totalLeads: 0,
//     convertedLeads: 0
//   })
//   const [recentActivities, setRecentActivities] = useState([])

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       // Fetch users
//       const usersResponse = await axios.get('/api/users')
//       const users = usersResponse.data

//       // Fetch leads
//       const leadsResponse = await axios.get('/api/leads')
//       const leads = leadsResponse.data

//       const totalEmployees = users.length
//       const activeEmployees = users.filter(user => user.isActive).length
//       const totalLeads = leads.length
//       const convertedLeads = leads.filter(lead => lead.status === 'converted').length

//       setStats({
//         totalEmployees,
//         activeEmployees,
//         onLeave: 0, // You'd need to implement leave tracking
//         totalLeads,
//         convertedLeads
//       })

//       // Set recent activities (mock data for now)
//       setRecentActivities([
//         { action: 'New user registered', time: '2 hours ago' },
//         { action: 'Lead converted', time: '4 hours ago' },
//         { action: 'Task completed', time: '6 hours ago' }
//       ])
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//     }
//   }

//   const StatCard = ({ icon, title, value, color }) => (
//     <Card>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           {icon}
//           <Typography variant="h6" sx={{ ml: 1 }}>
//             {title}
//           </Typography>
//         </Box>
//         <Typography variant="h4" component="div" color={color}>
//           {value}
//         </Typography>
//       </CardContent>
//     </Card>
//   )

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Admin Dashboard
//       </Typography>

//       <Grid container spacing={3}>
//         {/* Stats Cards */}
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People color="primary" />}
//             title="Total Employees"
//             value={stats.totalEmployees}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People color="success" />}
//             title="Active Now"
//             value={stats.activeEmployees}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Assignment color="warning" />}
//             title="On Leave"
//             value={stats.onLeave}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard color="info" />}
//             title="Leads Converted"
//             value={stats.convertedLeads}
//             color="info"
//           />
//         </Grid>

//         {/* Recent Activities */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Activities
//             </Typography>
//             <List>
//               {recentActivities.map((activity, index) => (
//                 <ListItem key={index} divider>
//                   <ListItemText
//                     primary={activity.action}
//                     secondary={activity.time}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               <Button variant="contained" color="primary">
//                 Create Manager
//               </Button>
//               <Button variant="contained" color="secondary">
//                 Upload Leads
//               </Button>
//               <Button variant="contained" color="info">
//                 Generate Reports
//               </Button>
//               <Button variant="contained" color="warning">
//                 View Attendance
//               </Button>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default AdminDashboard


// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   CircularProgress,
//   Alert
// } from '@mui/material'
// import {
//   People,
//   Assignment,
//   Leaderboard,
//   Schedule,
//   TrendingUp,
//   AccessTime
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [recentActivities, setRecentActivities] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, usersResponse, leadsResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/users'),
//         axios.get('/api/leads?status=converted&limit=5')
//       ])

//       const reportData = reportResponse.data
//       const users = usersResponse.data
//       const recentLeads = leadsResponse.data

//       setStats(reportData)

//       // Set recent activities
//       const activities = [
//         ...recentLeads.map(lead => ({
//           action: `Lead converted: ${lead.name}`,
//           time: new Date(lead.updatedAt).toLocaleDateString(),
//           type: 'lead'
//         })),
//         ...users.filter(u => u.isActive).map(user => ({
//           action: `${user.name} logged in`,
//           time: 'Today',
//           type: 'user'
//         }))
//       ].slice(0, 5)

//       setRecentActivities(activities)
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="h6">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Admin Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People />}
//             title="Total Employees"
//             value={stats.users?.total || 0}
//             subtitle={`${stats.users?.active || 0} active`}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             subtitle={`${stats.leads?.converted || 0} converted`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Assignment />}
//             title="Total Tasks"
//             value={stats.tasks?.total || 0}
//             subtitle={`${stats.tasks?.completed || 0} completed`}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<AccessTime />}
//             title="Present Today"
//             value={stats.attendance?.presentToday || 0}
//             subtitle={`${stats.attendance?.lateToday || 0} late`}
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Recent Activities */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Recent Activities
//               </Typography>
//               <Button variant="outlined" size="small">
//                 View All
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Activity</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Type</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentActivities.map((activity, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {activity.action}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary">
//                           {activity.time}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={activity.type} 
//                           size="small"
//                           color={activity.type === 'lead' ? 'success' : 'primary'}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 onClick={() => window.location.href = '/admin/users'}
//                 startIcon={<People />}
//               >
//                 Create Manager
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="secondary"
//                 onClick={() => window.location.href = '/admin/leads'}
//                 startIcon={<Leaderboard />}
//               >
//                 Upload Leads
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="info"
//                 onClick={() => window.location.href = '/admin/reports'}
//                 startIcon={<TrendingUp />}
//               >
//                 Generate Reports
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 color="warning"
//                 onClick={() => window.location.href = '/admin/tasks'}
//                 startIcon={<Assignment />}
//               >
//                 View Tasks
//               </Button>
//             </Box>
//           </Paper>

//           {/* Performance Metrics */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Performance Metrics
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Lead Conversion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="success.main">
//                   {stats.leads?.conversionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Task Completion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="primary.main">
//                   {stats.tasks?.completionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Active Telecallers</Typography>
//                 <Typography variant="body2" fontWeight="bold">
//                   {stats.users?.telecallers || 0}
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default AdminDashboard


// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem
// } from '@mui/material'
// import {
//   People,
//   Assignment,
//   Leaderboard,
//   Schedule,
//   TrendingUp,
//   AccessTime,
//   PersonAdd
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [recentActivities, setRecentActivities] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [telecallers, setTelecallers] = useState([])
//   const [unassignedLeads, setUnassignedLeads] = useState([])
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//     fetchTelecallers()
//     fetchUnassignedLeads()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, usersResponse, leadsResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/users'),
//         axios.get('/api/leads?status=converted&limit=5')
//       ])

//       const reportData = reportResponse.data
//       const users = usersResponse.data
//       const recentLeads = leadsResponse.data

//       setStats(reportData)

//       // Set recent activities
//       const activities = [
//         ...recentLeads.map(lead => ({
//           action: `Lead converted: ${lead.name}`,
//           time: new Date(lead.updatedAt).toLocaleDateString(),
//           type: 'lead'
//         })),
//         ...users.filter(u => u.isActive).map(user => ({
//           action: `${user.name} logged in`,
//           time: 'Today',
//           type: 'user'
//         }))
//       ].slice(0, 5)

//       setRecentActivities(activities)
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const fetchUnassignedLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads?status=new&assignedTo=null')
//       setUnassignedLeads(response.data)
//     } catch (error) {
//       console.error('Failed to fetch unassigned leads')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })

//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess('Leads assigned successfully!')
//       setTimeout(() => setSuccess(''), 3000)

//       // Refresh data
//       fetchDashboardData()
//       fetchUnassignedLeads()
//     } catch (error) {
//       setError('Failed to assign leads: ' + (error.response?.data?.message || error.message))
//     }
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="h6">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Admin Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People />}
//             title="Total Employees"
//             value={stats.users?.total || 0}
//             subtitle={`${stats.users?.active || 0} active`}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             subtitle={`${stats.leads?.converted || 0} converted`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Assignment />}
//             title="Total Tasks"
//             value={stats.tasks?.total || 0}
//             subtitle={`${stats.tasks?.completed || 0} completed`}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<AccessTime />}
//             title="Present Today"
//             value={stats.attendance?.presentToday || 0}
//             subtitle={`${stats.attendance?.lateToday || 0} late`}
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Recent Activities */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Recent Activities
//               </Typography>
//               <Button variant="outlined" size="small">
//                 View All
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Activity</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Type</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentActivities.map((activity, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {activity.action}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary">
//                           {activity.time}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={activity.type} 
//                           size="small"
//                           color={activity.type === 'lead' ? 'success' : 'primary'}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>

//           {/* Unassigned Leads Section */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Unassigned Leads ({unassignedLeads.length})
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 startIcon={<PersonAdd />}
//                 onClick={() => setAssignDialog(true)}
//                 disabled={unassignedLeads.length === 0}
//               >
//                 Assign to Telecaller
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Select</TableCell>
//                     <TableCell>Lead Name</TableCell>
//                     <TableCell>Contact</TableCell>
//                     <TableCell>Source</TableCell>
//                     <TableCell>Date</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {unassignedLeads.slice(0, 5).map((lead) => (
//                     <TableRow key={lead._id}>
//                       <TableCell>
//                         <input
//                           type="checkbox"
//                           checked={selectedLeads.includes(lead._id)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedLeads(prev => [...prev, lead._id])
//                             } else {
//                               setSelectedLeads(prev => prev.filter(id => id !== lead._id))
//                             }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">{lead.email}</Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.phone}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={lead.source} 
//                           size="small"
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {new Date(lead.createdAt).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {unassignedLeads.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={5} align="center">
//                         <Typography variant="body2" color="text.secondary">
//                           No unassigned leads
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 onClick={() => window.location.href = '/admin/users'}
//                 startIcon={<People />}
//               >
//                 Create Manager
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="secondary"
//                 onClick={() => window.location.href = '/admin/leads'}
//                 startIcon={<Leaderboard />}
//               >
//                 Upload Leads
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="info"
//                 onClick={() => window.location.href = '/admin/reports'}
//                 startIcon={<TrendingUp />}
//               >
//                 Generate Reports
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 color="warning"
//                 onClick={() => window.location.href = '/admin/tasks'}
//                 startIcon={<Assignment />}
//               >
//                 View Tasks
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="success"
//                 onClick={() => setAssignDialog(true)}
//                 startIcon={<PersonAdd />}
//                 disabled={unassignedLeads.length === 0}
//               >
//                 Assign Leads ({unassignedLeads.length})
//               </Button>
//             </Box>
//           </Paper>

//           {/* Performance Metrics */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Performance Metrics
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Lead Conversion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="success.main">
//                   {stats.leads?.conversionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Task Completion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="primary.main">
//                   {stats.tasks?.completionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Active Telecallers</Typography>
//                 <Typography variant="body2" fontWeight="bold">
//                   {stats.users?.telecallers || 0}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Unassigned Leads</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="warning.main">
//                   {unassignedLeads.length}
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>

//           {/* Telecaller Stats */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Telecaller Stats
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               {telecallers.slice(0, 3).map((telecaller) => (
//                 <Box key={telecaller._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography variant="body2">
//                     {telecaller.name}
//                   </Typography>
//                   <Chip 
//                     label={telecaller.assignedLeads || 0} 
//                     size="small"
//                     color="primary"
//                     variant="outlined"
//                   />
//                 </Box>
//               ))}
//               {telecallers.length > 3 && (
//                 <Typography variant="body2" color="text.secondary" align="center">
//                   +{telecallers.length - 3} more telecallers
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Assign Leads Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Assign Leads to Telecaller</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>

//           <TextField
//             fullWidth
//             select
//             label="Select Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//             sx={{ mb: 2 }}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId}) - {telecaller.assignedLeads || 0} leads
//               </MenuItem>
//             ))}
//           </TextField>

//           {selectedLeads.length > 0 && (
//             <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//               <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
//                 Selected Leads:
//               </Typography>
//               {unassignedLeads
//                 .filter(lead => selectedLeads.includes(lead._id))
//                 .slice(0, 3)
//                 .map(lead => (
//                   <Typography key={lead._id} variant="body2" color="text.secondary">
//                     • {lead.name} ({lead.email})
//                   </Typography>
//                 ))}
//               {selectedLeads.length > 3 && (
//                 <Typography variant="body2" color="text.secondary">
//                   • ...and {selectedLeads.length - 3} more
//                 </Typography>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller || selectedLeads.length === 0}
//           >
//             Assign {selectedLeads.length} Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default AdminDashboard


// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Chip,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Checkbox
// } from '@mui/material'
// import {
//   People,
//   Assignment,
//   Leaderboard,
//   Schedule,
//   TrendingUp,
//   AccessTime,
//   PersonAdd,
//   Refresh
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [recentActivities, setRecentActivities] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [telecallers, setTelecallers] = useState([])
//   const [unassignedLeads, setUnassignedLeads] = useState([])
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//     fetchTelecallers()
//     fetchUnassignedLeads()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, usersResponse, leadsResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/users'),
//         axios.get('/api/leads?status=converted&limit=5')
//       ])

//       const reportData = reportResponse.data
//       const users = usersResponse.data
//       const recentLeads = leadsResponse.data

//       setStats(reportData)

//       // Set recent activities
//       const activities = [
//         ...recentLeads.map(lead => ({
//           action: `Lead converted: ${lead.name}`,
//           time: new Date(lead.updatedAt).toLocaleDateString(),
//           type: 'lead'
//         })),
//         ...users.filter(u => u.isActive).map(user => ({
//           action: `${user.name} logged in`,
//           time: 'Today',
//           type: 'user'
//         }))
//       ].slice(0, 5)

//       setRecentActivities(activities)
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error)
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   // FIXED: Fetch unassigned leads correctly
//   const fetchUnassignedLeads = async () => {
//     try {
//       // Get leads with status 'new' and no assigned telecaller
//       const response = await axios.get('/api/leads?status=new')
//       const allLeads = response.data

//       // Filter leads that are not assigned to any telecaller
//       const unassigned = allLeads.filter(lead => !lead.assignedTo)
//       setUnassignedLeads(unassigned)
//     } catch (error) {
//       console.error('Failed to fetch unassigned leads:', error)
//       setUnassignedLeads([])
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })

//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess(`${selectedLeads.length} leads assigned successfully!`)
//       setTimeout(() => setSuccess(''), 3000)

//       // Refresh data
//       fetchDashboardData()
//       fetchUnassignedLeads()
//     } catch (error) {
//       setError('Failed to assign leads: ' + (error.response?.data?.message || error.message))
//     }
//   }

//   // Select all leads
//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       setSelectedLeads(unassignedLeads.map(lead => lead._id))
//     } else {
//       setSelectedLeads([])
//     }
//   }

//   // Refresh all data
//   const handleRefresh = () => {
//     fetchDashboardData()
//     fetchTelecallers()
//     fetchUnassignedLeads()
//     setSelectedLeads([])
//     setSuccess('Data refreshed successfully!')
//     setTimeout(() => setSuccess(''), 2000)
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="h6">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Admin Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People />}
//             title="Total Employees"
//             value={stats.users?.total || 0}
//             subtitle={`${stats.users?.active || 0} active`}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             subtitle={`${stats.leads?.converted || 0} converted`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Assignment />}
//             title="Unassigned Leads"
//             value={unassignedLeads.length}
//             subtitle="Need assignment"
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<AccessTime />}
//             title="Present Today"
//             value={stats.attendance?.presentToday || 0}
//             subtitle={`${stats.attendance?.lateToday || 0} late`}
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Recent Activities */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Recent Activities
//               </Typography>
//               <Button 
//                 variant="outlined" 
//                 size="small"
//                 startIcon={<Refresh />}
//                 onClick={handleRefresh}
//               >
//                 Refresh
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Activity</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Type</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentActivities.map((activity, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {activity.action}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary">
//                           {activity.time}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={activity.type} 
//                           size="small"
//                           color={activity.type === 'lead' ? 'success' : 'primary'}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>

//           {/* Unassigned Leads Section */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Unassigned Leads ({unassignedLeads.length})
//               </Typography>
//               <Box sx={{ display: 'flex', gap: 2 }}>
//                 <Button 
//                   variant="outlined"
//                   startIcon={<Refresh />}
//                   onClick={fetchUnassignedLeads}
//                 >
//                   Refresh
//                 </Button>
//                 <Button 
//                   variant="contained" 
//                   startIcon={<PersonAdd />}
//                   onClick={() => setAssignDialog(true)}
//                   disabled={unassignedLeads.length === 0 || selectedLeads.length === 0}
//                 >
//                   Assign Selected ({selectedLeads.length})
//                 </Button>
//               </Box>
//             </Box>

//             {unassignedLeads.length > 0 && (
//               <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Checkbox
//                   checked={selectedLeads.length === unassignedLeads.length}
//                   indeterminate={selectedLeads.length > 0 && selectedLeads.length < unassignedLeads.length}
//                   onChange={handleSelectAll}
//                 />
//                 <Typography variant="body2">
//                   Select All ({selectedLeads.length} selected)
//                 </Typography>
//               </Box>
//             )}

//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell padding="checkbox">

//                     </TableCell>
//                     <TableCell>Lead Name</TableCell>
//                     <TableCell>Contact</TableCell>
//                     <TableCell>Source</TableCell>
//                     <TableCell>Date</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {unassignedLeads.slice(0, 10).map((lead) => (
//                     <TableRow 
//                       key={lead._id}
//                       sx={{ 
//                         backgroundColor: selectedLeads.includes(lead._id) ? 'action.selected' : 'inherit',
//                         '&:hover': { backgroundColor: 'action.hover' }
//                       }}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={selectedLeads.includes(lead._id)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setSelectedLeads(prev => [...prev, lead._id])
//                             } else {
//                               setSelectedLeads(prev => prev.filter(id => id !== lead._id))
//                             }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                         {lead.college && (
//                           <Typography variant="caption" color="text.secondary">
//                             {lead.college}
//                           </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">{lead.email}</Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.phone}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={lead.source} 
//                           size="small"
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {new Date(lead.createdAt).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {unassignedLeads.length === 0 && (
//                     <TableRow>
//                       <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
//                         <Typography variant="body2" color="text.secondary">
//                           No unassigned leads available
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
//                           Upload leads from Lead Management page
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Button 
//                 variant="contained" 
//                 color="primary"
//                 onClick={() => window.location.href = '/admin/users'}
//                 startIcon={<People />}
//               >
//                 Create Manager
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="secondary"
//                 onClick={() => window.location.href = '/admin/leads'}
//                 startIcon={<Leaderboard />}
//               >
//                 Upload Leads
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="info"
//                 onClick={() => window.location.href = '/admin/reports'}
//                 startIcon={<TrendingUp />}
//               >
//                 Generate Reports
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 color="warning"
//                 onClick={() => window.location.href = '/admin/tasks'}
//                 startIcon={<Assignment />}
//               >
//                 View Tasks
//               </Button>
//               <Button 
//                 variant="contained" 
//                 color="success"
//                 onClick={() => setAssignDialog(true)}
//                 startIcon={<PersonAdd />}
//                 disabled={unassignedLeads.length === 0 || selectedLeads.length === 0}
//               >
//                 Assign Leads ({selectedLeads.length})
//               </Button>
//             </Box>
//           </Paper>

//           {/* Performance Metrics */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Performance Metrics
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Lead Conversion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="success.main">
//                   {stats.leads?.conversionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Task Completion Rate</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="primary.main">
//                   {stats.tasks?.completionRate || 0}%
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Active Telecallers</Typography>
//                 <Typography variant="body2" fontWeight="bold">
//                   {telecallers.length}
//                 </Typography>
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography variant="body2">Unassigned Leads</Typography>
//                 <Typography variant="body2" fontWeight="bold" color="warning.main">
//                   {unassignedLeads.length}
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>

//           {/* Telecaller Stats */}
//           <Paper sx={{ p: 3, mt: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Telecaller Stats
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               {telecallers.slice(0, 3).map((telecaller) => (
//                 <Box key={telecaller._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Typography variant="body2">
//                     {telecaller.name}
//                   </Typography>
//                   <Chip 
//                     label={telecaller.assignedLeads || 0} 
//                     size="small"
//                     color="primary"
//                     variant="outlined"
//                   />
//                 </Box>
//               ))}
//               {telecallers.length > 3 && (
//                 <Typography variant="body2" color="text.secondary" align="center">
//                   +{telecallers.length - 3} more telecallers
//                 </Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Assign Leads Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Assign Leads to Telecaller</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>

//           <TextField
//             fullWidth
//             select
//             label="Select Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//             sx={{ mb: 2 }}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId}) - {telecaller.assignedLeads || 0} leads
//               </MenuItem>
//             ))}
//           </TextField>

//           {selectedLeads.length > 0 && (
//             <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
//               <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
//                 Selected Leads ({selectedLeads.length}):
//               </Typography>
//               {unassignedLeads
//                 .filter(lead => selectedLeads.includes(lead._id))
//                 .slice(0, 3)
//                 .map(lead => (
//                   <Typography key={lead._id} variant="body2" color="text.secondary">
//                     • {lead.name} ({lead.email})
//                   </Typography>
//                 ))}
//               {selectedLeads.length > 3 && (
//                 <Typography variant="body2" color="text.secondary">
//                   • ...and {selectedLeads.length - 3} more
//                 </Typography>
//               )}
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller || selectedLeads.length === 0}
//           >
//             Assign {selectedLeads.length} Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default AdminDashboard


// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   CircularProgress,
//   Alert
// } from '@mui/material'
// import {
//   Leaderboard,
//   TrendingUp,
//   Forward,
//   People
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [forwardedStats, setForwardedStats] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, forwardedResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/reports/forwarded-stats')
//       ])

//       setStats(reportResponse.data)
//       setForwardedStats(forwardedResponse.data)
//     } catch (error) {
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="body2">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Admin Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People />}
//             title="Total Users"
//             value={stats.users?.total || 0}
//             subtitle={`${stats.users?.telecallers || 0} telecallers`}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             subtitle={`${stats.leads?.converted || 0} converted`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Forward />}
//             title="Forwarded Leads"
//             value={forwardedStats.totalForwarded || 0}
//             subtitle={`${forwardedStats.forwardedThisWeek || 0} this week`}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<TrendingUp />}
//             title="Conversion Rate"
//             value={`${stats.leads?.conversionRate || 0}%`}
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Top Forwarders */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Top Lead Forwarders
//             </Typography>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Telecaller</TableCell>
//                     <TableCell>Employee ID</TableCell>
//                     <TableCell>Leads Forwarded</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {forwardedStats.topForwarders?.map((forwarder, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Typography variant="body1" fontWeight="bold">
//                           {forwarder.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip 
//                           label={forwarder.employeeId} 
//                           size="small" 
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body1" color="primary">
//                           {forwarder.count}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {(!forwardedStats.topForwarders || forwardedStats.topForwarders.length === 0) && (
//                     <TableRow>
//                       <TableCell colSpan={3} align="center">
//                         <Typography variant="body2" color="text.secondary">
//                           No forwarding data available
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Forwarding Statistics */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Forwarding Statistics
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Total Forwarded Leads</Typography>
//                 <Chip label={forwardedStats.totalForwarded || 0} color="primary" />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Forwarded This Week</Typography>
//                 <Chip label={forwardedStats.forwardedThisWeek || 0} color="success" />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Forwarded This Month</Typography>
//                 <Chip label={forwardedStats.forwardedThisMonth || 0} color="warning" />
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default AdminDashboard


// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   CircularProgress,
//   Alert
// } from '@mui/material'
// import {
//   Leaderboard,
//   TrendingUp,
//   Forward,
//   People
// } from '@mui/icons-material'
// import axios from 'axios'

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [forwardedStats, setForwardedStats] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, forwardedResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/reports/forwarded-stats')
//       ])

//       setStats(reportResponse.data)
//       setForwardedStats(forwardedResponse.data)
//     } catch (error) {
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="body2">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Admin Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<People />}
//             title="Total Users"
//             value={stats.users?.total || 0}
//             subtitle={`${stats.users?.telecallers || 0} telecallers`}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             subtitle={`${stats.leads?.converted || 0} converted`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Forward />}
//             title="Forwarded Leads"
//             value={forwardedStats.totalForwarded || 0}
//             subtitle={`${forwardedStats.forwardedThisWeek || 0} this week`}
//             color="warning"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<TrendingUp />}
//             title="Conversion Rate"
//             value={`${stats.leads?.conversionRate || 0}%`}
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Top Forwarders */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Top Lead Forwarders
//             </Typography>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Telecaller</TableCell>
//                     <TableCell>Employee ID</TableCell>
//                     <TableCell>Leads Forwarded</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {forwardedStats.topForwarders?.map((forwarder, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         <Typography variant="body1" fontWeight="bold">
//                           {forwarder.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={forwarder.employeeId}
//                           size="small"
//                           variant="outlined"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body1" color="primary">
//                           {forwarder.count}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                   {(!forwardedStats.topForwarders || forwardedStats.topForwarders.length === 0) && (
//                     <TableRow>
//                       <TableCell colSpan={3} align="center">
//                         <Typography variant="body2" color="text.secondary">
//                           No forwarding data available
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Forwarding Statistics */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Forwarding Statistics
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Total Forwarded Leads</Typography>
//                 <Chip label={forwardedStats.totalForwarded || 0} color="primary" />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Forwarded This Week</Typography>
//                 <Chip label={forwardedStats.forwardedThisWeek || 0} color="success" />
//               </Box>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Typography variant="body1">Forwarded This Month</Typography>
//                 <Chip label={forwardedStats.forwardedThisMonth || 0} color="warning" />
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default AdminDashboard



import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Checkbox
} from '@mui/material'
import {
  People,
  Assignment,
  Leaderboard,
  Schedule,
  TrendingUp,
  AccessTime,
  PersonAdd,
  Refresh,
  Forward
} from '@mui/icons-material'
import axios from 'axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({})
  const [forwardedStats, setForwardedStats] = useState({})
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [assignDialog, setAssignDialog] = useState(false)
  const [telecallers, setTelecallers] = useState([])
  const [unassignedLeads, setUnassignedLeads] = useState([])
  const [selectedLeads, setSelectedLeads] = useState([])
  const [selectedTelecaller, setSelectedTelecaller] = useState('')

  useEffect(() => {
    fetchDashboardData()
    fetchTelecallers()
    fetchUnassignedLeads()
    fetchForwardedStats()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [usersResponse, leadsResponse] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/leads?status=converted&limit=5')
      ])

      const users = usersResponse.data
      const recentLeads = leadsResponse.data

      // Calculate stats manually
      const totalEmployees = users.length
      const activeEmployees = users.filter(user => user.isActive).length
      const telecallerCount = users.filter(user => 
        user.role === 'telecaller' || (user.role === 'employee' && user.department === 'telecalling')
      ).length
      
      // Get all leads for stats
      const allLeadsResponse = await axios.get('/api/leads')
      const allLeads = allLeadsResponse.data
      
      const totalLeads = allLeads.length
      const convertedLeads = allLeads.filter(lead => lead.status === 'converted').length
      const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0

      setStats({
        users: {
          total: totalEmployees,
          active: activeEmployees,
          telecallers: telecallerCount
        },
        leads: {
          total: totalLeads,
          converted: convertedLeads,
          conversionRate: conversionRate
        },
        attendance: {
          presentToday: activeEmployees,
          lateToday: 0
        }
      })

      // Set recent activities
      const activities = [
        ...recentLeads.map(lead => ({
          action: `Lead converted: ${lead.name}`,
          time: new Date(lead.updatedAt).toLocaleDateString(),
          type: 'lead'
        })),
        ...users.filter(u => u.isActive).slice(0, 2).map(user => ({
          action: `${user.name} logged in`,
          time: 'Today',
          type: 'user'
        }))
      ].slice(0, 5)

      setRecentActivities(activities)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchTelecallers = async () => {
    try {
      const response = await axios.get('/api/users?role=telecaller')
      setTelecallers(response.data)
    } catch (error) {
      console.error('Failed to fetch telecallers')
    }
  }

  const fetchUnassignedLeads = async () => {
    try {
      const response = await axios.get('/api/leads?status=new')
      const allLeads = response.data
      const unassigned = allLeads.filter(lead => !lead.assignedTo)
      setUnassignedLeads(unassigned)
    } catch (error) {
      console.error('Failed to fetch unassigned leads:', error)
      setUnassignedLeads([])
    }
  }

  const fetchForwardedStats = async () => {
    try {
      const response = await axios.get('/api/leads/stats/forwarded')
      setForwardedStats(response.data)
    } catch (error) {
      console.error('Failed to fetch forwarded stats:', error)
      setForwardedStats({
        totalForwarded: 0,
        forwardedThisWeek: 0,
        forwardedThisMonth: 0
      })
    }
  }

  const handleBulkAssign = async () => {
    if (!selectedTelecaller || selectedLeads.length === 0) {
      setError('Please select telecaller and at least one lead')
      return
    }

    try {
      await axios.post('/api/leads/bulk-assign', {
        leadIds: selectedLeads,
        telecallerId: selectedTelecaller
      })

      setAssignDialog(false)
      setSelectedLeads([])
      setSelectedTelecaller('')
      setSuccess(`${selectedLeads.length} leads assigned successfully!`)
      setTimeout(() => setSuccess(''), 3000)

      // Refresh data
      fetchDashboardData()
      fetchUnassignedLeads()
    } catch (error) {
      setError('Failed to assign leads: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedLeads(unassignedLeads.map(lead => lead._id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
    fetchTelecallers()
    fetchUnassignedLeads()
    fetchForwardedStats()
    setSelectedLeads([])
    setSuccess('Data refreshed successfully!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            title="Total Employees"
            value={stats.users?.total || 0}
            subtitle={`${stats.users?.active || 0} active`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Leaderboard />}
            title="Total Leads"
            value={stats.leads?.total || 0}
            subtitle={`${stats.leads?.converted || 0} converted`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Forward />}
            title="Forwarded Leads"
            value={forwardedStats.totalForwarded || 0}
            subtitle={`${forwardedStats.forwardedThisWeek || 0} this week`}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp />}
            title="Conversion Rate"
            value={`${stats.leads?.conversionRate || 0}%`}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities & Unassigned Leads */}
        <Grid item xs={12} md={8}>
          {/* Recent Activities */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Activities
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<Refresh />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Activity</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">
                          {activity.action}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={activity.type} 
                          size="small"
                          color={activity.type === 'lead' ? 'success' : 'primary'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No recent activities
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Unassigned Leads Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Unassigned Leads ({unassignedLeads.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={fetchUnassignedLeads}
                >
                  Refresh
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  onClick={() => setAssignDialog(true)}
                  disabled={unassignedLeads.length === 0 || selectedLeads.length === 0}
                >
                  Assign Selected ({selectedLeads.length})
                </Button>
              </Box>
            </Box>

            {unassignedLeads.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={selectedLeads.length === unassignedLeads.length}
                  indeterminate={selectedLeads.length > 0 && selectedLeads.length < unassignedLeads.length}
                  onChange={handleSelectAll}
                />
                <Typography variant="body2">
                  Select All ({selectedLeads.length} selected)
                </Typography>
              </Box>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox"></TableCell>
                    <TableCell>Lead Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unassignedLeads.slice(0, 10).map((lead) => (
                    <TableRow 
                      key={lead._id}
                      sx={{ 
                        backgroundColor: selectedLeads.includes(lead._id) ? 'action.selected' : 'inherit',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedLeads.includes(lead._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(prev => [...prev, lead._id])
                            } else {
                              setSelectedLeads(prev => prev.filter(id => id !== lead._id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {lead.name}
                        </Typography>
                        {lead.college && (
                          <Typography variant="caption" color="text.secondary">
                            {lead.college}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{lead.email}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={lead.source} 
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  {unassignedLeads.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          No unassigned leads available
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                          Upload leads from Lead Management page
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Sidebar - Quick Actions & Stats */}
        <Grid item xs={12} md={4}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.location.href = '/admin/users'}
                startIcon={<People />}
              >
                Manage Users
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => window.location.href = '/admin/leads'}
                startIcon={<Leaderboard />}
              >
                Upload Leads
              </Button>
              <Button 
                variant="contained" 
                color="info"
                onClick={() => window.location.href = '/admin/reports'}
                startIcon={<TrendingUp />}
              >
                Generate Reports
              </Button>
              <Button 
                variant="outlined" 
                color="warning"
                onClick={() => window.location.href = '/admin/tasks'}
                startIcon={<Assignment />}
              >
                View Tasks
              </Button>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => setAssignDialog(true)}
                startIcon={<PersonAdd />}
                disabled={unassignedLeads.length === 0 || selectedLeads.length === 0}
              >
                Assign Leads ({selectedLeads.length})
              </Button>
            </Box>
          </Paper>

          {/* Performance Metrics */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Performance Metrics
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Lead Conversion Rate</Typography>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  {stats.leads?.conversionRate || 0}%
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Active Telecallers</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {stats.users?.telecallers || 0}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Unassigned Leads</Typography>
                <Typography variant="body2" fontWeight="bold" color="warning.main">
                  {unassignedLeads.length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Forwarded Leads</Typography>
                <Typography variant="body2" fontWeight="bold" color="info.main">
                  {forwardedStats.totalForwarded || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Telecaller Stats */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Telecaller Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {telecallers.slice(0, 3).map((telecaller) => (
                <Box key={telecaller._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {telecaller.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {telecaller.employeeId}
                    </Typography>
                  </Box>
                  <Chip 
                    label={telecaller.assignedLeads || 0} 
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              ))}
              {telecallers.length > 3 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  +{telecallers.length - 3} more telecallers
                </Typography>
              )}
              {telecallers.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center">
                  No telecallers found
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Assign Leads Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Leads to Telecaller</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected {selectedLeads.length} leads for assignment
          </Typography>

          <TextField
            fullWidth
            select
            label="Select Telecaller"
            value={selectedTelecaller}
            onChange={(e) => setSelectedTelecaller(e.target.value)}
            sx={{ mb: 2 }}
          >
            {telecallers.map((telecaller) => (
              <MenuItem key={telecaller._id} value={telecaller._id}>
                {telecaller.name} ({telecaller.employeeId})
              </MenuItem>
            ))}
          </TextField>

          {selectedLeads.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                Selected Leads ({selectedLeads.length}):
              </Typography>
              {unassignedLeads
                .filter(lead => selectedLeads.includes(lead._id))
                .slice(0, 3)
                .map(lead => (
                  <Typography key={lead._id} variant="body2" color="text.secondary">
                    • {lead.name} ({lead.email})
                  </Typography>
                ))}
              {selectedLeads.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  • ...and {selectedLeads.length - 3} more
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleBulkAssign} 
            variant="contained"
            disabled={!selectedTelecaller || selectedLeads.length === 0}
          >
            Assign {selectedLeads.length} Leads
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AdminDashboard