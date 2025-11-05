import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
} from '@mui/material'
import {
  Phone,
  CheckCircle,
  TrendingUp,
  Schedule,
  CallMade,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { getTelecallerDashboard } from '../../redux/slices/leadSlice'

const TelecallerDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)

  const { telecallerDashboard } = useSelector((state) => state.leads)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      await dispatch(getTelecallerDashboard()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load dashboard', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Assigned',
      value: telecallerDashboard?.overview?.totalAssigned || 0,
      icon: <Phone />,
      color: 'primary',
    },
    {
      title: 'Calls Today',
      value: telecallerDashboard?.quickStats?.callsToday || 0,
      icon: <CallMade />,
      color: 'info',
    },
    {
      title: 'Successful Calls',
      value: telecallerDashboard?.quickStats?.successfulCallsToday || 0,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: 'Conversion Rate',
      value: `${telecallerDashboard?.quickStats?.conversionRate || 0}%`,
      icon: <TrendingUp />,
      color: 'warning',
    },
  ]

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      contacted: 'info',
      interested: 'warning',
      converted: 'success',
      not_interested: 'error',
    }
    return colors[status] || 'default'
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    )
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Here's your performance overview and today's tasks.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}.light`,
                      color: `${stat.color}.main`,
                      borderRadius: '50%',
                      p: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Today's Follow-ups */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Today's Follow-ups
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/telecaller/leads')}
                >
                  View All
                </Button>
              </Box>
              
              {telecallerDashboard?.todaysFollowUps?.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Lead Name</TableCell>
                        <TableCell>Education</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {telecallerDashboard.todaysFollowUps.slice(0, 5).map((lead) => (
                        <TableRow key={lead._id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {lead.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {lead.currentEducation?.stream}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                              color={getStatusColor(lead.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/telecaller/call/${lead._id}`)}
                            >
                              Call
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No follow-ups for today
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Great job! You're all caught up.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Status Distribution
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {telecallerDashboard?.leadCounts?.map((status) => (
                      <TableRow key={status._id}>
                        <TableCell>
                          <Chip
                            label={status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                            color={getStatusColor(status._id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{status.count}</TableCell>
                        <TableCell align="right">
                          {telecallerDashboard.overview.totalAssigned > 0
                            ? ((status.count / telecallerDashboard.overview.totalAssigned) * 100).toFixed(1)
                            : 0}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {telecallerDashboard?.overview?.performance?.totalCalls || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Calls
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {telecallerDashboard?.overview?.performance?.successfulCalls || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Successful Calls
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                      {telecallerDashboard?.overview?.performance?.conversions || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Conversions
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography 
                      variant="h3" 
                      fontWeight="bold"
                      color={
                        telecallerDashboard?.quickStats?.conversionRate > 20 ? 'success.main' :
                        telecallerDashboard?.quickStats?.conversionRate > 10 ? 'warning.main' : 'error.main'
                      }
                    >
                      {telecallerDashboard?.quickStats?.conversionRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Conversion Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Phone />}
                    onClick={() => navigate('/telecaller/leads')}
                  >
                    View My Leads
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<Schedule />}
                    onClick={() => navigate('/telecaller/leads?filter=followup')}
                  >
                    Follow-ups
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<TrendingUp />}
                    onClick={() => navigate('/telecaller/performance')}
                  >
                    Performance
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<CheckCircle />}
                    onClick={() => navigate('/telecaller/leads?status=interested')}
                  >
                    Interested Leads
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TelecallerDashboard