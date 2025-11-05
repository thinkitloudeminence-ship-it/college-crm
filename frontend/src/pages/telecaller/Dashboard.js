import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Phone,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getTelecallerLeads } from '../../redux/slices/leadSlice';

const TelecallerDashboard = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { leads, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await dispatch(getTelecallerLeads()).unwrap();
    } catch (error) {
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    }
  };

  const stats = [
    {
      title: 'Total Assigned',
      value: leads.length || 0,
      icon: <Phone />,
      color: 'primary',
    },
    {
      title: 'Converted',
      value: leads.filter(lead => lead.status === 'converted').length || 0,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: 'Conversion Rate',
      value: leads.length > 0 ? ((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100).toFixed(1) + '%' : '0%',
      icon: <Schedule />,
      color: 'warning',
    },
  ];

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
        My Dashboard
      </Typography>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
                      p: 1,
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
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leads
              </Typography>
              <List>
                {leads.slice(0, 5).map((lead) => (
                  <ListItem key={lead._id} divider>
                    <ListItemText
                      primary={lead.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {lead.phone}
                          </Typography>
                          <Chip
                            label={lead.status}
                            color={getStatusColor(lead.status)}
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button onClick={() => window.location.href = '/telecaller/leads'}>
                  <ListItemText primary="View All Leads" secondary="Manage your assigned leads" />
                </ListItem>
                <ListItem button onClick={() => window.location.href = '/telecaller/leads'}>
                  <ListItemText primary="Make Calls" secondary="Start calling your leads" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TelecallerDashboard;