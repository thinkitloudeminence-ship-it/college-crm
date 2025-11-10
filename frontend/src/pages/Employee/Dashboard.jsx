// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Chip,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField
// } from '@mui/material'
// import { PlayArrow, Stop, FreeBreakfast, LunchDining } from '@mui/icons-material'
// import axios from 'axios'

// const EmployeeDashboard = () => {
//   const [attendance, setAttendance] = useState(null)
//   const [tasks, setTasks] = useState([])
//   const [breakDialogOpen, setBreakDialogOpen] = useState(false)
//   const [breakType, setBreakType] = useState('')

//   useEffect(() => {
//     fetchAttendance()
//     fetchTasks()
//   }, [])

//   const fetchAttendance = async () => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
//       const response = await axios.get(`/api/attendance/report?startDate=${today}&endDate=${today}`)
//       if (response.data.length > 0) {
//         setAttendance(response.data[0])
//       }
//     } catch (error) {
//       console.error('Error fetching attendance:', error)
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

//   const handleLogin = async () => {
//     try {
//       await axios.post('/api/attendance/login')
//       fetchAttendance()
//     } catch (error) {
//       console.error('Error logging in:', error)
//     }
//   }

//   const handleLogout = async () => {
//     try {
//       await axios.post('/api/attendance/logout')
//       fetchAttendance()
//     } catch (error) {
//       console.error('Error logging out:', error)
//     }
//   }

//   const handleBreakStart = async (type) => {
//     try {
//       await axios.post('/api/attendance/break', { breakType: type })
//       setBreakDialogOpen(false)
//       fetchAttendance()
//     } catch (error) {
//       console.error('Error starting break:', error)
//     }
//   }

//   const handleBreakEnd = async () => {
//     try {
//       await axios.post('/api/attendance/break/end')
//       fetchAttendance()
//     } catch (error) {
//       console.error('Error ending break:', error)
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'completed': return 'success'
//       case 'in_progress': return 'warning'
//       case 'pending': return 'default'
//       default: return 'default'
//     }
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom>
//         Employee Dashboard
//       </Typography>
      
//       <Grid container spacing={3}>
//         {/* Attendance Card */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               Attendance
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                 <Typography>Status:</Typography>
//                 <Chip 
//                   label={attendance?.status || 'Not Logged In'} 
//                   color={attendance ? 'success' : 'default'}
//                 />
//               </Box>
              
//               {attendance && (
//                 <>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography>Login Time:</Typography>
//                     <Typography>
//                       {new Date(attendance.loginTime).toLocaleTimeString()}
//                     </Typography>
//                   </Box>
//                   {attendance.lateBy > 0 && (
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography>Late By:</Typography>
//                       <Typography color="error">
//                         {attendance.lateBy} minutes
//                       </Typography>
//                     </Box>
//                   )}
//                 </>
//               )}

//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 {!attendance?.loginTime && (
//                   <Button 
//                     variant="contained" 
//                     startIcon={<PlayArrow />}
//                     onClick={handleLogin}
//                   >
//                     Login
//                   </Button>
//                 )}
//                 {attendance?.loginTime && !attendance?.logoutTime && (
//                   <Button 
//                     variant="outlined" 
//                     startIcon={<Stop />}
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </Button>
//                 )}
//               </Box>

//               {/* Break Controls */}
//               {attendance?.loginTime && !attendance?.logoutTime && (
//                 <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                   <Button
//                     variant="outlined"
//                     startIcon={<FreeBreakfast />}
//                     onClick={() => handleBreakStart('tea')}
//                   >
//                     Tea Break
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     startIcon={<LunchDining />}
//                     onClick={() => handleBreakStart('lunch')}
//                   >
//                     Lunch Break
//                   </Button>
//                   {attendance.breaks?.some(b => !b.endTime) && (
//                     <Button
//                       variant="contained"
//                       onClick={handleBreakEnd}
//                     >
//                       End Break
//                     </Button>
//                   )}
//                 </Box>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* Tasks */}
//         <Grid item xs={12} md={6}>
//           <Paper sx={{ p: 2 }}>
//             <Typography variant="h6" gutterBottom>
//               My Tasks
//             </Typography>
//             <List>
//               {tasks.slice(0, 5).map((task) => (
//                 <ListItem key={task._id} divider>
//                   <ListItemText
//                     primary={task.title}
//                     secondary={
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//                         <Typography variant="body2">
//                           Due: {new Date(task.dueDate).toLocaleDateString()}
//                         </Typography>
//                         <Chip 
//                           label={task.status} 
//                           size="small"
//                           color={getStatusColor(task.status)}
//                         />
//                       </Box>
//                     }
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default EmployeeDashboard

import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  PlayArrow,
  Stop,
  FreeBreakfast,
  LunchDining,
  MeetingRoom,
  Wash,
  Schedule
} from '@mui/icons-material'
import axios from 'axios'

