import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { getDashboardStats } from '../../redux/slices/leadSlice'

const Reports = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [timeRange, setTimeRange] = useState('30days')
  const [loading, setLoading] = useState(true)

  const { dashboardStats } = useSelector((state) => state.leads)

  useEffect(() => {
    loadReports()
  }, [timeRange])

  const loadReports = async () => {
    try {
      setLoading(true)
      await dispatch(getDashboardStats()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load reports', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: '#1976d2',
      contacted: '#0288d1',
      interested: '#ed6c02',
      converted: '#2e7d32',
      not_interested: '#d32f2f',
      admitted: '#388e3c',
      lost: '#c62828',
    }
    return colors[status] || '#666'
  }

  const getSourceColor = (source) => {
    const colors = {
      manual_upload: '#1976d2',
      facebook: '#1877f2',
      instagram: '#e4405f',
      whatsapp: '#25d366',
      website: '#ff9800',
      reference: '#9c27b0',
    }
    return colors[source] || '#666'
  }

  // Prepare chart data
  const statusChartData = dashboardStats?.leadStatusCounts?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: getStatusColor(item._id),
  })) || []

  const sourceChartData = dashboardStats?.leadSourceCounts?.map(item => ({
    name: item._id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: item.count,
    color: getSourceColor(item._id),
  })) || []

  const monthlyLeadsData = dashboardStats?.monthlyLeads?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    leads: item.count,
  })) || []

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
          Reports & Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7days">Last 7 Days</MenuItem>
            <MenuItem value="30days">Last 30 Days</MenuItem>
            <MenuItem value="90days">Last 90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Lead Status Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Source Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Source Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sourceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Leads Trend */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Leads Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyLeadsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#1976d2" name="Leads Generated" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Telecaller Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Telecaller Performance
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Telecaller</TableCell>
                      <TableCell align="right">Total Leads</TableCell>
                      <TableCell align="right">Contacted</TableCell>
                      <TableCell align="right">Converted</TableCell>
                      <TableCell align="right">Conversion Rate</TableCell>
                      <TableCell align="center">Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardStats?.telecallerPerformance?.map((telecaller) => (
                      <TableRow key={telecaller.employeeId}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {telecaller.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {telecaller.employeeId}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{telecaller.totalLeads}</TableCell>
                        <TableCell align="right">{telecaller.contactedLeads}</TableCell>
                        <TableCell align="right">{telecaller.convertedLeads}</TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={telecaller.conversionRate > 20 ? 'success.main' : 
                                   telecaller.conversionRate > 10 ? 'warning.main' : 'error.main'}
                          >
                            {telecaller.conversionRate.toFixed(1)}%
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              telecaller.conversionRate > 20 ? 'Excellent' :
                              telecaller.conversionRate > 15 ? 'Good' :
                              telecaller.conversionRate > 10 ? 'Average' : 'Needs Improvement'
                            }
                            color={
                              telecaller.conversionRate > 20 ? 'success' :
                              telecaller.conversionRate > 15 ? 'primary' :
                              telecaller.conversionRate > 10 ? 'warning' : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!dashboardStats?.telecallerPerformance || dashboardStats.telecallerPerformance.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No telecaller performance data available
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

        {/* Key Metrics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Employees
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats?.overview?.totalEmployees || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Leads
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {dashboardStats?.overview?.totalLeads || 0}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Overall Conversion Rate
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    color={dashboardStats?.overview?.conversionRate > 20 ? 'success.main' : 
                           dashboardStats?.overview?.conversionRate > 10 ? 'warning.main' : 'error.main'}
                  >
                    {dashboardStats?.overview?.conversionRate?.toFixed(1) || 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Follow-ups */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Follow-ups
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Lead Name</TableCell>
                      <TableCell>Assigned To</TableCell>
                      <TableCell>Follow-up Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardStats?.followUpLeads?.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {lead.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {lead.assignedTo?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(lead.callHistory?.[0]?.nextFollowUp).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                            color={getStatusColor(lead.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!dashboardStats?.followUpLeads || dashboardStats.followUpLeads.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No upcoming follow-ups
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

export default Reports