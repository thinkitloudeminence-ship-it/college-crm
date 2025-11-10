// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow
// } from '@mui/material'
// import { People, Assignment, Add } from '@mui/icons-material'
// import axios from 'axios'

// const ManagerDashboard = () => {
//   const [teamMembers, setTeamMembers] = useState([])
//   const [tasks, setTasks] = useState([])

//   useEffect(() => {
//     fetchTeamData()
//     fetchTasks()
//   }, [])

//   const fetchTeamData = async () => {
//     try {
//       const response = await axios.get('/api/users')
//       setTeamMembers(response.data)
//     } catch (error) {
//       console.error('Error fetching team data:', error)
//     }
//   }

//   const fetchTasks = async () => {
//     try {
//       const response = await axios.get('/api/tasks')
//       setTasks(response.data)
//     } catch (error) {
//       console.error('Error fetching tasks:', error)
//     }
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Manager Dashboard
//       </Typography>
      
//       <Grid container spacing={3}>
//         {/* Team Overview */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//               <Typography variant="h6">
//                 Team Members
//               </Typography>
//               <Button startIcon={<Add />} variant="contained" size="small">
//                 Add Employee
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {teamMembers.map((member) => (
//                     <TableRow key={member._id}>
//                       <TableCell>{member.name}</TableCell>
//                       <TableCell>{member.email}</TableCell>
//                       <TableCell>
//                         <Box
//                           sx={{
//                             display: 'inline-block',
//                             width: 8,
//                             height: 8,
//                             borderRadius: '50%',
//                             bgcolor: member.isActive ? 'success.main' : 'grey.500',
//                             mr: 1
//                           }}
//                         />
//                         {member.isActive ? 'Active' : 'Inactive'}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Recent Tasks */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Tasks
//             </Typography>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Title</TableCell>
//                     <TableCell>Assigned To</TableCell>
//                     <TableCell>Status</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {tasks.slice(0, 5).map((task) => (
//                     <TableRow key={task._id}>
//                       <TableCell>{task.title}</TableCell>
//                       <TableCell>{task.assignedTo?.name}</TableCell>
//                       <TableCell>
//                         <Box
//                           sx={{
//                             display: 'inline-block',
//                             px: 1,
//                             py: 0.5,
//                             borderRadius: 1,
//                             bgcolor: 
//                               task.status === 'completed' ? 'success.light' :
//                               task.status === 'in_progress' ? 'warning.light' : 'grey.300',
//                             color: 'white',
//                             fontSize: '0.75rem'
//                           }}
//                         >
//                           {task.status}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         </Grid>

//         {/* Quick Stats */}
//         <Grid item xs={12} sm={4}>
//           <Card>
//             <CardContent>
//               <People color="primary" />
//               <Typography variant="h4" component="div">
//                 {teamMembers.length}
//               </Typography>
//               <Typography color="text.secondary">
//                 Team Members
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={4}>
//           <Card>
//             <CardContent>
//               <Assignment color="secondary" />
//               <Typography variant="h4" component="div">
//                 {tasks.length}
//               </Typography>
//               <Typography color="text.secondary">
//                 Total Tasks
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} sm={4}>
//           <Card>
//             <CardContent>
//               <Assignment color="success" />
//               <Typography variant="h4" component="div">
//                 {tasks.filter(t => t.status === 'completed').length}
//               </Typography>
//               <Typography color="text.secondary">
//                 Completed Tasks
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default ManagerDashboard


import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  People,
  Assignment,
  Leaderboard,
  TrendingUp
} from '@mui/icons-material'
import axios from 'axios'

const ManagerDashboard = () => {
  const [stats, setStats] = useState({})
  const [teamMembers, setTeamMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [reportResponse, teamResponse, tasksResponse] = await Promise.all([
        axios.get('/api/reports/dashboard'),
        axios.get('/api/users/team/members'),
        axios.get('/api/tasks?limit=5')
      ])

      setStats(reportResponse.data)
      setTeamMembers(teamResponse.data)
      setTasks(tasksResponse.data)
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
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
        Manager Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People />}
            title="Team Members"
            value={stats.users?.total || 0}
            subtitle={`${stats.users?.active || 0} active`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Leaderboard />}
            title="Team Leads"
            value={stats.leads?.total || 0}
            subtitle={`${stats.leads?.converted || 0} converted`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Assignment />}
            title="Team Tasks"
            value={stats.tasks?.total || 0}
            subtitle={`${stats.tasks?.completed || 0} completed`}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUp />}
            title="Performance"
            value={`${stats.leads?.conversionRate || 0}%`}
            subtitle="Lead Conversion"
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Team Members */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Team Members
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.location.href = '/manager/team'}
              >
                Manage Team
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: member.isActive ? 'success.main' : 'grey.500'
                            }}
                          />
                          <Typography variant="body2">
                            {member.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.role} 
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.isActive ? 'Active' : 'Inactive'} 
                          size="small"
                          color={member.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {member.lastLogin ? new Date(member.lastLogin).toLocaleDateString() : 'Never'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Tasks
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.location.href = '/manager/tasks'}
              >
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {task.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {task.assignedTo?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status} 
                          size="small"
                          color={
                            task.status === 'completed' ? 'success' :
                            task.status === 'in_progress' ? 'warning' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.location.href = '/manager/team'}
              >
                Add Team Member
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => window.location.href = '/manager/tasks'}
              >
                Assign Task
              </Button>
              <Button 
                variant="outlined" 
                color="info"
                onClick={() => window.location.href = '/manager/leads'}
              >
                View Leads Report
              </Button>
              <Button 
                variant="outlined" 
                color="success"
              >
                Generate Team Report
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ManagerDashboard