const EmployeeDashboard = () => {
  const [attendance, setAttendance] = useState(null)
  const [tasks, setTasks] = useState([])
  const [breakDialogOpen, setBreakDialogOpen] = useState(false)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [breakType, setBreakType] = useState('')
  const [leaveData, setLeaveData] = useState({
    type: 'casual',
    hours: 4,
    reason: ''
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [attendanceResponse, tasksResponse] = await Promise.all([
        axios.get('/api/attendance/today'),
        axios.get('/api/tasks?limit=5')
      ])

      setAttendance(attendanceResponse.data)
      setTasks(tasksResponse.data)
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      await axios.post('/api/attendance/login')
      fetchDashboardData()
    } catch (error) {
      setError('Error logging in')
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/attendance/logout')
      fetchDashboardData()
    } catch (error) {
      setError('Error logging out')
    }
  }

  const handleBreakStart = async (type) => {
    try {
      await axios.post('/api/attendance/break/start', { breakType: type })
      setBreakDialogOpen(false)
      fetchDashboardData()
    } catch (error) {
      setError('Error starting break')
    }
  }

  const handleBreakEnd = async () => {
    try {
      await axios.post('/api/attendance/break/end')
      fetchDashboardData()
    } catch (error) {
      setError('Error ending break')
    }
  }

  const handleLeaveRequest = async () => {
    try {
      await axios.post('/api/attendance/leave', leaveData)
      setLeaveDialogOpen(false)
      fetchDashboardData()
    } catch (error) {
      setError('Error submitting leave request')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

  const hasActiveBreak = attendance?.breaks?.some(b => !b.endTime)

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
        Employee Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Attendance Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Today's Attendance
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">Status:</Typography>
                <Chip 
                  label={attendance?.status === 'present' ? 'Present' : 'Not Logged In'} 
                  color={attendance?.status === 'present' ? 'success' : 'default'}
                />
              </Box>
              
              {attendance?.loginTime && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Login Time:</Typography>
                    <Typography fontWeight="bold">
                      {new Date(attendance.loginTime).toLocaleTimeString()}
                    </Typography>
                  </Box>
                  
                  {attendance.lateBy > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Late By:</Typography>
                      <Typography color="error" fontWeight="bold">
                        {attendance.lateBy} minutes
                      </Typography>
                    </Box>
                  )}

                  {attendance.workingHours > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Working Hours:</Typography>
                      <Typography fontWeight="bold">
                        {Math.floor(attendance.workingHours / 60)}h {attendance.workingHours % 60}m
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {/* Attendance Actions */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {!attendance?.loginTime && (
                  <Button 
                    variant="contained" 
                    startIcon={<PlayArrow />}
                    onClick={handleLogin}
                    color="success"
                  >
                    Login
                  </Button>
                )}
                {attendance?.loginTime && !attendance?.logoutTime && (
                  <Button 
                    variant="outlined" 
                    startIcon={<Stop />}
                    onClick={handleLogout}
                    color="error"
                  >
                    Logout
                  </Button>
                )}
                <Button 
                  variant="outlined"
                  onClick={() => setLeaveDialogOpen(true)}
                  startIcon={<Schedule />}
                >
                  Half Day/Leave
                </Button>
              </Box>

              {/* Break Controls */}
              {attendance?.loginTime && !attendance?.logoutTime && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Break Management:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant={hasActiveBreak ? "contained" : "outlined"}
                      startIcon={<FreeBreakfast />}
                      onClick={hasActiveBreak ? handleBreakEnd : () => handleBreakStart('tea')}
                      color={hasActiveBreak ? "success" : "primary"}
                    >
                      {hasActiveBreak ? 'End Break' : 'Tea Break'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<LunchDining />}
                      onClick={() => handleBreakStart('lunch')}
                      disabled={hasActiveBreak}
                    >
                      Lunch
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MeetingRoom />}
                      onClick={() => handleBreakStart('meeting')}
                      disabled={hasActiveBreak}
                    >
                      Meeting
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Wash />}
                      onClick={() => handleBreakStart('washroom')}
                      disabled={hasActiveBreak}
                    >
                      Washroom
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Today's Breaks */}
              {attendance?.breaks && attendance.breaks.length > 0 && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Today's Breaks:
                  </Typography>
                  <List dense>
                    {attendance.breaks.map((breakItem, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${breakItem.type} - ${breakItem.duration || 'Active'} minutes`}
                          secondary={breakItem.startTime && new Date(breakItem.startTime).toLocaleTimeString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                My Tasks
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => window.location.href = '/employee/tasks'}
              >
                View All
              </Button>
            </Box>
            <List>
              {tasks.map((task) => (
                <ListItem key={task._id} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {task.title}
                        </Typography>
                        <Chip 
                          label={task.status} 
                          size="small"
                          color={getStatusColor(task.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {task.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="body2">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            Progress: {task.progress}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Leave Request Dialog */}
      <Dialog open={leaveDialogOpen} onClose={() => setLeaveDialogOpen(false)}>
        <DialogTitle>Request Half Day/Leave</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Type"
                value={leaveData.type}
                onChange={(e) => setLeaveData({ ...leaveData, type: e.target.value })}
              >
                <MenuItem value="casual">Casual Leave</MenuItem>
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="emergency">Emergency Leave</MenuItem>
                <MenuItem value="planned">Planned Leave</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Hours"
                value={leaveData.hours}
                onChange={(e) => setLeaveData({ ...leaveData, hours: e.target.value })}
              >
                <MenuItem value={2}>2 Hours</MenuItem>
                <MenuItem value={4}>4 Hours (Half Day)</MenuItem>
                <MenuItem value={8}>8 Hours (Full Day)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason"
                multiline
                rows={3}
                value={leaveData.reason}
                onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                placeholder="Please provide reason for leave..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLeaveRequest} variant="contained">
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmployeeDashboard