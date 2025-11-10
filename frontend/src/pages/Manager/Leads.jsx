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
  Leaderboard,
  TrendingUp,
  People
} from '@mui/icons-material'
import axios from 'axios'

const ManagerLeads = () => {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeads()
    fetchStats()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/api/leads')
      setLeads(response.data)
    } catch (error) {
      setError('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/leads/stats/overview')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'default',
      assigned: 'primary',
      contacted: 'info',
      hot: 'error',
      converted: 'success',
      future: 'warning',
      dead: 'default'
    }
    return colors[status] || 'default'
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Team Leads Overview
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
              <Leaderboard color="primary" />
              <Typography variant="h4" component="div">
                {stats.total || 0}
              </Typography>
              <Typography color="text.secondary">
                Total Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <TrendingUp color="success" />
              <Typography variant="h4" component="div" color="success.main">
                {stats.converted || 0}
              </Typography>
              <Typography color="text.secondary">
                Converted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <People color="error" />
              <Typography variant="h4" component="div" color="error.main">
                {stats.hot || 0}
              </Typography>
              <Typography color="text.secondary">
                Hot Leads
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <TrendingUp color="info" />
              <Typography variant="h4" component="div" color="info.main">
                {stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
              </Typography>
              <Typography color="text.secondary">
                Conversion Rate
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
                <TableCell>Lead Info</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {lead.name}
                      </Typography>
                      {lead.college && (
                        <Typography variant="body2" color="text.secondary">
                          {lead.college}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {lead.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lead.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {lead.assignedTo ? (
                      <Typography variant="body2">
                        {lead.assignedTo.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not assigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status} 
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
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
                      {new Date(lead.updatedAt).toLocaleDateString()}
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

export default ManagerLeads