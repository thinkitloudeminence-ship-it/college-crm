import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Download,
  TrendingUp,
  People,
  Assignment,
  Leaderboard
} from '@mui/icons-material'
import axios from 'axios'

const Reports = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    department: ''
  })

  useEffect(() => {
    fetchReport()
  }, [filters])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.year) params.append('year', filters.year)
      if (filters.month) params.append('month', filters.month)
      if (filters.department) params.append('department', filters.department)

      const response = await axios.get(`/api/reports/monthly?${params}`)
      setReportData(response.data)
    } catch (error) {
      setError('Failed to fetch report data')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (format) => {
    // Implement download functionality
    console.log(`Downloading report in ${format} format`)
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload('pdf')}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => handleDownload('excel')}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Report Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Year"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              {[2023, 2024, 2025].map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Month"
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            >
              {[
                { value: 1, label: 'January' },
                { value: 2, label: 'February' },
                { value: 3, label: 'March' },
                { value: 4, label: 'April' },
                { value: 5, label: 'May' },
                { value: 6, label: 'June' },
                { value: 7, label: 'July' },
                { value: 8, label: 'August' },
                { value: 9, label: 'September' },
                { value: 10, label: 'October' },
                { value: 11, label: 'November' },
                { value: 12, label: 'December' }
              ].map(month => (
                <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Department"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="web development">Web Development</MenuItem>
              <MenuItem value="digital marketing">Digital Marketing</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="telecalling">Telecalling</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Summary Cards */}
      {reportData?.summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <People color="primary" />
                <Typography variant="h4" component="div">
                  {reportData.summary.totalEmployees}
                </Typography>
                <Typography color="text.secondary">
                  Total Employees
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <TrendingUp color="success" />
                <Typography variant="h4" component="div" color="success.main">
                  {reportData.summary.averageConversionRate}%
                </Typography>
                <Typography color="text.secondary">
                  Avg Conversion Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Assignment color="info" />
                <Typography variant="h4" component="div" color="info.main">
                  {reportData.summary.averageTaskCompletion}%
                </Typography>
                <Typography color="text.secondary">
                  Avg Task Completion
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Leaderboard color="warning" />
                <Typography variant="h4" component="div" color="warning.main">
                  {reportData.detailedReport?.length || 0}
                </Typography>
                <Typography color="text.secondary">
                  Active Reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detailed Report */}
      {reportData?.detailedReport && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell>Leads</TableCell>
                  <TableCell>Tasks</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.detailedReport.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {report.employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {report.employee.employeeId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.employee.department}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Present: {report.attendance.present}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Late: {report.attendance.lateDays}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Total: {report.performance.totalLeads}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          Converted: {report.performance.convertedLeads}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          Total: {report.performance.totalTasks}
                        </Typography>
                        <Typography variant="body2" color="info.main">
                          Completed: {report.performance.completedTasks}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="success.main">
                          Lead Conv: {report.performance.conversionRate}%
                        </Typography>
                        <Typography variant="body2" color="primary.main">
                          Task Comp: {report.performance.taskCompletionRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  )
}

export default Reports