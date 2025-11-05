import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getLeads, assignLeads } from '../../redux/slices/leadSlice';
import { getEmployees } from '../../redux/slices/employeeSlice';

const LeadManagement = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    employeeId: ''
  });

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { leads, loading } = useSelector((state) => state.leads);
  const { employees } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(getLeads());
    dispatch(getEmployees());
  }, [dispatch]);

  const handleAssignLeads = async () => {
    if (!assignmentData.employeeId || selectedLeads.length === 0) {
      enqueueSnackbar('Please select leads and a telecaller', { variant: 'warning' });
      return;
    }

    try {
      await dispatch(assignLeads({
        leadIds: selectedLeads,
        employeeId: assignmentData.employeeId
      })).unwrap();
      
      enqueueSnackbar(`Successfully assigned ${selectedLeads.length} leads`, { variant: 'success' });
      setAssignDialogOpen(false);
      setSelectedLeads([]);
      setAssignmentData({ employeeId: '' });
      dispatch(getLeads());
    } catch (error) {
      enqueueSnackbar('Failed to assign leads', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      contacted: 'info',
      interested: 'warning',
      converted: 'success',
      not_interested: 'error',
    };
    return colors[status] || 'default';
  };

  const telecallers = employees.filter(emp => emp.role === 'telecaller' && emp.isActive);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Lead Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Assignment />}
          onClick={() => setAssignDialogOpen(true)}
          disabled={selectedLeads.length === 0}
        >
          Assign Selected ({selectedLeads.length})
        </Button>
      </Box>

      <Grid container spacing={3}>
        {leads.map((lead) => (
          <Grid item xs={12} sm={6} md={4} key={lead._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedLeads.includes(lead._id) ? '2px solid' : '1px solid',
                borderColor: selectedLeads.includes(lead._id) ? 'primary.main' : 'divider',
              }}
              onClick={() => {
                setSelectedLeads(prev => 
                  prev.includes(lead._id) 
                    ? prev.filter(id => id !== lead._id)
                    : [...prev, lead._id]
                )
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {lead.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {lead.phone}
                    </Typography>
                  </Box>
                  <Chip
                    label={lead.status}
                    color={getStatusColor(lead.status)}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Education:</strong> {lead.currentEducation?.qualification} - {lead.currentEducation?.stream}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Interest:</strong> {lead.interestedIn === 'abroad' ? 'Abroad Studies' : 'Domestic Studies'}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={lead.source}
                    variant="outlined"
                    size="small"
                  />
                  {lead.assignedTo ? (
                    <Chip
                      label={lead.assignedTo.name}
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Chip
                      label="Unassigned"
                      color="default"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assign Leads Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Leads to Telecaller</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Assigning {selectedLeads.length} selected leads to:
          </Typography>
          <TextField
            select
            fullWidth
            label="Select Telecaller"
            value={assignmentData.employeeId}
            onChange={(e) => setAssignmentData({ employeeId: e.target.value })}
            margin="normal"
          >
            {telecallers.map(telecaller => (
              <MenuItem key={telecaller._id} value={telecaller._id}>
                {telecaller.name} - {telecaller.department}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAssignLeads} 
            variant="contained"
            disabled={!assignmentData.employeeId}
          >
            Assign Leads
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadManagement;