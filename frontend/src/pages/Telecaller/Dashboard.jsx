// import React, { useState, useEffect } from 'react'
// import {
//   Grid,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   CircularProgress,
//   Alert
// } from '@mui/material'
// import {
//   Leaderboard,
//   Phone,
//   Check,
//   Schedule,
//   TrendingUp
// } from '@mui/icons-material'
// import axios from 'axios'
// import ForwardedLeadsSection from './ForwardedLeadsSection';
// import ReceivedLeadsSection from './ReceivedLeadsSection';

// const TelecallerDashboard = () => {
//   const [stats, setStats] = useState({})
//   const [recentLeads, setRecentLeads] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     fetchDashboardData()
//   }, [])

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true)
//       const [reportResponse, leadsResponse] = await Promise.all([
//         axios.get('/api/reports/dashboard'),
//         axios.get('/api/leads?limit=5')
//       ])

//       setStats(reportResponse.data)
//       setRecentLeads(leadsResponse.data)
//     } catch (error) {
//       setError('Failed to load dashboard data')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
//     <Card sx={{ height: '100%' }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography color="text.secondary" gutterBottom variant="body2">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//             {subtitle && (
//               <Typography variant="body2" color="text.secondary">
//                 {subtitle}
//               </Typography>
//             )}
//           </Box>
//           <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   )

//   const getStatusColor = (status) => {
//     const colors = {
//       new: 'default',
//       assigned: 'primary',
//       contacted: 'info',
//       hot: 'error',
//       converted: 'success',
//       future: 'warning',
//       dead: 'default'
//     }
//     return colors[status] || 'default'
//   }

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
//         Telecaller Dashboard
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Stats Grid */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Leaderboard />}
//             title="Total Leads"
//             value={stats.leads?.total || 0}
//             color="primary"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Check />}
//             title="Converted"
//             value={stats.leads?.converted || 0}
//             subtitle={`${stats.leads?.conversionRate || 0}% rate`}
//             color="success"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<Phone />}
//             title="Hot Leads"
//             value={stats.leads?.hot || 0}
//             color="error"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             icon={<TrendingUp />}
//             title="Today's Calls"
//             value="0"
//             subtitle="Start calling!"
//             color="info"
//           />
//         </Grid>
//       </Grid>

//       <Grid container spacing={3}>
//         {/* Recent Leads */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//               <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                 Recent Leads
//               </Typography>
//               <Button
//                 variant="outlined"
//                 size="small"
//                 onClick={() => window.location.href = '/telecaller/leads'}
//               >
//                 View All
//               </Button>
//             </Box>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Contact</TableCell>
//                     <TableCell>College/Course</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Last Updated</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {recentLeads.map((lead) => (
//                     <TableRow key={lead._id}>
//                       <TableCell>
//                         <Typography variant="body1" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {lead.phone}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.email}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {lead.college}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={lead.status}
//                           color={getStatusColor(lead.status)}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2">
//                           {new Date(lead.updatedAt).toLocaleDateString()}
//                         </Typography>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>

//           {/* Forwarded Leads Sections */}
//           <Grid container spacing={3} sx={{ mt: 0 }}>
//             <Grid item xs={12}>
//               <ForwardedLeadsSection />
//             </Grid>
            
//             <Grid item xs={12}>
//               <ReceivedLeadsSection />
//             </Grid>
//           </Grid>
//         </Grid>

//         {/* Quick Actions */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, mb: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Quick Actions
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={<Phone />}
//                 onClick={() => window.location.href = '/telecaller/leads'}
//               >
//                 Start Calling
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 startIcon={<Schedule />}
//               >
//                 Schedule Follow-up
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="success"
//                 startIcon={<Check />}
//               >
//                 Mark Converted
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="error"
//                 startIcon={<TrendingUp />}
//               >
//                 Mark Dead Lead
//               </Button>
//             </Box>
//           </Paper>

//           {/* Performance Tips */}
//           <Paper sx={{ p: 3 }}>
//             <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
//               Performance Tips
//             </Typography>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//               {[
//                 'Call during business hours (10 AM - 6 PM)',
//                 'Follow up within 24 hours of initial contact',
//                 'Use the CRM to track all interactions',
//                 'Update lead status promptly',
//                 'Set reminders for future follow-ups'
//               ].map((tip, index) => (
//                 <Typography key={index} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   • {tip}
//                 </Typography>
//               ))}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   )
// }

// export default TelecallerDashboard



import React, { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Leaderboard,
  Phone,
  Check,
  Schedule,
  TrendingUp,
  ForwardToInbox,
  Forward
} from '@mui/icons-material'
import axios from 'axios'
import ForwardedLeadsSection from './ForwardedLeadsSection';
import ReceivedLeadsSection from './ReceivedLeadsSection';

const TelecallerDashboard = () => {
  const [stats, setStats] = useState({})
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [reportResponse, leadsResponse] = await Promise.all([
        axios.get('/api/reports/dashboard'),
        axios.get('/api/leads?limit=5')
      ])

      setStats(reportResponse.data)
      setRecentLeads(leadsResponse.data)
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, title, value, subtitle, color = 'primary' }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
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
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

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
        Telecaller Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Leaderboard />}
            title="Total Leads"
            value={stats.leads?.total || 0}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Check />}
            title="Converted"
            value={stats.leads?.converted || 0}
            subtitle={`${stats.leads?.conversionRate || 0}% rate`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Phone />}
            title="Hot Leads"
            value={stats.leads?.hot || 0}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Forward />}
            title="Forwarded"
            value={stats.leads?.forwardedByMe || 0}
            subtitle={`${stats.leads?.forwardedToMe || 0} received`}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Leads */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Recent Leads
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => window.location.href = '/telecaller/leads'}
              >
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>College/Course</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentLeads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold">
                          {lead.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {lead.phone}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {lead.college}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.course}
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

          {/* Forwarded Leads Sections */}
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <ForwardedLeadsSection />
            </Grid>
            
            <Grid item xs={12}>
              <ReceivedLeadsSection />
            </Grid>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Phone />}
                onClick={() => window.location.href = '/telecaller/leads'}
              >
                Start Calling
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Schedule />}
              >
                Schedule Follow-up
              </Button>
              <Button
                variant="outlined"
                color="success"
                startIcon={<Check />}
              >
                Mark Converted
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Forward />}
                onClick={() => window.location.href = '/telecaller/leads?showForward=true'}
              >
                Forward Lead
              </Button>
            </Box>
          </Paper>

          {/* Performance Tips */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Performance Tips
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Call during business hours (10 AM - 6 PM)',
                'Follow up within 24 hours of initial contact',
                'Use the CRM to track all interactions',
                'Update lead status promptly',
                'Forward leads to appropriate telecallers when needed'
              ].map((tip, index) => (
                <Typography key={index} variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • {tip}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TelecallerDashboard