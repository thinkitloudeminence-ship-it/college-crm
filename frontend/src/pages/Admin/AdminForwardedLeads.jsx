// AdminForwardedLeads.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import { Refresh, FilterList, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const AdminForwardedLeads = () => {
  const [forwardedLeads, setForwardedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    forwardedBy: ''
  });
  const [telecallers, setTelecallers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchForwardedLeads();
    fetchTelecallers();
    fetchStats();
  }, []);

  const fetchForwardedLeads = async (filterParams = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filterParams).toString();
      const response = await axios.get(`/api/leads/forwarded/all?${params}`);
      setForwardedLeads(response.data);
    } catch (error) {
      setError('Failed to fetch forwarded leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchTelecallers = async () => {
    try {
      const response = await axios.get('/api/users?role=telecaller');
      setTelecallers(response.data);
    } catch (error) {
      console.error('Failed to fetch telecallers');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/reports/forward-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Apply filters
    const filterParams = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) filterParams[key] = newFilters[key];
    });
    
    fetchForwardedLeads(filterParams);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'default',
      assigned: 'primary',
      contacted: 'info',
      hot: 'error',
      converted: 'success',
      future: 'warning',
      dead: 'default'
    };
    return colors[status] || 'default';
  };

  const StatCard = ({ title, value, subtitle, color = 'primary' }) => (
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Forwarded Leads Tracking
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Forwards"
            value={stats.totalForwards || 0}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Telecallers"
            value={telecallers.length}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="This Month"
            value={stats.thisMonth || 0}
            subtitle="Forwards"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate || 0}%`}
            subtitle="Forwarded leads"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            <FilterList sx={{ mr: 1 }} />
            Filters
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={() => {
              setFilters({ dateFrom: '', dateTo: '', forwardedBy: '' });
              fetchForwardedLeads();
            }}
          >
            Clear Filters
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Forwarded By"
              value={filters.forwardedBy}
              onChange={(e) => handleFilterChange('forwardedBy', e.target.value)}
            >
              <MenuItem value="">All Telecallers</MenuItem>
              {telecallers.map((telecaller) => (
                <MenuItem key={telecaller._id} value={telecaller._id}>
                  {telecaller.name} ({telecaller.employeeId})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Forwarded Leads Table */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            All Forwarded Leads ({forwardedLeads.length})
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Refresh />}
            onClick={() => fetchForwardedLeads()}
          >
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead Information</TableCell>
                <TableCell>Forwarded By</TableCell>
                <TableCell>Forwarded To</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Forward Date</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Current Assignee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {forwardedLeads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {lead.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.phone} • {lead.email}
                    </Typography>
                    {lead.college && (
                      <Typography variant="caption" color="text.secondary">
                        {lead.college}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {lead.forwardedBy.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {lead.forwardedBy.employeeId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {lead.forwardedTo ? lead.forwardedTo.name : 'Admin'}
                    </Typography>
                    {lead.forwardedTo && (
                      <Typography variant="caption" color="text.secondary">
                        {lead.forwardedTo.employeeId}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {lead.forwardReason}
                    </Typography>
                    {lead.forwardNotes && (
                      <Typography variant="caption" color="text.secondary">
                        {lead.forwardNotes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(lead.forwardedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(lead.forwardedAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status} 
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {lead.assignedTo ? (
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {lead.assignedTo.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {lead.assignedTo.employeeId}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {forwardedLeads.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <TrendingUp sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No forwarded leads found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or check back later
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminForwardedLeads;