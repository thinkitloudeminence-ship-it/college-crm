// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent
// } from '@mui/material'
// import {
//   Phone,
//   Check,
//   Close,
//   Schedule,
//   Edit
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: ''
//   })
//   const [tabValue, setTabValue] = useState(0)

//   useEffect(() => {
//     fetchLeads()
//   }, [])

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads')
//       setLeads(response.data)
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || ''
//     })
//     setOpenDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       await axios.put(`/api/leads/${selectedLead._id}/status`, statusData)
//       fetchLeads()
//       setOpenDialog(false)
//     } catch (error) {
//       setError('Failed to update lead status')
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Contact Details</TableCell>
//                 <TableCell>Education</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Last Contact</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         {lead.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Source: {lead.source}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         📞 {lead.phone}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         ✉️ {lead.email}
//                       </Typography>
//                       {lead.city && (
//                         <Typography variant="body2" color="text.secondary">
//                           📍 {lead.city}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.college || 'Not specified'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.course || 'Not specified'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.updatedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {new Date(lead.updatedAt).toLocaleTimeString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton 
//                         size="small" 
//                         color="primary"
//                         title="Call"
//                       >
//                         <Phone />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         color="primary"
//                         onClick={() => handleStatusUpdate(lead)}
//                         title="Update Status"
//                       >
//                         <Edit />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Update Lead Status - {selectedLead?.name}
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks"
//                 multiline
//                 rows={3}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add call notes, conversation details, or reasons for status change..."
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained">
//             Update Status
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads


// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent
// } from '@mui/material'
// import {
//   Phone,
//   Check,
//   Schedule,
//   Edit
// } from '@mui/icons-material' // Remove Close import
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: ''
//   })
//   const [tabValue, setTabValue] = useState(0)

//   useEffect(() => {
//     fetchLeads()
//   }, [])

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads')
//       setLeads(response.data)
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || ''
//     })
//     setOpenDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       await axios.put(`/api/leads/${selectedLead._id}/status`, statusData)
//       fetchLeads()
//       setOpenDialog(false)
//     } catch (error) {
//       setError('Failed to update lead status')
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Contact Details</TableCell>
//                 <TableCell>Education</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Last Contact</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         {lead.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Source: {lead.source}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         📞 {lead.phone}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         ✉️ {lead.email}
//                       </Typography>
//                       {lead.city && (
//                         <Typography variant="body2" color="text.secondary">
//                           📍 {lead.city}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.college || 'Not specified'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.course || 'Not specified'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.updatedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {new Date(lead.updatedAt).toLocaleTimeString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton 
//                         size="small" 
//                         color="primary"
//                         title="Call"
//                       >
//                         <Phone />
//                       </IconButton>
//                       <IconButton 
//                         size="small" 
//                         color="primary"
//                         onClick={() => handleStatusUpdate(lead)}
//                         title="Update Status"
//                       >
//                         <Edit />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Update Lead Status - {selectedLead?.name}
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks"
//                 multiline
//                 rows={3}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add call notes, conversation details, or reasons for status change..."
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained">
//             Update Status
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads



// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select,
//   Switch,
//   FormControlLabel
// } from '@mui/material'
// import {
//   Phone,
//   Check,
//   Schedule,
//   Edit,
//   Forward,
//   Close,
//   Person
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [statusDialog, setStatusDialog] = useState(false)
//   const [forwardDialog, setForwardDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: '',
//     callDuration: '',
//     interestLevel: '',
//     nextAction: '',
//     studentName: '',
//     studentNumber: '',
//     alternateNumber: '',
//     email: '',
//     twelfthSubject: '',
//     currentCity: '',
//     preferredCity: '',
//     examPreparation: '',
//     currentCourse: '',
//     budget: '',
//     timeline: '',
//     reference: ''
//   })
//   const [forwardData, setForwardData] = useState({
//     forwardTo: '',
//     forwardType: 'telecaller',
//     reason: '',
//     notes: ''
//   })

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//   }, [])

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads')
//       setLeads(response.data)
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || '',
//       callDuration: lead.callDuration || '',
//       interestLevel: lead.interestLevel || '',
//       nextAction: lead.nextAction || '',
//       studentName: lead.name || '',
//       studentNumber: lead.phone || '',
//       alternateNumber: lead.alternateNumber || '',
//       email: lead.email || '',
//       twelfthSubject: lead.twelfthSubject || '',
//       currentCity: lead.currentCity || '',
//       preferredCity: lead.preferredCity || '',
//       examPreparation: lead.examPreparation || '',
//       currentCourse: lead.currentCourse || '',
//       budget: lead.budget || '',
//       timeline: lead.timeline || '',
//       reference: lead.reference || ''
//     })
//     setStatusDialog(true)
//   }

//   const handleForwardLead = (lead) => {
//     setSelectedLead(lead)
//     setForwardData({
//       forwardTo: '',
//       forwardType: 'telecaller',
//       reason: '',
//       notes: ''
//     })
//     setForwardDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       await axios.put(`/api/leads/${selectedLead._id}/status`, statusData)
//       await fetchLeads()
//       setStatusDialog(false)
//       setSuccess('Lead status updated successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to update lead status: ' + (error.response?.data?.message || error.message))
//     }
//   }

//   const handleSubmitForward = async () => {
//     try {
//       await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
//       await fetchLeads()
//       setForwardDialog(false)
//       setSuccess('Lead forwarded successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Contact Details</TableCell>
//                 <TableCell>Education</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Last Contact</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         {lead.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Source: {lead.source}
//                       </Typography>
//                       {lead.reference && (
//                         <Typography variant="caption" color="primary">
//                           Ref: {lead.reference}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         📞 {lead.phone}
//                       </Typography>
//                       {lead.alternateNumber && (
//                         <Typography variant="body2" color="text.secondary">
//                           📱 {lead.alternateNumber}
//                         </Typography>
//                       )}
//                       <Typography variant="body2" color="text.secondary">
//                         ✉️ {lead.email}
//                       </Typography>
//                       {lead.city && (
//                         <Typography variant="body2" color="text.secondary">
//                           📍 {lead.city}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.college || 'Not specified'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.course || 'Not specified'}
//                       </Typography>
//                       {lead.examPreparation && (
//                         <Typography variant="caption" color="primary">
//                           Prep: {lead.examPreparation}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                     {lead.interestLevel && (
//                       <Typography variant="caption" display="block" color="text.secondary">
//                         Interest: {lead.interestLevel}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.updatedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {new Date(lead.updatedAt).toLocaleTimeString()}
//                     </Typography>
//                     {lead.followUpDate && (
//                       <Typography variant="caption" color="warning.main">
//                         Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
//                       <Box sx={{ display: 'flex', gap: 0.5 }}>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           title="Call"
//                         >
//                           <Phone fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           onClick={() => handleStatusUpdate(lead)}
//                           title="Update Status"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="secondary"
//                           onClick={() => handleForwardLead(lead)}
//                           title="Forward Lead"
//                         >
//                           <Forward fontSize="small" />
//                         </IconButton>
//                       </Box>
//                       {lead.remarks && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.remarks.substring(0, 30)}...
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setStatusDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {/* Student Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
//                 Student Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Name"
//                 value={statusData.studentName}
//                 onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Number"
//                 value={statusData.studentNumber}
//                 onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Alternate Number"
//                 value={statusData.alternateNumber}
//                 onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email ID"
//                 type="email"
//                 value={statusData.email}
//                 onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
//               />
//             </Grid>

//             {/* Education Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Education Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="12th Subject"
//                 value={statusData.twelfthSubject}
//                 onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current Course"
//                 value={statusData.currentCourse}
//                 onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Exam Preparation"
//                 value={statusData.examPreparation}
//                 onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reference"
//                 value={statusData.reference}
//                 onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
//               />
//             </Grid>

//             {/* Location Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Location Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current City"
//                 value={statusData.currentCity}
//                 onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Preferred City"
//                 value={statusData.preferredCity}
//                 onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
//               />
//             </Grid>

//             {/* Call Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Call Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Interest Level"
//                 value={statusData.interestLevel}
//                 onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
//               >
//                 <MenuItem value="high">High</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="not_interested">Not Interested</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Call Duration (minutes)"
//                 type="number"
//                 value={statusData.callDuration}
//                 onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Next Action"
//                 value={statusData.nextAction}
//                 onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
//               >
//                 <MenuItem value="callback">Call Back</MenuItem>
//                 <MenuItem value="meeting">Schedule Meeting</MenuItem>
//                 <MenuItem value="document">Send Documents</MenuItem>
//                 <MenuItem value="followup">Follow Up</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Budget"
//                 value={statusData.budget}
//                 onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Timeline"
//                 value={statusData.timeline}
//                 onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks & Notes"
//                 multiline
//                 rows={4}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained" color="primary">
//             Update Lead
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Forward Lead Dialog */}
//       <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setForwardDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Forward To</InputLabel>
//                 <Select
//                   value={forwardData.forwardTo}
//                   label="Forward To"
//                   onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
//                 >
//                   <MenuItem value="admin">Admin</MenuItem>
//                   {telecallers.map((telecaller) => (
//                     <MenuItem key={telecaller._id} value={telecaller._id}>
//                       {telecaller.name} ({telecaller.employeeId})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Reason for Forwarding"
//                 value={forwardData.reason}
//                 onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
//               >
//                 <MenuItem value="not_responding">Not Responding</MenuItem>
//                 <MenuItem value="wrong_number">Wrong Number</MenuItem>
//                 <MenuItem value="language_barrier">Language Barrier</MenuItem>
//                 <MenuItem value="special_requirement">Special Requirement</MenuItem>
//                 <MenuItem value="escalation">Escalation</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 multiline
//                 rows={3}
//                 value={forwardData.notes}
//                 onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
//                 placeholder="Add any additional information for the recipient..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleSubmitForward} 
//             variant="contained" 
//             color="secondary"
//             disabled={!forwardData.forwardTo}
//           >
//             Forward Lead
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads


// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Phone,
//   Edit,
//   Forward,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [statusDialog, setStatusDialog] = useState(false)
//   const [forwardDialog, setForwardDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [tabValue, setTabValue] = useState(0) // Added the missing state
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: '',
//     callDuration: '',
//     interestLevel: '',
//     nextAction: '',
//     studentName: '',
//     studentNumber: '',
//     alternateNumber: '',
//     email: '',
//     twelfthSubject: '',
//     currentCity: '',
//     preferredCity: '',
//     examPreparation: '',
//     currentCourse: '',
//     budget: '',
//     timeline: '',
//     reference: ''
//   })
//   const [forwardData, setForwardData] = useState({
//     forwardTo: '',
//     forwardType: 'telecaller',
//     reason: '',
//     notes: ''
//   })

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//   }, [])

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads')
//       setLeads(response.data)
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || '',
//       callDuration: lead.callDuration || '',
//       interestLevel: lead.interestLevel || '',
//       nextAction: lead.nextAction || '',
//       studentName: lead.name || '',
//       studentNumber: lead.phone || '',
//       alternateNumber: lead.alternateNumber || '',
//       email: lead.email || '',
//       twelfthSubject: lead.twelfthSubject || '',
//       currentCity: lead.currentCity || '',
//       preferredCity: lead.preferredCity || '',
//       examPreparation: lead.examPreparation || '',
//       currentCourse: lead.currentCourse || '',
//       budget: lead.budget || '',
//       timeline: lead.timeline || '',
//       reference: lead.reference || ''
//     })
//     setStatusDialog(true)
//   }

//   const handleForwardLead = (lead) => {
//     setSelectedLead(lead)
//     setForwardData({
//       forwardTo: '',
//       forwardType: 'telecaller',
//       reason: '',
//       notes: ''
//     })
//     setForwardDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       await axios.put(`/api/leads/${selectedLead._id}/status`, statusData)
//       await fetchLeads()
//       setStatusDialog(false)
//       setSuccess('Lead status updated successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to update lead status: ' + (error.response?.data?.message || error.message))
//     }
//   }

//   const handleSubmitForward = async () => {
//     try {
//       await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
//       await fetchLeads()
//       setForwardDialog(false)
//       setSuccess('Lead forwarded successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Contact Details</TableCell>
//                 <TableCell>Education</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Last Contact</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         {lead.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Source: {lead.source}
//                       </Typography>
//                       {lead.reference && (
//                         <Typography variant="caption" color="primary">
//                           Ref: {lead.reference}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         📞 {lead.phone}
//                       </Typography>
//                       {lead.alternateNumber && (
//                         <Typography variant="body2" color="text.secondary">
//                           📱 {lead.alternateNumber}
//                         </Typography>
//                       )}
//                       <Typography variant="body2" color="text.secondary">
//                         ✉️ {lead.email}
//                       </Typography>
//                       {lead.city && (
//                         <Typography variant="body2" color="text.secondary">
//                           📍 {lead.city}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.college || 'Not specified'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.course || 'Not specified'}
//                       </Typography>
//                       {lead.examPreparation && (
//                         <Typography variant="caption" color="primary">
//                           Prep: {lead.examPreparation}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                     {lead.interestLevel && (
//                       <Typography variant="caption" display="block" color="text.secondary">
//                         Interest: {lead.interestLevel}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.updatedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {new Date(lead.updatedAt).toLocaleTimeString()}
//                     </Typography>
//                     {lead.followUpDate && (
//                       <Typography variant="caption" color="warning.main">
//                         Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
//                       <Box sx={{ display: 'flex', gap: 0.5 }}>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           title="Call"
//                         >
//                           <Phone fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           onClick={() => handleStatusUpdate(lead)}
//                           title="Update Status"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="secondary"
//                           onClick={() => handleForwardLead(lead)}
//                           title="Forward Lead"
//                         >
//                           <Forward fontSize="small" />
//                         </IconButton>
//                       </Box>
//                       {lead.remarks && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.remarks.substring(0, 30)}...
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setStatusDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {/* Student Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
//                 Student Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Name"
//                 value={statusData.studentName}
//                 onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Number"
//                 value={statusData.studentNumber}
//                 onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Alternate Number"
//                 value={statusData.alternateNumber}
//                 onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email ID"
//                 type="email"
//                 value={statusData.email}
//                 onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
//               />
//             </Grid>

//             {/* Education Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Education Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="12th Subject"
//                 value={statusData.twelfthSubject}
//                 onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current Course"
//                 value={statusData.currentCourse}
//                 onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Exam Preparation"
//                 value={statusData.examPreparation}
//                 onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reference"
//                 value={statusData.reference}
//                 onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
//               />
//             </Grid>

//             {/* Location Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Location Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current City"
//                 value={statusData.currentCity}
//                 onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Preferred City"
//                 value={statusData.preferredCity}
//                 onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
//               />
//             </Grid>

//             {/* Call Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Call Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Interest Level"
//                 value={statusData.interestLevel}
//                 onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
//               >
//                 <MenuItem value="high">High</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="not_interested">Not Interested</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Call Duration (minutes)"
//                 type="number"
//                 value={statusData.callDuration}
//                 onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Next Action"
//                 value={statusData.nextAction}
//                 onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
//               >
//                 <MenuItem value="callback">Call Back</MenuItem>
//                 <MenuItem value="meeting">Schedule Meeting</MenuItem>
//                 <MenuItem value="document">Send Documents</MenuItem>
//                 <MenuItem value="followup">Follow Up</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Budget"
//                 value={statusData.budget}
//                 onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Timeline"
//                 value={statusData.timeline}
//                 onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks & Notes"
//                 multiline
//                 rows={4}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained" color="primary">
//             Update Lead
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Forward Lead Dialog */}
//       <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setForwardDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Forward To</InputLabel>
//                 <Select
//                   value={forwardData.forwardTo}
//                   label="Forward To"
//                   onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
//                 >
//                   <MenuItem value="admin">Admin</MenuItem>
//                   {telecallers.map((telecaller) => (
//                     <MenuItem key={telecaller._id} value={telecaller._id}>
//                       {telecaller.name} ({telecaller.employeeId})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Reason for Forwarding"
//                 value={forwardData.reason}
//                 onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
//               >
//                 <MenuItem value="not_responding">Not Responding</MenuItem>
//                 <MenuItem value="wrong_number">Wrong Number</MenuItem>
//                 <MenuItem value="language_barrier">Language Barrier</MenuItem>
//                 <MenuItem value="special_requirement">Special Requirement</MenuItem>
//                 <MenuItem value="escalation">Escalation</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 multiline
//                 rows={3}
//                 value={forwardData.notes}
//                 onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
//                 placeholder="Add any additional information for the recipient..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleSubmitForward} 
//             variant="contained" 
//             color="secondary"
//             disabled={!forwardData.forwardTo}
//           >
//             Forward Lead
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads


// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Phone,
//   Edit,
//   Forward,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [statusDialog, setStatusDialog] = useState(false)
//   const [forwardDialog, setForwardDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [tabValue, setTabValue] = useState(0)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: '',
//     callDuration: '',
//     interestLevel: '',
//     nextAction: '',
//     studentName: '',
//     studentNumber: '',
//     alternateNumber: '',
//     email: '',
//     twelfthSubject: '',
//     currentCity: '',
//     preferredCity: '',
//     examPreparation: '',
//     currentCourse: '',
//     budget: '',
//     timeline: '',
//     reference: ''
//   })
//   const [forwardData, setForwardData] = useState({
//     forwardTo: '',
//     forwardType: 'telecaller',
//     reason: '',
//     notes: ''
//   })

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//   }, [])

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads')
//       setLeads(response.data)
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || '',
//       callDuration: lead.callDuration || '',
//       interestLevel: lead.interestLevel || '',
//       nextAction: lead.nextAction || '',
//       studentName: lead.name || '',
//       studentNumber: lead.phone || '',
//       alternateNumber: lead.alternateNumber || '',
//       email: lead.email || '',
//       twelfthSubject: lead.twelfthSubject || '',
//       currentCity: lead.currentCity || '',
//       preferredCity: lead.preferredCity || '',
//       examPreparation: lead.examPreparation || '',
//       currentCourse: lead.currentCourse || '',
//       budget: lead.budget || '',
//       timeline: lead.timeline || '',
//       reference: lead.reference || ''
//     })
//     setStatusDialog(true)
//   }

//   const handleForwardLead = (lead) => {
//     setSelectedLead(lead)
//     setForwardData({
//       forwardTo: '',
//       forwardType: 'telecaller',
//       reason: '',
//       notes: ''
//     })
//     setForwardDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       console.log('Updating lead status:', selectedLead._id, statusData);

//       const response = await axios.put(`/api/leads/${selectedLead._id}/status`, statusData);

//       await fetchLeads();
//       setStatusDialog(false);
//       setSuccess('Lead status updated successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       console.error('Update lead status error:', error);

//       // Better error handling
//       if (error.response) {
//         // Server responded with error status
//         const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to update lead status';
//         setError(`Server Error: ${errorMessage}`);
//       } else if (error.request) {
//         // Request was made but no response received
//         setError('Network Error: Please check your connection and try again');
//       } else {
//         // Something else happened
//         setError('Error: ' + error.message);
//       }
//     }
//   }

//   const handleSubmitForward = async () => {
//     try {
//       await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
//       await fetchLeads()
//       setForwardDialog(false)
//       setSuccess('Lead forwarded successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2.4}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Contact Details</TableCell>
//                 <TableCell>Education</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Last Contact</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body1" fontWeight="bold">
//                         {lead.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Source: {lead.source}
//                       </Typography>
//                       {lead.reference && (
//                         <Typography variant="caption" color="primary">
//                           Ref: {lead.reference}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         📞 {lead.phone}
//                       </Typography>
//                       {lead.alternateNumber && (
//                         <Typography variant="body2" color="text.secondary">
//                           📱 {lead.alternateNumber}
//                         </Typography>
//                       )}
//                       <Typography variant="body2" color="text.secondary">
//                         ✉️ {lead.email}
//                       </Typography>
//                       {lead.city && (
//                         <Typography variant="body2" color="text.secondary">
//                           📍 {lead.city}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.college || 'Not specified'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.course || 'Not specified'}
//                       </Typography>
//                       {lead.examPreparation && (
//                         <Typography variant="caption" color="primary">
//                           Prep: {lead.examPreparation}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                     {lead.interestLevel && (
//                       <Typography variant="caption" display="block" color="text.secondary">
//                         Interest: {lead.interestLevel}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.updatedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {new Date(lead.updatedAt).toLocaleTimeString()}
//                     </Typography>
//                     {lead.followUpDate && (
//                       <Typography variant="caption" color="warning.main">
//                         Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
//                       <Box sx={{ display: 'flex', gap: 0.5 }}>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           title="Call"
//                         >
//                           <Phone fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="primary"
//                           onClick={() => handleStatusUpdate(lead)}
//                           title="Update Status"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                         <IconButton 
//                           size="small" 
//                           color="secondary"
//                           onClick={() => handleForwardLead(lead)}
//                           title="Forward Lead"
//                         >
//                           <Forward fontSize="small" />
//                         </IconButton>
//                       </Box>
//                       {lead.remarks && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.remarks.substring(0, 30)}...
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setStatusDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {/* Student Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
//                 Student Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Name"
//                 value={statusData.studentName}
//                 onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Number"
//                 value={statusData.studentNumber}
//                 onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Alternate Number"
//                 value={statusData.alternateNumber}
//                 onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email ID"
//                 type="email"
//                 value={statusData.email}
//                 onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
//               />
//             </Grid>

//             {/* Education Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Education Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="12th Subject"
//                 value={statusData.twelfthSubject}
//                 onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current Course"
//                 value={statusData.currentCourse}
//                 onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Exam Preparation"
//                 value={statusData.examPreparation}
//                 onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reference"
//                 value={statusData.reference}
//                 onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
//               />
//             </Grid>

//             {/* Location Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Location Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current City"
//                 value={statusData.currentCity}
//                 onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Preferred City"
//                 value={statusData.preferredCity}
//                 onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
//               />
//             </Grid>

//             {/* Call Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Call Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Interest Level"
//                 value={statusData.interestLevel}
//                 onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
//               >
//                 <MenuItem value="high">High</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="not_interested">Not Interested</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Call Duration (minutes)"
//                 type="number"
//                 value={statusData.callDuration}
//                 onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Next Action"
//                 value={statusData.nextAction}
//                 onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
//               >
//                 <MenuItem value="callback">Call Back</MenuItem>
//                 <MenuItem value="meeting">Schedule Meeting</MenuItem>
//                 <MenuItem value="document">Send Documents</MenuItem>
//                 <MenuItem value="followup">Follow Up</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Budget"
//                 value={statusData.budget}
//                 onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Timeline"
//                 value={statusData.timeline}
//                 onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks & Notes"
//                 multiline
//                 rows={4}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained" color="primary">
//             Update Lead
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Forward Lead Dialog */}
//       <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setForwardDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Forward To</InputLabel>
//                 <Select
//                   value={forwardData.forwardTo}
//                   label="Forward To"
//                   onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
//                 >
//                   <MenuItem value="admin">Admin</MenuItem>
//                   {telecallers.map((telecaller) => (
//                     <MenuItem key={telecaller._id} value={telecaller._id}>
//                       {telecaller.name} ({telecaller.employeeId})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Reason for Forwarding"
//                 value={forwardData.reason}
//                 onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
//               >
//                 <MenuItem value="not_responding">Not Responding</MenuItem>
//                 <MenuItem value="wrong_number">Wrong Number</MenuItem>
//                 <MenuItem value="language_barrier">Language Barrier</MenuItem>
//                 <MenuItem value="special_requirement">Special Requirement</MenuItem>
//                 <MenuItem value="escalation">Escalation</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 multiline
//                 rows={3}
//                 value={forwardData.notes}
//                 onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
//                 placeholder="Add any additional information for the recipient..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleSubmitForward} 
//             variant="contained" 
//             color="secondary"
//             disabled={!forwardData.forwardTo}
//           >
//             Forward Lead
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads


// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Phone,
//   Edit,
//   Forward,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [forwardedLeads, setForwardedLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [statusDialog, setStatusDialog] = useState(false)
//   const [forwardDialog, setForwardDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [tabValue, setTabValue] = useState(0)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: '',
//     callDuration: '',
//     interestLevel: '',
//     nextAction: '',
//     studentName: '',
//     studentNumber: '',
//     alternateNumber: '',
//     email: '',
//     twelfthSubject: '',
//     currentCity: '',
//     preferredCity: '',
//     examPreparation: '',
//     currentCourse: '',
//     budget: '',
//     timeline: '',
//     reference: ''
//   })
//   const [forwardData, setForwardData] = useState({
//     forwardTo: '',
//     forwardType: 'telecaller',
//     reason: '',
//     notes: ''
//   })

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//   }, [tabValue]) // Refetch when tab changes

//   const fetchLeads = async () => {
//     try {
//       if (tabValue === 5) {
//         // Fetch forwarded leads for telecaller
//         const [myForwardsResponse, receivedResponse] = await Promise.all([
//           axios.get('/api/leads/forwarded/my-forwards'),
//           axios.get('/api/leads/forwarded/received')
//         ])
//         // Combine both forwarded by me and received leads
//         const combinedLeads = [...myForwardsResponse.data, ...receivedResponse.data]
//         setForwardedLeads(combinedLeads)
//       } else {
//         const response = await axios.get('/api/leads')
//         setLeads(response.data)
//       }
//     } catch (error) {
//       setError('Failed to fetch leads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       setTelecallers(response.data)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || '',
//       callDuration: lead.callDuration || '',
//       interestLevel: lead.interestLevel || '',
//       nextAction: lead.nextAction || '',
//       studentName: lead.name || '',
//       studentNumber: lead.phone || '',
//       alternateNumber: lead.alternateNumber || '',
//       email: lead.email || '',
//       twelfthSubject: lead.twelfthSubject || '',
//       currentCity: lead.currentCity || '',
//       preferredCity: lead.preferredCity || '',
//       examPreparation: lead.examPreparation || '',
//       currentCourse: lead.currentCourse || '',
//       budget: lead.budget || '',
//       timeline: lead.timeline || '',
//       reference: lead.reference || ''
//     })
//     setStatusDialog(true)
//   }

//   const handleForwardLead = (lead) => {
//     setSelectedLead(lead)
//     setForwardData({
//       forwardTo: '',
//       forwardType: 'telecaller',
//       reason: '',
//       notes: ''
//     })
//     setForwardDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       console.log('Updating lead status:', selectedLead._id, statusData);

//       const response = await axios.put(`/api/leads/${selectedLead._id}/status`, statusData);

//       await fetchLeads();
//       setStatusDialog(false);
//       setSuccess('Lead status updated successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       console.error('Update lead status error:', error);

//       if (error.response) {
//         const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to update lead status';
//         setError(`Server Error: ${errorMessage}`);
//       } else if (error.request) {
//         setError('Network Error: Please check your connection and try again');
//       } else {
//         setError('Error: ' + error.message);
//       }
//     }
//   }

//   const handleSubmitForward = async () => {
//     try {
//       await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
//       await fetchLeads()
//       setForwardDialog(false)
//       setSuccess('Lead forwarded successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       case 5: return true // Forwarded leads handled separately
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length,
//     forwarded: forwardedLeads.length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="secondary.main">
//                 {stats.forwarded}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Forwarded
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//           <Tab label="Forwarded Leads" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {tabValue === 5 ? (
//                   // Forwarded Leads Table Headers
//                   <>
//                     <TableCell>Lead Information</TableCell>
//                     <TableCell>Forwarded By</TableCell>
//                     <TableCell>Forwarded To</TableCell>
//                     <TableCell>Reason</TableCell>
//                     <TableCell>Forward Date</TableCell>
//                     <TableCell>Current Status</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </>
//                 ) : (
//                   // Regular Leads Table Headers
//                   <>
//                     <TableCell>Lead Information</TableCell>
//                     <TableCell>Contact Details</TableCell>
//                     <TableCell>Education</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Last Contact</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tabValue === 5 ? (
//                 // Forwarded Leads Table Body
//                 forwardedLeads.map((lead) => (
//                   <TableRow key={lead._id}>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body1" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.phone} • {lead.email}
//                         </Typography>
//                         {lead.college && (
//                           <Typography variant="caption" color="text.secondary">
//                             {lead.college}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="bold">
//                         {lead.forwardedBy ? lead.forwardedBy.name : 'System'}
//                       </Typography>
//                       {lead.forwardedBy && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardedBy.employeeId}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="bold">
//                         {lead.forwardedTo ? lead.forwardedTo.name : 'Admin'}
//                       </Typography>
//                       {lead.forwardedTo && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardedTo.employeeId}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {lead.forwardReason}
//                       </Typography>
//                       {lead.forwardNotes && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardNotes}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {new Date(lead.forwardedAt).toLocaleDateString()}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {new Date(lead.forwardedAt).toLocaleTimeString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.status}
//                         color={getStatusColor(lead.status)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton
//                           size="small"
//                           color="primary"
//                           onClick={() => handleStatusUpdate(lead)}
//                           title="Update Status"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 // Regular Leads Table Body
//                 filteredLeads.map((lead) => (
//                   <TableRow key={lead._id}>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body1" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Source: {lead.source}
//                         </Typography>
//                         {lead.reference && (
//                           <Typography variant="caption" color="primary">
//                             Ref: {lead.reference}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body2">
//                           📞 {lead.phone}
//                         </Typography>
//                         {lead.alternateNumber && (
//                           <Typography variant="body2" color="text.secondary">
//                             📱 {lead.alternateNumber}
//                           </Typography>
//                         )}
//                         <Typography variant="body2" color="text.secondary">
//                           ✉️ {lead.email}
//                         </Typography>
//                         {lead.city && (
//                           <Typography variant="body2" color="text.secondary">
//                             📍 {lead.city}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body2">
//                           {lead.college || 'Not specified'}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course || 'Not specified'}
//                         </Typography>
//                         {lead.examPreparation && (
//                           <Typography variant="caption" color="primary">
//                             Prep: {lead.examPreparation}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.status}
//                         color={getStatusColor(lead.status)}
//                         size="small"
//                       />
//                       {lead.interestLevel && (
//                         <Typography variant="caption" display="block" color="text.secondary">
//                           Interest: {lead.interestLevel}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {new Date(lead.updatedAt).toLocaleDateString()}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {new Date(lead.updatedAt).toLocaleTimeString()}
//                       </Typography>
//                       {lead.followUpDate && (
//                         <Typography variant="caption" color="warning.main">
//                           Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
//                         <Box sx={{ display: 'flex', gap: 0.5 }}>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             title="Call"
//                           >
//                             <Phone fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleStatusUpdate(lead)}
//                             title="Update Status"
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="secondary"
//                             onClick={() => handleForwardLead(lead)}
//                             title="Forward Lead"
//                           >
//                             <Forward fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         {lead.remarks && (
//                           <Typography variant="caption" color="text.secondary">
//                             {lead.remarks.substring(0, 30)}...
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//               {tabValue === 5 && forwardedLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Box sx={{ py: 4 }}>
//                       <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                       <Typography variant="body1" color="text.secondary">
//                         No forwarded leads found
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Leads you forward or receive from others will appear here
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               )}
//               {tabValue !== 5 && filteredLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     <Typography variant="body2" color="text.secondary">
//                       No leads found in this category
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setStatusDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {/* Student Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
//                 Student Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Name"
//                 value={statusData.studentName}
//                 onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Number"
//                 value={statusData.studentNumber}
//                 onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Alternate Number"
//                 value={statusData.alternateNumber}
//                 onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email ID"
//                 type="email"
//                 value={statusData.email}
//                 onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
//               />
//             </Grid>

//             {/* Education Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Education Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="12th Subject"
//                 value={statusData.twelfthSubject}
//                 onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current Course"
//                 value={statusData.currentCourse}
//                 onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Exam Preparation"
//                 value={statusData.examPreparation}
//                 onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reference"
//                 value={statusData.reference}
//                 onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
//               />
//             </Grid>

//             {/* Location Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Location Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current City"
//                 value={statusData.currentCity}
//                 onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Preferred City"
//                 value={statusData.preferredCity}
//                 onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
//               />
//             </Grid>

//             {/* Call Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Call Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Interest Level"
//                 value={statusData.interestLevel}
//                 onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
//               >
//                 <MenuItem value="high">High</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="not_interested">Not Interested</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Call Duration (minutes)"
//                 type="number"
//                 value={statusData.callDuration}
//                 onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Next Action"
//                 value={statusData.nextAction}
//                 onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
//               >
//                 <MenuItem value="callback">Call Back</MenuItem>
//                 <MenuItem value="meeting">Schedule Meeting</MenuItem>
//                 <MenuItem value="document">Send Documents</MenuItem>
//                 <MenuItem value="followup">Follow Up</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Budget"
//                 value={statusData.budget}
//                 onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Timeline"
//                 value={statusData.timeline}
//                 onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks & Notes"
//                 multiline
//                 rows={4}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained" color="primary">
//             Update Lead
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Forward Lead Dialog */}
//       <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setForwardDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Forward To</InputLabel>
//                 <Select
//                   value={forwardData.forwardTo}
//                   label="Forward To"
//                   onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
//                 >
//                   <MenuItem value="admin">Admin</MenuItem>
//                   {telecallers.map((telecaller) => (
//                     <MenuItem key={telecaller._id} value={telecaller._id}>
//                       {telecaller.name} ({telecaller.employeeId})
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Reason for Forwarding"
//                 value={forwardData.reason}
//                 onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
//               >
//                 <MenuItem value="not_responding">Not Responding</MenuItem>
//                 <MenuItem value="wrong_number">Wrong Number</MenuItem>
//                 <MenuItem value="language_barrier">Language Barrier</MenuItem>
//                 <MenuItem value="special_requirement">Special Requirement</MenuItem>
//                 <MenuItem value="escalation">Escalation</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 multiline
//                 rows={3}
//                 value={forwardData.notes}
//                 onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
//                 placeholder="Add any additional information for the recipient..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleSubmitForward}
//             variant="contained"
//             color="secondary"
//             disabled={!forwardData.forwardTo}
//           >
//             Forward Lead
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads



// import React, { useState, useEffect } from 'react'
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Grid,
//   Alert,
//   CircularProgress,
//   Tabs,
//   Tab,
//   Card,
//   CardContent,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Phone,
//   Edit,
//   Forward,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const TelecallerLeads = () => {
//   const [leads, setLeads] = useState([])
//   const [forwardedLeads, setForwardedLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [statusDialog, setStatusDialog] = useState(false)
//   const [forwardDialog, setForwardDialog] = useState(false)
//   const [selectedLead, setSelectedLead] = useState(null)
//   const [tabValue, setTabValue] = useState(0)
//   const [statusData, setStatusData] = useState({
//     status: '',
//     remarks: '',
//     followUpDate: '',
//     callDuration: '',
//     interestLevel: '',
//     nextAction: '',
//     studentName: '',
//     studentNumber: '',
//     alternateNumber: '',
//     email: '',
//     twelfthSubject: '',
//     currentCity: '',
//     preferredCity: '',
//     examPreparation: '',
//     currentCourse: '',
//     budget: '',
//     timeline: '',
//     reference: ''
//   })
//   const [forwardData, setForwardData] = useState({
//     forwardTo: '',
//     reason: '',
//     notes: ''
//   })

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//   }, [tabValue])

//   const fetchLeads = async () => {
//     try {
//       if (tabValue === 5) {
//         // Fetch forwarded leads for telecaller
//         const [myForwardsResponse, receivedResponse] = await Promise.all([
//           axios.get('/api/leads/forwarded/my-forwards'),
//           axios.get('/api/leads/forwarded/received')
//         ])
//         // Combine both forwarded by me and received leads
//         const combinedLeads = [...myForwardsResponse.data, ...receivedResponse.data]
//         setForwardedLeads(combinedLeads)
//       } else {
//         const response = await axios.get('/api/leads')
//         setLeads(response.data)
//       }
//     } catch (error) {
//       setError('Failed to fetch leads: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchTelecallers = async () => {
//     try {
//       const response = await axios.get('/api/users?role=telecaller')
//       // Filter out current user from telecallers list to prevent self-forwarding
//       const filteredTelecallers = response.data.filter(telecaller => 
//         telecaller._id !== JSON.parse(localStorage.getItem('user'))?._id
//       )
//       setTelecallers(filteredTelecallers)
//     } catch (error) {
//       console.error('Failed to fetch telecallers')
//     }
//   }

//   const handleStatusUpdate = (lead) => {
//     setSelectedLead(lead)
//     setStatusData({
//       status: lead.status,
//       remarks: lead.remarks || '',
//       followUpDate: lead.followUpDate || '',
//       callDuration: lead.callDuration || '',
//       interestLevel: lead.interestLevel || '',
//       nextAction: lead.nextAction || '',
//       studentName: lead.name || '',
//       studentNumber: lead.phone || '',
//       alternateNumber: lead.alternateNumber || '',
//       email: lead.email || '',
//       twelfthSubject: lead.twelfthSubject || '',
//       currentCity: lead.currentCity || '',
//       preferredCity: lead.preferredCity || '',
//       examPreparation: lead.examPreparation || '',
//       currentCourse: lead.currentCourse || '',
//       budget: lead.budget || '',
//       timeline: lead.timeline || '',
//       reference: lead.reference || ''
//     })
//     setStatusDialog(true)
//   }

//   const handleForwardLead = (lead) => {
//     setSelectedLead(lead)
//     setForwardData({
//       forwardTo: '',
//       reason: '',
//       notes: ''
//     })
//     setForwardDialog(true)
//   }

//   const handleSubmitStatus = async () => {
//     try {
//       console.log('Updating lead status:', selectedLead._id, statusData);

//       const response = await axios.put(`/api/leads/${selectedLead._id}/status`, statusData);

//       await fetchLeads();
//       setStatusDialog(false);
//       setSuccess('Lead status updated successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (error) {
//       console.error('Update lead status error:', error);

//       if (error.response) {
//         const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to update lead status';
//         setError(`Server Error: ${errorMessage}`);
//       } else if (error.request) {
//         setError('Network Error: Please check your connection and try again');
//       } else {
//         setError('Error: ' + error.message);
//       }
//     }
//   }

//   const handleSubmitForward = async () => {
//     try {
//       if (!forwardData.forwardTo) {
//         setError('Please select someone to forward the lead to');
//         return;
//       }

//       await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
//       await fetchLeads()
//       setForwardDialog(false)
//       setSuccess('Lead forwarded successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
//     }
//   }

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

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'assigned' || lead.status === 'contacted'
//       case 1: return lead.status === 'hot'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'future'
//       case 4: return lead.status === 'dead'
//       case 5: return true // Forwarded leads handled separately
//       default: return true
//     }
//   })

//   const stats = {
//     total: leads.length,
//     assigned: leads.filter(l => l.status === 'assigned').length,
//     contacted: leads.filter(l => l.status === 'contacted').length,
//     hot: leads.filter(l => l.status === 'hot').length,
//     converted: leads.filter(l => l.status === 'converted').length,
//     forwarded: forwardedLeads.length
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
//         My Leads
//       </Typography>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}

//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Quick Stats */}
//       <Grid container spacing={2} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="primary">
//                 {stats.total}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Total
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="info.main">
//                 {stats.assigned}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Assigned
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="warning.main">
//                 {stats.contacted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Contacted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="error.main">
//                 {stats.hot}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Hot
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="success.main">
//                 {stats.converted}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Converted
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={2}>
//           <Card>
//             <CardContent sx={{ textAlign: 'center' }}>
//               <Typography variant="h6" color="secondary.main">
//                 {stats.forwarded}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Forwarded
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Paper>
//         <Tabs
//           value={tabValue}
//           onChange={(e, newValue) => setTabValue(newValue)}
//           sx={{ borderBottom: 1, borderColor: 'divider' }}
//         >
//           <Tab label="Active Leads" />
//           <Tab label="Hot Leads" />
//           <Tab label="Converted" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//           <Tab label="Forwarded Leads" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {tabValue === 5 ? (
//                   // Forwarded Leads Table Headers
//                   <>
//                     <TableCell>Lead Information</TableCell>
//                     <TableCell>Forwarded By</TableCell>
//                     <TableCell>Forwarded To</TableCell>
//                     <TableCell>Reason</TableCell>
//                     <TableCell>Forward Date</TableCell>
//                     <TableCell>Current Status</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </>
//                 ) : (
//                   // Regular Leads Table Headers
//                   <>
//                     <TableCell>Lead Information</TableCell>
//                     <TableCell>Contact Details</TableCell>
//                     <TableCell>Education</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Last Contact</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tabValue === 5 ? (
//                 // Forwarded Leads Table Body
//                 forwardedLeads.map((lead) => (
//                   <TableRow key={lead._id}>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body1" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.phone} • {lead.email}
//                         </Typography>
//                         {lead.college && (
//                           <Typography variant="caption" color="text.secondary">
//                             {lead.college}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="bold">
//                         {lead.forwardedBy ? lead.forwardedBy.name : 'System'}
//                       </Typography>
//                       {lead.forwardedBy && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardedBy.employeeId}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" fontWeight="bold">
//                         {lead.forwardedTo ? lead.forwardedTo.name : 'Admin'}
//                       </Typography>
//                       {lead.forwardedTo && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardedTo.employeeId}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {lead.forwardReason}
//                       </Typography>
//                       {lead.forwardNotes && (
//                         <Typography variant="caption" color="text.secondary">
//                           {lead.forwardNotes}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {new Date(lead.forwardedAt).toLocaleDateString()}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {new Date(lead.forwardedAt).toLocaleTimeString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.status}
//                         color={getStatusColor(lead.status)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton
//                           size="small"
//                           color="primary"
//                           onClick={() => handleStatusUpdate(lead)}
//                           title="Update Status"
//                         >
//                           <Edit fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 // Regular Leads Table Body
//                 filteredLeads.map((lead) => (
//                   <TableRow key={lead._id}>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body1" fontWeight="bold">
//                           {lead.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           Source: {lead.source}
//                         </Typography>
//                         {lead.reference && (
//                           <Typography variant="caption" color="primary">
//                             Ref: {lead.reference}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body2">
//                           📞 {lead.phone}
//                         </Typography>
//                         {lead.alternateNumber && (
//                           <Typography variant="body2" color="text.secondary">
//                             📱 {lead.alternateNumber}
//                           </Typography>
//                         )}
//                         <Typography variant="body2" color="text.secondary">
//                           ✉️ {lead.email}
//                         </Typography>
//                         {lead.city && (
//                           <Typography variant="body2" color="text.secondary">
//                             📍 {lead.city}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body2">
//                           {lead.college || 'Not specified'}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course || 'Not specified'}
//                         </Typography>
//                         {lead.examPreparation && (
//                           <Typography variant="caption" color="primary">
//                             Prep: {lead.examPreparation}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.status}
//                         color={getStatusColor(lead.status)}
//                         size="small"
//                       />
//                       {lead.interestLevel && (
//                         <Typography variant="caption" display="block" color="text.secondary">
//                           Interest: {lead.interestLevel}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {new Date(lead.updatedAt).toLocaleDateString()}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {new Date(lead.updatedAt).toLocaleTimeString()}
//                       </Typography>
//                       {lead.followUpDate && (
//                         <Typography variant="caption" color="warning.main">
//                           Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
//                         <Box sx={{ display: 'flex', gap: 0.5 }}>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             title="Call"
//                           >
//                             <Phone fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleStatusUpdate(lead)}
//                             title="Update Status"
//                           >
//                             <Edit fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             color="secondary"
//                             onClick={() => handleForwardLead(lead)}
//                             title="Forward Lead"
//                           >
//                             <Forward fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         {lead.remarks && (
//                           <Typography variant="caption" color="text.secondary">
//                             {lead.remarks.substring(0, 30)}...
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//               {tabValue === 5 && forwardedLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Box sx={{ py: 4 }}>
//                       <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                       <Typography variant="body1" color="text.secondary">
//                         No forwarded leads found
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Leads you forward or receive from others will appear here
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               )}
//               {tabValue !== 5 && filteredLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center">
//                     <Typography variant="body2" color="text.secondary">
//                       No leads found in this category
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Update Status Dialog */}
//       <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setStatusDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             {/* Student Information */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
//                 Student Information
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Name"
//                 value={statusData.studentName}
//                 onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Student Number"
//                 value={statusData.studentNumber}
//                 onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Alternate Number"
//                 value={statusData.alternateNumber}
//                 onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email ID"
//                 type="email"
//                 value={statusData.email}
//                 onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
//               />
//             </Grid>

//             {/* Education Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Education Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="12th Subject"
//                 value={statusData.twelfthSubject}
//                 onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current Course"
//                 value={statusData.currentCourse}
//                 onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Exam Preparation"
//                 value={statusData.examPreparation}
//                 onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Reference"
//                 value={statusData.reference}
//                 onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
//               />
//             </Grid>

//             {/* Location Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Location Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Current City"
//                 value={statusData.currentCity}
//                 onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Preferred City"
//                 value={statusData.preferredCity}
//                 onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
//               />
//             </Grid>

//             {/* Call Details */}
//             <Grid item xs={12}>
//               <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
//                 Call Details
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Status"
//                 value={statusData.status}
//                 onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
//               >
//                 <MenuItem value="contacted">Contacted</MenuItem>
//                 <MenuItem value="hot">Hot Lead</MenuItem>
//                 <MenuItem value="converted">Converted</MenuItem>
//                 <MenuItem value="future">Future Prospect</MenuItem>
//                 <MenuItem value="dead">Dead Lead</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Interest Level"
//                 value={statusData.interestLevel}
//                 onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
//               >
//                 <MenuItem value="high">High</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="not_interested">Not Interested</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Call Duration (minutes)"
//                 type="number"
//                 value={statusData.callDuration}
//                 onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Next Action"
//                 value={statusData.nextAction}
//                 onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
//               >
//                 <MenuItem value="callback">Call Back</MenuItem>
//                 <MenuItem value="meeting">Schedule Meeting</MenuItem>
//                 <MenuItem value="document">Send Documents</MenuItem>
//                 <MenuItem value="followup">Follow Up</MenuItem>
//                 <MenuItem value="closed">Closed</MenuItem>
//               </TextField>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Budget"
//                 value={statusData.budget}
//                 onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Timeline"
//                 value={statusData.timeline}
//                 onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Follow-up Date"
//                 type="date"
//                 value={statusData.followUpDate}
//                 onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Remarks & Notes"
//                 multiline
//                 rows={4}
//                 value={statusData.remarks}
//                 onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
//                 placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
//           <Button onClick={handleSubmitStatus} variant="contained" color="primary">
//             Update Lead
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Enhanced Forward Lead Dialog */}
//       <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
//             <IconButton onClick={() => setForwardDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <FormControl fullWidth>
//                 <InputLabel>Forward To</InputLabel>
//                 <Select
//                   value={forwardData.forwardTo}
//                   label="Forward To"
//                   onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
//                 >
//                   {/* Admin Option */}
//                   <MenuItem value="admin">
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                       <Box sx={{ 
//                         width: 8, 
//                         height: 8, 
//                         borderRadius: '50%', 
//                         bgcolor: 'primary.main' 
//                       }} />
//                       <Box>
//                         <Typography variant="body1" fontWeight="bold">
//                           Admin
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           Unassign lead and send to admin pool
//                         </Typography>
//                       </Box>
//                     </Box>
//                   </MenuItem>

//                   {/* Divider */}
//                   <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 1 }} />

//                   {/* Telecaller Options */}
//                   <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
//                     Forward to Telecaller:
//                   </Typography>

//                   {telecallers.map((telecaller) => (
//                     <MenuItem key={telecaller._id} value={telecaller._id}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Box sx={{ 
//                           width: 8, 
//                           height: 8, 
//                           borderRadius: '50%', 
//                           bgcolor: 'success.main' 
//                         }} />
//                         <Box>
//                           <Typography variant="body1">
//                             {telecaller.name}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {telecaller.employeeId} • {telecaller.department || 'Telecaller'}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 select
//                 label="Reason for Forwarding"
//                 value={forwardData.reason}
//                 onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
//               >
//                 <MenuItem value="not_responding">Not Responding</MenuItem>
//                 <MenuItem value="wrong_number">Wrong Number</MenuItem>
//                 <MenuItem value="language_barrier">Language Barrier</MenuItem>
//                 <MenuItem value="special_requirement">Special Requirement</MenuItem>
//                 <MenuItem value="escalation">Escalation</MenuItem>
//                 <MenuItem value="transfer_territory">Transfer Territory</MenuItem>
//                 <MenuItem value="expertise_required">Specific Expertise Required</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </TextField>
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Additional Notes"
//                 multiline
//                 rows={3}
//                 value={forwardData.notes}
//                 onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
//                 placeholder={
//                   forwardData.forwardTo === 'admin' 
//                     ? "Explain why this lead should be returned to admin pool..."
//                     : "Add any additional information for the receiving telecaller..."
//                 }
//               />
//             </Grid>

//             {/* Information Box */}
//             <Grid item xs={12}>
//               <Box sx={{ 
//                 p: 2, 
//                 bgcolor: 'info.light', 
//                 borderRadius: 1,
//                 border: 1,
//                 borderColor: 'info.main'
//               }}>
//                 <Typography variant="body2" fontWeight="bold" color="info.dark" gutterBottom>
//                   Forwarding Information:
//                 </Typography>
//                 {forwardData.forwardTo === 'admin' ? (
//                   <Typography variant="caption" color="info.dark">
//                     • Lead will be unassigned and returned to admin pool
//                     <br />
//                     • Status will be reset to "New"
//                     <br />
//                     • Admin can reassign to any telecaller
//                   </Typography>
//                 ) : forwardData.forwardTo ? (
//                   <Typography variant="caption" color="info.dark">
//                     • Lead will be transferred to selected telecaller
//                     <br />
//                     • Status will remain "Assigned"
//                     <br />
//                     • You will no longer have access to this lead
//                   </Typography>
//                 ) : (
//                   <Typography variant="caption" color="info.dark">
//                     Select whether to forward to Admin or another Telecaller
//                   </Typography>
//                 )}
//               </Box>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleSubmitForward}
//             variant="contained"
//             color="secondary"
//             disabled={!forwardData.forwardTo}
//             startIcon={<Forward />}
//           >
//             {forwardData.forwardTo === 'admin' ? 'Forward to Admin' : 'Forward to Telecaller'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default TelecallerLeads

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import {
  Phone,
  Edit,
  Forward,
  Close
} from '@mui/icons-material'
import axios from 'axios'

const TelecallerLeads = () => {
  const [leads, setLeads] = useState([])
  const [forwardedLeads, setForwardedLeads] = useState([])
  const [telecallers, setTelecallers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [statusDialog, setStatusDialog] = useState(false)
  const [forwardDialog, setForwardDialog] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [statusData, setStatusData] = useState({
    status: '',
    remarks: '',
    followUpDate: '',
    callDuration: '',
    interestLevel: '',
    nextAction: '',
    studentName: '',
    studentNumber: '',
    alternateNumber: '',
    email: '',
    twelfthSubject: '',
    currentCity: '',
    preferredCity: '',
    examPreparation: '',
    currentCourse: '',
    budget: '',
    timeline: '',
    reference: ''
  })
  const [forwardData, setForwardData] = useState({
    forwardTo: '',
    reason: '',
    notes: ''
  })

  useEffect(() => {
    fetchLeads()
    fetchTelecallers()
  }, [tabValue])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      if (tabValue === 5) {
        // Fetch forwarded leads for telecaller
        const [myForwardsResponse, receivedResponse] = await Promise.all([
          axios.get('/api/leads/forwarded/my-forwards'),
          axios.get('/api/leads/forwarded/received')
        ])
        // Combine both forwarded by me and received leads
        const combinedLeads = [...myForwardsResponse.data, ...receivedResponse.data]
        setForwardedLeads(combinedLeads)
      } else {
        const response = await axios.get('/api/leads')
        setLeads(response.data)
      }
    } catch (error) {
      setError('Failed to fetch leads: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTelecallers = async () => {
  try {
    // CORRECT ENDPOINT - leads route mein hai
    const response = await axios.get('/api/leads/users/telecallers')
    setTelecallers(response.data)
  } catch (error) {
    console.error('Failed to fetch telecallers:', error)
    
    // Fallback: Try to get from users endpoint with filter
    try {
      const response = await axios.get('/api/users')
      const filteredTelecallers = response.data.filter(user => 
        (user.role === 'telecaller' || (user.role === 'employee' && user.department === 'telecalling')) &&
        user._id !== JSON.parse(localStorage.getItem('user'))?._id
      )
      setTelecallers(filteredTelecallers)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      setError('Failed to load telecallers list')
    }
  }
}

  const handleStatusUpdate = (lead) => {
    setSelectedLead(lead)
    setStatusData({
      status: lead.status,
      remarks: lead.remarks || '',
      followUpDate: lead.followUpDate || '',
      callDuration: lead.callDuration || '',
      interestLevel: lead.interestLevel || '',
      nextAction: lead.nextAction || '',
      studentName: lead.name || '',
      studentNumber: lead.phone || '',
      alternateNumber: lead.alternateNumber || '',
      email: lead.email || '',
      twelfthSubject: lead.twelfthSubject || '',
      currentCity: lead.currentCity || '',
      preferredCity: lead.preferredCity || '',
      examPreparation: lead.examPreparation || '',
      currentCourse: lead.currentCourse || '',
      budget: lead.budget || '',
      timeline: lead.timeline || '',
      reference: lead.reference || ''
    })
    setStatusDialog(true)
  }

  const handleForwardLead = (lead) => {
    setSelectedLead(lead)
    setForwardData({
      forwardTo: '',
      reason: '',
      notes: ''
    })
    setForwardDialog(true)
  }

  const handleSubmitStatus = async () => {
    try {
      console.log('Updating lead status:', selectedLead._id, statusData);

      const response = await axios.put(`/api/leads/${selectedLead._id}/status`, statusData);

      await fetchLeads();
      setStatusDialog(false);
      setSuccess('Lead status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Update lead status error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to update lead status';
        setError(`Server Error: ${errorMessage}`);
      } else if (error.request) {
        setError('Network Error: Please check your connection and try again');
      } else {
        setError('Error: ' + error.message);
      }
    }
  }

  const handleSubmitForward = async () => {
    try {
      if (!forwardData.forwardTo) {
        setError('Please select someone to forward the lead to');
        return;
      }

      await axios.post(`/api/leads/${selectedLead._id}/forward`, forwardData)
      await fetchLeads()
      setForwardDialog(false)
      setSuccess('Lead forwarded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to forward lead: ' + (error.response?.data?.message || error.message))
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

  const filteredLeads = leads.filter(lead => {
    switch (tabValue) {
      case 0: return lead.status === 'assigned' || lead.status === 'contacted'
      case 1: return lead.status === 'hot'
      case 2: return lead.status === 'converted'
      case 3: return lead.status === 'future'
      case 4: return lead.status === 'dead'
      case 5: return true // Forwarded leads handled separately
      default: return true
    }
  })

  const stats = {
    total: leads.length,
    assigned: leads.filter(l => l.status === 'assigned').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    hot: leads.filter(l => l.status === 'hot').length,
    converted: leads.filter(l => l.status === 'converted').length,
    forwarded: forwardedLeads.length
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
        My Leads
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {stats.assigned}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Assigned
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {stats.contacted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contacted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error.main">
                {stats.hot}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hot
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {stats.converted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Converted
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="secondary.main">
                {stats.forwarded}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Forwarded
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Active Leads" />
          <Tab label="Hot Leads" />
          <Tab label="Converted" />
          <Tab label="Future" />
          <Tab label="Dead" />
          <Tab label="Forwarded Leads" />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tabValue === 5 ? (
                  // Forwarded Leads Table Headers
                  <>
                    <TableCell>Lead Information</TableCell>
                    <TableCell>Forwarded By</TableCell>
                    <TableCell>Forwarded To</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Forward Date</TableCell>
                    <TableCell>Current Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                ) : (
                  // Regular Leads Table Headers
                  <>
                    <TableCell>Lead Information</TableCell>
                    <TableCell>Contact Details</TableCell>
                    <TableCell>Education</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Contact</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tabValue === 5 ? (
                // Forwarded Leads Table Body
                forwardedLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <Box>
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
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {lead.forwardedBy ? lead.forwardedBy.name : 'System'}
                        </Typography>
                        {lead.forwardedBy && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {lead.forwardedBy.employeeId}
                            </Typography>
                            {lead.forwardedBy.department && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {lead.forwardedBy.department}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {lead.forwardedTo ? lead.forwardedTo.name : 'Admin Pool'}
                        </Typography>
                        {lead.forwardedTo && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {lead.forwardedTo.employeeId}
                            </Typography>
                            {lead.forwardedTo.department && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {lead.forwardedTo.department}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Box>
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleStatusUpdate(lead)}
                          title="Update Status"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Regular Leads Table Body
                filteredLeads.map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {lead.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Source: {lead.source}
                        </Typography>
                        {lead.reference && (
                          <Typography variant="caption" color="primary">
                            Ref: {lead.reference}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          📞 {lead.phone}
                        </Typography>
                        {lead.alternateNumber && (
                          <Typography variant="body2" color="text.secondary">
                            📱 {lead.alternateNumber}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          ✉️ {lead.email}
                        </Typography>
                        {lead.city && (
                          <Typography variant="body2" color="text.secondary">
                            📍 {lead.city}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {lead.college || 'Not specified'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {lead.course || 'Not specified'}
                        </Typography>
                        {lead.examPreparation && (
                          <Typography variant="caption" color="primary">
                            Prep: {lead.examPreparation}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status}
                        color={getStatusColor(lead.status)}
                        size="small"
                      />
                      {lead.interestLevel && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Interest: {lead.interestLevel}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(lead.updatedAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(lead.updatedAt).toLocaleTimeString()}
                      </Typography>
                      {lead.followUpDate && (
                        <Typography variant="caption" color="warning.main">
                          Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Call"
                          >
                            <Phone fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleStatusUpdate(lead)}
                            title="Update Status"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleForwardLead(lead)}
                            title="Forward Lead"
                          >
                            <Forward fontSize="small" />
                          </IconButton>
                        </Box>
                        {lead.remarks && (
                          <Typography variant="caption" color="text.secondary">
                            {lead.remarks.substring(0, 30)}...
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {tabValue === 5 && forwardedLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4 }}>
                      <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No forwarded leads found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Leads you forward or receive from others will appear here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {tabValue !== 5 && filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No leads found in this category
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Update Status Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Update Lead Status - {selectedLead?.name}</Typography>
            <IconButton onClick={() => setStatusDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Student Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                Student Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Name"
                value={statusData.studentName}
                onChange={(e) => setStatusData({ ...statusData, studentName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Number"
                value={statusData.studentNumber}
                onChange={(e) => setStatusData({ ...statusData, studentNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alternate Number"
                value={statusData.alternateNumber}
                onChange={(e) => setStatusData({ ...statusData, alternateNumber: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email ID"
                type="email"
                value={statusData.email}
                onChange={(e) => setStatusData({ ...statusData, email: e.target.value })}
              />
            </Grid>

            {/* Education Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Education Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="12th Subject"
                value={statusData.twelfthSubject}
                onChange={(e) => setStatusData({ ...statusData, twelfthSubject: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Course"
                value={statusData.currentCourse}
                onChange={(e) => setStatusData({ ...statusData, currentCourse: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Exam Preparation"
                value={statusData.examPreparation}
                onChange={(e) => setStatusData({ ...statusData, examPreparation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Reference"
                value={statusData.reference}
                onChange={(e) => setStatusData({ ...statusData, reference: e.target.value })}
              />
            </Grid>

            {/* Location Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Location Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current City"
                value={statusData.currentCity}
                onChange={(e) => setStatusData({ ...statusData, currentCity: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred City"
                value={statusData.preferredCity}
                onChange={(e) => setStatusData({ ...statusData, preferredCity: e.target.value })}
              />
            </Grid>

            {/* Call Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                Call Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={statusData.status}
                onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
              >
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="hot">Hot Lead</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
                <MenuItem value="future">Future Prospect</MenuItem>
                <MenuItem value="dead">Dead Lead</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Interest Level"
                value={statusData.interestLevel}
                onChange={(e) => setStatusData({ ...statusData, interestLevel: e.target.value })}
              >
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="not_interested">Not Interested</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Call Duration (minutes)"
                type="number"
                value={statusData.callDuration}
                onChange={(e) => setStatusData({ ...statusData, callDuration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Next Action"
                value={statusData.nextAction}
                onChange={(e) => setStatusData({ ...statusData, nextAction: e.target.value })}
              >
                <MenuItem value="callback">Call Back</MenuItem>
                <MenuItem value="meeting">Schedule Meeting</MenuItem>
                <MenuItem value="document">Send Documents</MenuItem>
                <MenuItem value="followup">Follow Up</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                value={statusData.budget}
                onChange={(e) => setStatusData({ ...statusData, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Timeline"
                value={statusData.timeline}
                onChange={(e) => setStatusData({ ...statusData, timeline: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Follow-up Date"
                type="date"
                value={statusData.followUpDate}
                onChange={(e) => setStatusData({ ...statusData, followUpDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks & Notes"
                multiline
                rows={4}
                value={statusData.remarks}
                onChange={(e) => setStatusData({ ...statusData, remarks: e.target.value })}
                placeholder="Add detailed call notes, conversation details, student requirements, or reasons for status change..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitStatus} variant="contained" color="primary">
            Update Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Forward Lead Dialog */}
      <Dialog open={forwardDialog} onClose={() => setForwardDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Forward Lead - {selectedLead?.name}</Typography>
            <IconButton onClick={() => setForwardDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Forward To</InputLabel>
                <Select
                  value={forwardData.forwardTo}
                  label="Forward To"
                  onChange={(e) => setForwardData({ ...forwardData, forwardTo: e.target.value })}
                >
                  {/* Admin Option */}
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: 'primary.main'
                      }} />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          Admin
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Unassign lead and send to admin pool
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>

                  {/* Divider */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 1 }} />

                  {/* Telecaller Options */}
                  <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
                    Forward to Telecaller:
                  </Typography>

                  {telecallers.map((telecaller) => (
                    <MenuItem key={telecaller._id} value={telecaller._id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: 'success.main'
                        }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight="bold">
                            {telecaller.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {telecaller.employeeId} • {telecaller.department || 'Telecaller'}
                          </Typography>
                          {telecaller.phone && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              📞 {telecaller.phone}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Reason for Forwarding"
                value={forwardData.reason}
                onChange={(e) => setForwardData({ ...forwardData, reason: e.target.value })}
              >
                <MenuItem value="not_responding">Not Responding</MenuItem>
                <MenuItem value="wrong_number">Wrong Number</MenuItem>
                <MenuItem value="language_barrier">Language Barrier</MenuItem>
                <MenuItem value="special_requirement">Special Requirement</MenuItem>
                <MenuItem value="escalation">Escalation</MenuItem>
                <MenuItem value="transfer_territory">Transfer Territory</MenuItem>
                <MenuItem value="expertise_required">Specific Expertise Required</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Notes"
                multiline
                rows={3}
                value={forwardData.notes}
                onChange={(e) => setForwardData({ ...forwardData, notes: e.target.value })}
                placeholder={
                  forwardData.forwardTo === 'admin'
                    ? "Explain why this lead should be returned to admin pool..."
                    : "Add any additional information for the receiving telecaller..."
                }
              />
            </Grid>

            {/* Information Box */}
            <Grid item xs={12}>
              <Box sx={{
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 1,
                border: 1,
                borderColor: 'info.main'
              }}>
                <Typography variant="body2" fontWeight="bold" color="info.dark" gutterBottom>
                  Forwarding Information:
                </Typography>
                {forwardData.forwardTo === 'admin' ? (
                  <Typography variant="caption" color="info.dark">
                    • Lead will be unassigned and returned to admin pool
                    <br />
                    • Status will be reset to "New"
                    <br />
                    • Admin can reassign to any telecaller
                  </Typography>
                ) : forwardData.forwardTo ? (
                  <Typography variant="caption" color="info.dark">
                    • Lead will be transferred to selected telecaller
                    <br />
                    • Status will remain "Assigned"
                    <br />
                    • You will no longer have access to this lead
                  </Typography>
                ) : (
                  <Typography variant="caption" color="info.dark">
                    Select whether to forward to Admin or another Telecaller
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForwardDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitForward}
            variant="contained"
            color="secondary"
            disabled={!forwardData.forwardTo}
            startIcon={<Forward />}
          >
            {forwardData.forwardTo === 'admin' ? 'Forward to Admin' : 'Forward to Telecaller'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TelecallerLeads