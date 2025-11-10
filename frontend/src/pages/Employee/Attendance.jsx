import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  AccessTime,
  Schedule,
  TrendingUp
} from '@mui/icons-material'
import axios from 'axios'

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAttendance()
  }, [])

  const fetchAttendance = async () => {
    try {
      // Get last 30 days attendance
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      
      const response = await axios.get(
        `/api/attendance/report?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
      )
      setAttendance(response.data.attendance)
    } catch (error) {
      setError('Failed to fetch attendance data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success'
      case 'half_day': return 'warning'
      case 'absent': return 'error'
      default: return 'default'
    }
  }

  const calculateStats = () => {
    const present = attendance.filter(a => a.status === 'present').length
    const halfDays = attendance.filter(a => a.status === 'half_day').length
    const absent = attendance.filter(a => a.status === 'absent').length
    const totalDays = attendance.length
    
    return {
      present,
      halfDays,
      absent,
      totalDays,
      attendanceRate: totalDays > 0 ? ((present + halfDays * 0.5) / totalDays * 100).toFixed(1) : 0
    }
  }

  const stats = calculateStats()

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
        My Attendance
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <AccessTime color="success" />
              <Typography variant="h4" component="div" color="success.main">
                {stats.present}
              </Typography>
              <Typography color="text.secondary">
                Present Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Schedule color="warning" />
              <Typography variant="h4" component="div" color="warning.main">
                {stats.halfDays}
              </Typography>
              <Typography color="text.secondary">
                Half Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <AccessTime color="error" />
              <Typography variant="h4" component="div" color="error.main">
                {stats.absent}
              </Typography>
              <Typography color="text.secondary">
                Absent Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <TrendingUp color="info" />
              <Typography variant="h4" component="div" color="info.main">
                {stats.attendanceRate}%
              </Typography>
              <Typography color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Login Time</TableCell>
                <TableCell>Logout Time</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Late By</TableCell>
                <TableCell>Breaks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(record.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={record.status} 
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.loginTime ? new Date(record.loginTime).toLocaleTimeString() : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.logoutTime ? new Date(record.logoutTime).toLocaleTimeString() : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.workingHours ? `${Math.floor(record.workingHours / 60)}h ${record.workingHours % 60}m` : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={record.lateBy > 0 ? 'error' : 'text.primary'}>
                      {record.lateBy > 0 ? `${record.lateBy}m` : 'On Time'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.breaks?.length || 0} breaks
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default EmployeeAttendance