import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Phone,
  TrendingUp,
  CheckCircle,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getDashboardStats } from '../../redux/slices/leadSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { dashboardStats, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      await dispatch(getDashboardStats()).unwrap();
    } catch (error) {
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    }
  };

  const stats = [
    {
      title: 'Total Employees',
      value: dashboardStats?.overview?.totalEmployees || 0,
      icon: <People />,
      color: 'primary',
    },
    {
      title: 'Total Leads',
      value: dashboardStats?.overview?.totalLeads || 0,
      icon: <Phone />,
      color: 'info',
    },
    {
      title: 'New Leads',
      value: dashboardStats?.overview?.newLeads || 0,
      icon: <CheckCircle />,
      color: 'success',
    },
    {
      title: 'Conversion Rate',
      value: `${dashboardStats?.overview?.conversionRate || 0}%`,
      icon: <TrendingUp />,
      color: 'warning',
    },
  ];

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
        Admin Dashboard
      </Typography>

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
                Lead Status Distribution
              </Typography>
              {dashboardStats?.leadStatusCounts?.map((status) => (
                <Box key={status._id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {status.count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leads
              </Typography>
              {dashboardStats?.recentLeads?.slice(0, 5).map((lead) => (
                <Box key={lead._id} display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {lead.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {lead.status}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;