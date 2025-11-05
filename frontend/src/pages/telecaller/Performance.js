import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  Phone,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

const TelecallerPerformance = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    loadPerformanceData();
  }, [timeRange]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API
      setTimeout(() => {
        setPerformanceData({
          period: timeRange,
          dailyPerformance: [
            { _id: { date: '2024-01-01' }, calls: 15, successfulCalls: 8, conversions: 2, totalDuration: 2400 },
            { _id: { date: '2024-01-02' }, calls: 12, successfulCalls: 6, conversions: 1, totalDuration: 1800 },
          ],
          outcomeDistribution: [
            { _id: 'Interested - Send Details', count: 10 },
            { _id: 'Not Reachable', count: 8 },
            { _id: 'Call Back Later', count: 5 },
            { _id: 'Not Interested', count: 3 },
            { _id: 'Requested Counselling', count: 2 },
          ],
          currentPerformance: {
            totalCalls: 150,
            successfulCalls: 80,
            conversions: 15,
            totalLeads: 100,
            rating: 4.2
          },
          summary: {
            totalCalls: 150,
            successfulCalls: 80,
            totalConversions: 15,
            averageCallsPerDay: 12.5,
            successRate: 53.3
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      enqueueSnackbar('Failed to load performance data', { variant: 'error' });
      setLoading(false);
    }
  };

  const getOutcomeColor = (outcome) => {
    const colors = {
      'Interested - Send Details': 'success',
      'Requested Counselling': 'primary',
      'Call Back Later': 'warning',
      'Not Reachable': 'default',
      'Not Interested': 'error',
      'Converted': 'success'
    };
    return colors[outcome] || 'default';
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
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Performance
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

      {/* Performance Overview Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Calls
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {performanceData?.currentPerformance?.totalCalls || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'primary.light',
                    color: 'primary.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <Phone />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Successful Calls
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {performanceData?.currentPerformance?.successfulCalls || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'success.light',
                    color: 'success.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <CheckCircle />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Conversions
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {performanceData?.currentPerformance?.conversions || 0}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'warning.light',
                    color: 'warning.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <TrendingUp />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Success Rate
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {performanceData?.summary?.successRate?.toFixed(1) || 0}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'info.light',
                    color: 'info.main',
                    borderRadius: '50%',
                    p: 1,
                  }}
                >
                  <Schedule />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Outcome Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Call Outcome Distribution
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Outcome</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Percentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceData?.outcomeDistribution?.map((outcome) => (
                      <TableRow key={outcome._id}>
                        <TableCell>
                          <Chip
                            label={outcome._id}
                            color={getOutcomeColor(outcome._id)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{outcome.count}</TableCell>
                        <TableCell align="right">
                          {performanceData.summary.totalCalls > 0
                            ? ((outcome.count / performanceData.summary.totalCalls) * 100).toFixed(1)
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

        {/* Daily Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Calls</TableCell>
                      <TableCell align="right">Successful</TableCell>
                      <TableCell align="right">Avg. Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {performanceData?.dailyPerformance?.map((day) => (
                      <TableRow key={day._id.date}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(day._id.date).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{day.calls}</TableCell>
                        <TableCell align="right">{day.successfulCalls}</TableCell>
                        <TableCell align="right">
                          {Math.round(day.totalDuration / day.calls / 60)} min
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary.main" fontWeight="bold">
                      {performanceData?.summary?.averageCallsPerDay || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Calls Per Day
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      {performanceData?.summary?.successRate?.toFixed(1) || 0}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Success Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      {performanceData?.currentPerformance?.rating || 0}/5
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Performance Rating
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="info.main" fontWeight="bold">
                      {performanceData?.currentPerformance?.totalLeads || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Leads
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TelecallerPerformance;