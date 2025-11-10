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
  Alert
} from '@mui/material';
import { ForwardToInbox, Phone } from '@mui/icons-material';
import axios from 'axios';

const ReceivedLeadsSection = () => {
  const [receivedLeads, setReceivedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReceivedLeads();
  }, []);

  const fetchReceivedLeads = async () => {
    try {
      const response = await axios.get('/api/leads/forwarded/received');
      setReceivedLeads(response.data);
    } catch (error) {
      setError('Failed to fetch received leads');
    } finally {
      setLoading(false);
    }
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

  const handleCallLead = (lead) => {
    // Implement call functionality
    console.log('Calling lead:', lead.phone);
  };

  if (loading) {
    return <Typography>Loading received leads...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Leads Forwarded to Me
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={fetchReceivedLeads}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {receivedLeads.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ForwardToInbox sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No leads forwarded to you yet
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead Information</TableCell>
                <TableCell>Forwarded By</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Forward Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receivedLeads.map((lead) => (
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
                    <Typography variant="body2" fontWeight="bold">
                      {lead.forwardedBy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {lead.forwardedBy.employeeId}
                    </Typography>
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
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={lead.status} 
                      color={getStatusColor(lead.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        startIcon={<Phone />}
                        onClick={() => handleCallLead(lead)}
                      >
                        Call
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => window.location.href = `/telecaller/leads/${lead._id}`}
                      >
                        View
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ReceivedLeadsSection;