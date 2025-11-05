import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import { Phone } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getTelecallerLeads } from '../../redux/slices/leadSlice';

const MyLeads = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { leads, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      await dispatch(getTelecallerLeads()).unwrap();
    } catch (error) {
      enqueueSnackbar('Failed to load leads', { variant: 'error' });
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

  const handleCallLead = (leadId) => {
    navigate(`/telecaller/call/${leadId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        My Leads
      </Typography>

      <Grid container spacing={3}>
        {leads.map((lead) => (
          <Grid item xs={12} sm={6} md={4} key={lead._id}>
            <Card>
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
                  {lead.preferredCourses && lead.preferredCourses.length > 0 && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Courses:</strong> {lead.preferredCourses.join(', ')}
                    </Typography>
                  )}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={lead.source}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    startIcon={<Phone />}
                    size="small"
                    onClick={() => handleCallLead(lead._id)}
                  >
                    Call
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {leads.length === 0 && (
        <Box textAlign="center" py={6}>
          <Phone sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No leads assigned
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Contact your administrator to get leads assigned to you.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MyLeads;