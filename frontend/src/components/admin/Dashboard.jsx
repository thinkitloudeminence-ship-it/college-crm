import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material'
import {
  People,
  Phone,
  TrendingUp,
  CheckCircle,
  Warning,
  Refresh,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { getDashboardStats } from '../../redux/slices/leadSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)

  const { dashboardStats } = useSelector((state) => state.leads)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      await dispatch(getDashboardStats()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'Total Employees',
      value: dashboardStats?.overview?.totalEmployees || 0,
      icon: <People />,
      color: 'primary',
      progress: 100,
    },
    {
      title: 'Total Leads',
      value: dashboardStats?.overview?.totalLeads || 0,
      icon: <Phone />,
      color: 'info',
      progress: 100,
    },
    {
      title: 'Assigned Leads',
      value: dashboardStats?.overview?.assignedLeads || 0,
      icon: <CheckCircle />,
      color: 'success',
      progress: dashboardStats?.overview?.totalLeads ? 
        (dashboardStats.overview.assignedLeads / dashboardStats.overview.totalLeads) * 100 : 0,
    },
    {
      title: 'Conversion Rate',
      value: `${dashboardStats?.overview?.conversionRate?.toFixed(1) || 0}%`,
      icon: <TrendingUp />,
      color: 'warning',
      progress: dashboardStats?.overview?.conversionRate || 0,
    },
  ]

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      contacted: 'info',
      interested: 'warning',
      converted: 'success',
      not_interested: 'error',
      admitted: 'success',
      lost: 'error',
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <IconButton onClick={loadDashboardData} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
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
                      p: 1,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  color={stat.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
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
                    {dashboardStats?.leadStatusCounts?.map((status) => (
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
                          {dashboardStats.overview.totalLeads > 0
                            ? ((status.count / dashboardStats.overview.totalLeads) * 100).toFixed(1)
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

        {/* Employee Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Employee Distribution
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Designation</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardStats?.employeeCounts?.map((employee) => (
                      <TableRow key={employee._id}>
                        <TableCell>
                          {employee._id.charAt(0).toUpperCase() + employee._id.slice(1)}
                        </TableCell>
                        <TableCell align="right">{employee.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leads */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leads
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardStats?.recentLeads?.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {lead.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {lead.phone}
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
                          {lead.assignedTo ? (
                            <Typography variant="body2">
                              {lead.assignedTo.name}
                            </Typography>
                          ) : (
                            <Chip label="Unassigned" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!dashboardStats?.recentLeads || dashboardStats.recentLeads.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No recent leads found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard