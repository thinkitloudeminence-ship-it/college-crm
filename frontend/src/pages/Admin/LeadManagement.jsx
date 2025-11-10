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
//   Card,
//   CardContent,
//   Tabs,
//   Tab
// } from '@mui/material'
// import {
//   Add,
//   Edit,
//   Upload,
//   Refresh,
//   Person
// } from '@mui/icons-material' // Remove Assign import
// import axios from 'axios'

// const LeadManagement = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')
//   const [tabValue, setTabValue] = useState(0)
//   const [stats, setStats] = useState({})

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//     fetchStats()
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

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('/api/leads/stats/overview')
//       setStats(response.data)
//     } catch (error) {
//       console.error('Failed to fetch stats')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })
//       fetchLeads()
//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//     } catch (error) {
//       setError('Failed to assign leads')
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
//       dead: 'default',
//       pending: 'secondary'
//     }
//     return colors[status] || 'default'
//   }

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'new'
//       case 1: return lead.status === 'assigned'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'hot'
//       case 4: return lead.status === 'future'
//       case 5: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Lead Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<Upload />}
//           >
//             Upload Excel
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//           >
//             Add Lead
//           </Button>
//         </Box>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.total || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Converted
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {stats.converted || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Hot Leads
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {stats.hot || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Conversion Rate
//               </Typography>
//               <Typography variant="h4" color="primary.main">
//                 {stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
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
//           <Tab label="New Leads" />
//           <Tab label="Assigned" />
//           <Tab label="Converted" />
//           <Tab label="Hot Leads" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Info</TableCell>
//                 <TableCell>Contact</TableCell>
//                 <TableCell>Source</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Assigned To</TableCell>
//                 <TableCell>Date</TableCell>
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
//                       {lead.college && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.college}
//                         </Typography>
//                       )}
//                       {lead.course && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.email}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.phone}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.source} 
//                       size="small"
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {lead.assignedTo ? (
//                       <Typography variant="body2">
//                         {lead.assignedTo.name}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Not assigned
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton size="small" color="primary">
//                         <Edit />
//                       </IconButton>
//                       <IconButton size="small" color="success">
//                         <Person /> {/* Changed from Assign to Person */}
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Bulk Assign Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
//         <DialogTitle>Bulk Assign Leads</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>
//           <TextField
//             fullWidth
//             select
//             label="Assign to Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId})
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller}
//           >
//             Assign Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default LeadManagement


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
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Add,
//   Edit,
//   Upload,
//   Refresh,
//   Person,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const LeadManagement = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [uploadDialog, setUploadDialog] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')
//   const [tabValue, setTabValue] = useState(0)
//   const [stats, setStats] = useState({})
//   const [file, setFile] = useState(null)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     college: '',
//     course: '',
//     source: 'website',
//     status: 'new'
//   })

//   // Form validation
//   const [formErrors, setFormErrors] = useState({})

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//     fetchStats()
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

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('/api/leads/stats/overview')
//       setStats(response.data)
//     } catch (error) {
//       console.error('Failed to fetch stats')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })
//       fetchLeads()
//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess('Leads assigned successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to assign leads')
//     }
//   }

//   // Add Lead functionality
//   const handleAddLead = async () => {
//     // Validate form
//     const errors = {}
//     if (!formData.name.trim()) errors.name = 'Name is required'
//     if (!formData.email.trim()) errors.email = 'Email is required'
//     if (!formData.phone.trim()) errors.phone = 'Phone is required'

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.post('/api/leads', formData)
//       await fetchLeads()
//       await fetchStats()
//       setOpenDialog(false)
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         college: '',
//         course: '',
//         source: 'website',
//         status: 'new'
//       })
//       setFormErrors({})
//       setSuccess('Lead added successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to add lead')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Upload Excel functionality
//   const handleFileUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload')
//       return
//     }

//     const formData = new FormData()
//     formData.append('file', file)

//     try {
//       setUploadLoading(true)
//       const response = await axios.post('/api/leads/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       })

//       await fetchLeads()
//       await fetchStats()
//       setUploadDialog(false)
//       setFile(null)
//       setSuccess(`${response.data.processed} leads uploaded successfully!`)
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to upload file. Please check the format.')
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0]
//     if (selectedFile) {
//       // NO VALIDATION - koi bhi file accept karo
//       setFile(selectedFile)
//       setError('')
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }))
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
//       dead: 'default',
//       pending: 'secondary'
//     }
//     return colors[status] || 'default'
//   }

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'new'
//       case 1: return lead.status === 'assigned'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'hot'
//       case 4: return lead.status === 'future'
//       case 5: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Lead Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<Upload />}
//             onClick={() => setUploadDialog(true)}
//           >
//             Upload File
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenDialog(true)}
//           >
//             Add Lead
//           </Button>
//         </Box>
//       </Box>

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

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.total || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Converted
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {stats.converted || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Hot Leads
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {stats.hot || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Conversion Rate
//               </Typography>
//               <Typography variant="h4" color="primary.main">
//                 {stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
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
//           <Tab label="New Leads" />
//           <Tab label="Assigned" />
//           <Tab label="Converted" />
//           <Tab label="Hot Leads" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Info</TableCell>
//                 <TableCell>Contact</TableCell>
//                 <TableCell>Source</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Assigned To</TableCell>
//                 <TableCell>Date</TableCell>
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
//                       {lead.college && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.college}
//                         </Typography>
//                       )}
//                       {lead.course && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.email}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.phone}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.source} 
//                       size="small"
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {lead.assignedTo ? (
//                       <Typography variant="body2">
//                         {lead.assignedTo.name}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Not assigned
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton size="small" color="primary">
//                         <Edit />
//                       </IconButton>
//                       <IconButton size="small" color="success">
//                         <Person />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Add Lead Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Add New Lead</Typography>
//             <IconButton onClick={() => setOpenDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email *"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 error={!!formErrors.email}
//                 helperText={formErrors.email}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone *"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 error={!!formErrors.phone}
//                 helperText={formErrors.phone}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="College"
//                 name="college"
//                 value={formData.college}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Course"
//                 name="course"
//                 value={formData.course}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={formData.source}
//                   label="Source"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="website">Website</MenuItem>
//                   <MenuItem value="referral">Referral</MenuItem>
//                   <MenuItem value="social_media">Social Media</MenuItem>
//                   <MenuItem value="walkin">Walk-in</MenuItem>
//                   <MenuItem value="campaign">Campaign</MenuItem>
//                   <MenuItem value="other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="new">New</MenuItem>
//                   <MenuItem value="assigned">Assigned</MenuItem>
//                   <MenuItem value="contacted">Contacted</MenuItem>
//                   <MenuItem value="hot">Hot</MenuItem>
//                   <MenuItem value="converted">Converted</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddLead} 
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : 'Add Lead'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload File Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Upload File</Typography>
//             <IconButton onClick={() => setUploadDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Upload any file containing lead data. The backend will process Excel, CSV, and other spreadsheet formats.
//           </Typography>

//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             {file ? file.name : 'Choose Any File'}
//             <input
//               type="file"
//               hidden
//               onChange={handleFileChange}
//             />
//           </Button>

//           {file && (
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Selected: {file.name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Size: {(file.size / 1024 / 1024).toFixed(2)} MB
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleFileUpload} 
//             variant="contained"
//             disabled={!file || uploadLoading}
//           >
//             {uploadLoading ? <CircularProgress size={24} /> : 'Upload File'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Assign Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
//         <DialogTitle>Bulk Assign Leads</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>
//           <TextField
//             fullWidth
//             select
//             label="Assign to Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId})
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller}
//           >
//             Assign Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default LeadManagement

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
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Add,
//   Edit,
//   Upload,
//   Refresh,
//   Person,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const LeadManagement = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [uploadDialog, setUploadDialog] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')
//   const [tabValue, setTabValue] = useState(0)
//   const [stats, setStats] = useState({})
//   const [file, setFile] = useState(null)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     college: '',
//     course: '',
//     source: 'website',
//     status: 'new'
//   })

//   // Form validation
//   const [formErrors, setFormErrors] = useState({})

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//     fetchStats()
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

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('/api/leads/stats/overview')
//       setStats(response.data)
//     } catch (error) {
//       console.error('Failed to fetch stats')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })
//       fetchLeads()
//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess('Leads assigned successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to assign leads')
//     }
//   }

//   // Add Lead functionality
//   const handleAddLead = async () => {
//     // Validate form
//     const errors = {}
//     if (!formData.name.trim()) errors.name = 'Name is required'
//     if (!formData.email.trim()) errors.email = 'Email is required'
//     if (!formData.phone.trim()) errors.phone = 'Phone is required'

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.post('/api/leads', formData)
//       await fetchLeads()
//       await fetchStats()
//       setOpenDialog(false)
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         college: '',
//         course: '',
//         source: 'website',
//         status: 'new'
//       })
//       setFormErrors({})
//       setSuccess('Lead added successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to add lead: ' + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Upload File functionality - FIXED VERSION
//   const handleFileUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload')
//       return
//     }

//     const uploadFormData = new FormData()
//     uploadFormData.append('file', file)
//     uploadFormData.append('uploadType', 'leads')

//     try {
//       setUploadLoading(true)
//       setError('')

//       // Debugging: log file info
//       console.log('Uploading file:', {
//         name: file.name,
//         type: file.type,
//         size: file.size
//       })

//       const response = await axios.post('/api/leads/upload', uploadFormData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         timeout: 30000, // 30 seconds timeout
//         onUploadProgress: (progressEvent) => {
//           const progress = (progressEvent.loaded / progressEvent.total) * 100
//           console.log(`Upload Progress: ${progress.toFixed(2)}%`)
//         }
//       })

//       console.log('Upload response:', response.data)

//       await fetchLeads()
//       await fetchStats()
//       setUploadDialog(false)
//       setFile(null)
//       setSuccess(`${response.data.processed || response.data.count || 'Multiple'} leads uploaded successfully!`)
//       setTimeout(() => setSuccess(''), 5000)
//     } catch (error) {
//       console.error('Upload error:', error)
//       const errorMessage = error.response?.data?.message || 
//                           error.response?.data?.error || 
//                           error.message || 
//                           'Failed to upload file. Please try again.'
//       setError('Upload failed: ' + errorMessage)
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   // Alternative upload method for different API endpoints
//   const handleFileUploadAlternative = async () => {
//     if (!file) {
//       setError('Please select a file to upload')
//       return
//     }

//     const uploadFormData = new FormData()
//     uploadFormData.append('file', file)

//     try {
//       setUploadLoading(true)
//       setError('')

//       // Try different possible endpoints
//       const endpoints = [
//         '/api/leads/upload',
//         '/api/leads/bulk-upload',
//         '/api/leads/import',
//         '/api/upload/leads',
//         '/api/import/leads'
//       ]

//       let response = null
//       let lastError = null

//       for (const endpoint of endpoints) {
//         try {
//           console.log(`Trying endpoint: ${endpoint}`)
//           response = await axios.post(endpoint, uploadFormData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             timeout: 15000
//           })
//           console.log(`Success with endpoint: ${endpoint}`, response.data)
//           break // Exit loop if successful
//         } catch (err) {
//           lastError = err
//           console.log(`Failed with endpoint: ${endpoint}`, err.message)
//           continue // Try next endpoint
//         }
//       }

//       if (!response) {
//         throw lastError || new Error('All upload endpoints failed')
//       }

//       await fetchLeads()
//       await fetchStats()
//       setUploadDialog(false)
//       setFile(null)
//       setSuccess(`File uploaded successfully! ${response.data.processed || ''} leads processed.`)
//       setTimeout(() => setSuccess(''), 5000)
//     } catch (error) {
//       console.error('All upload attempts failed:', error)
//       const errorMessage = error.response?.data?.message || 
//                           'Upload failed. Please check your file format and try again.'
//       setError(errorMessage)
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   // Simple file change handler
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0]
//     if (selectedFile) {
//       setFile(selectedFile)
//       setError('')
//       console.log('File selected:', selectedFile.name, 'Type:', selectedFile.type, 'Size:', selectedFile.size)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }))
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
//       dead: 'default',
//       pending: 'secondary'
//     }
//     return colors[status] || 'default'
//   }

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'new'
//       case 1: return lead.status === 'assigned'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'hot'
//       case 4: return lead.status === 'future'
//       case 5: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Lead Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<Upload />}
//             onClick={() => setUploadDialog(true)}
//           >
//             Upload File
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenDialog(true)}
//           >
//             Add Lead
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<Refresh />}
//             onClick={fetchLeads}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

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

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.total || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Converted
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {stats.converted || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Hot Leads
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {stats.hot || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Conversion Rate
//               </Typography>
//               <Typography variant="h4" color="primary.main">
//                 {stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
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
//           <Tab label="New Leads" />
//           <Tab label="Assigned" />
//           <Tab label="Converted" />
//           <Tab label="Hot Leads" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Info</TableCell>
//                 <TableCell>Contact</TableCell>
//                 <TableCell>Source</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Assigned To</TableCell>
//                 <TableCell>Date</TableCell>
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
//                       {lead.college && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.college}
//                         </Typography>
//                       )}
//                       {lead.course && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.email}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.phone}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.source} 
//                       size="small"
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {lead.assignedTo ? (
//                       <Typography variant="body2">
//                         {lead.assignedTo.name}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Not assigned
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton size="small" color="primary">
//                         <Edit />
//                       </IconButton>
//                       <IconButton size="small" color="success">
//                         <Person />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Add Lead Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Add New Lead</Typography>
//             <IconButton onClick={() => setOpenDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email *"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 error={!!formErrors.email}
//                 helperText={formErrors.email}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone *"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 error={!!formErrors.phone}
//                 helperText={formErrors.phone}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="College"
//                 name="college"
//                 value={formData.college}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Course"
//                 name="course"
//                 value={formData.course}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={formData.source}
//                   label="Source"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="website">Website</MenuItem>
//                   <MenuItem value="referral">Referral</MenuItem>
//                   <MenuItem value="social_media">Social Media</MenuItem>
//                   <MenuItem value="walkin">Walk-in</MenuItem>
//                   <MenuItem value="campaign">Campaign</MenuItem>
//                   <MenuItem value="other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="new">New</MenuItem>
//                   <MenuItem value="assigned">Assigned</MenuItem>
//                   <MenuItem value="contacted">Contacted</MenuItem>
//                   <MenuItem value="hot">Hot</MenuItem>
//                   <MenuItem value="converted">Converted</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddLead} 
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : 'Add Lead'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload File Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Upload File</Typography>
//             <IconButton onClick={() => setUploadDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Upload any file containing lead data. Supported formats: Excel, CSV, etc.
//           </Typography>

//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             {file ? file.name : 'Choose Any File'}
//             <input
//               type="file"
//               hidden
//               onChange={handleFileChange}
//             />
//           </Button>

//           {file && (
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Selected: {file.name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Size: {(file.size / 1024 / 1024).toFixed(2)} MB
//               </Typography>
//             </Box>
//           )}

//           {/* Debug info */}
//           {file && (
//             <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
//               <Typography variant="caption" display="block">
//                 Debug: {file.name} | Type: {file.type} | Size: {file.size} bytes
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleFileUpload} 
//             variant="contained"
//             disabled={!file || uploadLoading}
//             sx={{ mr: 1 }}
//           >
//             {uploadLoading ? <CircularProgress size={24} /> : 'Upload File'}
//           </Button>
//           {/* Alternative upload button */}
//           <Button 
//             onClick={handleFileUploadAlternative} 
//             variant="outlined"
//             disabled={!file || uploadLoading}
//           >
//             Try Alternative
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Assign Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
//         <DialogTitle>Bulk Assign Leads</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>
//           <TextField
//             fullWidth
//             select
//             label="Assign to Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId})
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller}
//           >
//             Assign Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default LeadManagement


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
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Add,
//   Edit,
//   Upload,
//   Refresh,
//   Person,
//   Close
// } from '@mui/icons-material'
// import axios from 'axios'

// const LeadManagement = () => {
//   const [leads, setLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [uploadDialog, setUploadDialog] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')
//   const [tabValue, setTabValue] = useState(0)
//   const [stats, setStats] = useState({})
//   const [file, setFile] = useState(null)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     college: '',
//     course: '',
//     source: 'website',
//     status: 'new'
//   })

//   // Form validation
//   const [formErrors, setFormErrors] = useState({})

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//     fetchStats()
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

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('/api/leads/stats/overview')
//       setStats(response.data)
//     } catch (error) {
//       console.error('Failed to fetch stats')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })
//       fetchLeads()
//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess('Leads assigned successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to assign leads')
//     }
//   }

//   // Add Lead functionality
//   const handleAddLead = async () => {
//     // Validate form
//     const errors = {}
//     if (!formData.name.trim()) errors.name = 'Name is required'
//     if (!formData.email.trim()) errors.email = 'Email is required'
//     if (!formData.phone.trim()) errors.phone = 'Phone is required'

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.post('/api/leads', formData)
//       await fetchLeads()
//       await fetchStats()
//       setOpenDialog(false)
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         college: '',
//         course: '',
//         source: 'website',
//         status: 'new'
//       })
//       setFormErrors({})
//       setSuccess('Lead added successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to add lead: ' + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Excel file validation function
//   const isValidExcelFile = (file) => {
//     const fileName = file.name.toLowerCase()

//     // Allowed Excel and CSV extensions
//     const allowedExtensions = [
//       '.xlsx', '.xls', '.csv',
//       '.xlsm', '.xlsb' // Excel macro-enabled and binary formats
//     ]

//     // Allowed MIME types
//     const allowedMimeTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/vnd.ms-excel.sheet.macroEnabled.12',
//       'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
//       'text/csv',
//       'application/csv',
//       'text/x-csv',
//       'application/vnd.ms-excel'
//     ]

//     // Check file extension
//     const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))

//     // Check MIME type (some browsers may not provide this)
//     const hasValidMimeType = !file.type || allowedMimeTypes.includes(file.type)

//     return hasValidExtension && hasValidMimeType
//   }

// //   // Upload File functionality - ONLY EXCEL FILES
// //   const handleFileUpload = async () => {
// //     if (!file) {
// //       setError('Please select a file to upload')
// //       return
// //     }

// //     // Validate file type
// //     if (!isValidExcelFile(file)) {
// //       setError('Please upload only Excel files (.xlsx, .xls, .csv) or CSV files')
// //       return
// //     }

// //     const uploadFormData = new FormData()
// //     uploadFormData.append('file', file)
// //     uploadFormData.append('uploadType', 'leads')

// //     try {
// //       setUploadLoading(true)
// //       setError('')

// //       // Debugging: log file info
// //       console.log('Uploading Excel file:', {
// //         name: file.name,
// //         type: file.type,
// //         size: file.size
// //       })

// //       const response = await axios.post('/api/leads/upload', uploadFormData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //         timeout: 30000, // 30 seconds timeout
// //         onUploadProgress: (progressEvent) => {
// //           const progress = (progressEvent.loaded / progressEvent.total) * 100
// //           console.log(`Upload Progress: ${progress.toFixed(2)}%`)
// //         }
// //       })

// //       console.log('Upload response:', response.data)

// //       await fetchLeads()
// //       await fetchStats()
// //       setUploadDialog(false)
// //       setFile(null)
// //       setSuccess(`${response.data.processed || response.data.count || 'Multiple'} leads uploaded successfully!`)
// //       setTimeout(() => setSuccess(''), 5000)
// //     } catch (error) {
// //       console.error('Upload error:', error)
// //       const errorMessage = error.response?.data?.message || 
// //                           error.response?.data?.error || 
// //                           error.message || 
// //                           'Failed to upload file. Please try again.'
// //       setError('Upload failed: ' + errorMessage)
// //     } finally {
// //       setUploadLoading(false)
// //     }
// //   }

// // Upload File functionality
// const handleFileUpload = async () => {
//   if (!file) {
//     setError('Please select a file to upload');
//     return;
//   }

//   const uploadFormData = new FormData();
//   uploadFormData.append('file', file);

//   try {
//     setUploadLoading(true);
//     setError('');

//     // Use the main upload endpoint
//     const response = await axios.post('/api/leads/upload', uploadFormData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       }
//     });

//     await fetchLeads();
//     await fetchStats();
//     setUploadDialog(false);
//     setFile(null);
//     setSuccess(`${response.data.processed} leads uploaded successfully!`);

//   } catch (error) {
//     setError('Upload failed: ' + (error.response?.data?.message || error.message));
//   } finally {
//     setUploadLoading(false);
//   }
// };


// // Alternative upload method for different API endpoints
//   const handleFileUploadAlternative = async () => {
//     if (!file) {
//       setError('Please select a file to upload')
//       return
//     }

//     // Validate file type
//     if (!isValidExcelFile(file)) {
//       setError('Please upload only Excel files (.xlsx, .xls, .csv) or CSV files')
//       return
//     }

//     const uploadFormData = new FormData()
//     uploadFormData.append('file', file)

//     try {
//       setUploadLoading(true)
//       setError('')

//       // Try different possible endpoints
//       const endpoints = [
//         '/api/leads/upload',
//         '/api/leads/bulk-upload',
//         '/api/leads/import',
//         '/api/upload/leads',
//         '/api/import/leads'
//       ]

//       let response = null
//       let lastError = null

//       for (const endpoint of endpoints) {
//         try {
//           console.log(`Trying endpoint: ${endpoint}`)
//           response = await axios.post(endpoint, uploadFormData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//             timeout: 15000
//           })
//           console.log(`Success with endpoint: ${endpoint}`, response.data)
//           break // Exit loop if successful
//         } catch (err) {
//           lastError = err
//           console.log(`Failed with endpoint: ${endpoint}`, err.message)
//           continue // Try next endpoint
//         }
//       }

//       if (!response) {
//         throw lastError || new Error('All upload endpoints failed')
//       }

//       await fetchLeads()
//       await fetchStats()
//       setUploadDialog(false)
//       setFile(null)
//       setSuccess(`File uploaded successfully! ${response.data.processed || ''} leads processed.`)
//       setTimeout(() => setSuccess(''), 5000)
//     } catch (error) {
//       console.error('All upload attempts failed:', error)
//       const errorMessage = error.response?.data?.message || 
//                           'Upload failed. Please check your file format and try again.'
//       setError(errorMessage)
//     } finally {
//       setUploadLoading(false)
//     }
//   }

//   // File change handler with Excel validation
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0]
//     if (selectedFile) {
//       // Validate if it's an Excel file
//       if (!isValidExcelFile(selectedFile)) {
//         setError('Please select only Excel files (.xlsx, .xls) or CSV files (.csv)')
//         setFile(null)
//         return
//       }

//       setFile(selectedFile)
//       setError('')
//       console.log('Excel file selected:', selectedFile.name, 'Type:', selectedFile.type, 'Size:', selectedFile.size)
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     // Clear error when user starts typing
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }))
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
//       dead: 'default',
//       pending: 'secondary'
//     }
//     return colors[status] || 'default'
//   }

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'new'
//       case 1: return lead.status === 'assigned'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'hot'
//       case 4: return lead.status === 'future'
//       case 5: return lead.status === 'dead'
//       default: return true
//     }
//   })

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Lead Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<Upload />}
//             onClick={() => setUploadDialog(true)}
//           >
//             Upload Excel
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenDialog(true)}
//           >
//             Add Lead
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<Refresh />}
//             onClick={fetchLeads}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

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

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.total || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Converted
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {stats.converted || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Hot Leads
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {stats.hot || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Conversion Rate
//               </Typography>
//               <Typography variant="h4" color="primary.main">
//                 {stats.total ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
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
//           <Tab label="New Leads" />
//           <Tab label="Assigned" />
//           <Tab label="Converted" />
//           <Tab label="Hot Leads" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Info</TableCell>
//                 <TableCell>Contact</TableCell>
//                 <TableCell>Source</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Assigned To</TableCell>
//                 <TableCell>Date</TableCell>
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
//                       {lead.college && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.college}
//                         </Typography>
//                       )}
//                       {lead.course && (
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.course}
//                         </Typography>
//                       )}
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2">
//                         {lead.email}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {lead.phone}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.source} 
//                       size="small"
//                       variant="outlined"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {lead.assignedTo ? (
//                       <Typography variant="body2">
//                         {lead.assignedTo.name}
//                       </Typography>
//                     ) : (
//                       <Typography variant="body2" color="text.secondary">
//                         Not assigned
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <IconButton size="small" color="primary">
//                         <Edit />
//                       </IconButton>
//                       <IconButton size="small" color="success">
//                         <Person />
//                       </IconButton>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Add Lead Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Add New Lead</Typography>
//             <IconButton onClick={() => setOpenDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email *"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 error={!!formErrors.email}
//                 helperText={formErrors.email}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone *"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 error={!!formErrors.phone}
//                 helperText={formErrors.phone}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="College"
//                 name="college"
//                 value={formData.college}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Course"
//                 name="course"
//                 value={formData.course}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={formData.source}
//                   label="Source"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="website">Website</MenuItem>
//                   <MenuItem value="referral">Referral</MenuItem>
//                   <MenuItem value="social_media">Social Media</MenuItem>
//                   <MenuItem value="walkin">Walk-in</MenuItem>
//                   <MenuItem value="campaign">Campaign</MenuItem>
//                   <MenuItem value="other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="new">New</MenuItem>
//                   <MenuItem value="assigned">Assigned</MenuItem>
//                   <MenuItem value="contacted">Contacted</MenuItem>
//                   <MenuItem value="hot">Hot</MenuItem>
//                   <MenuItem value="converted">Converted</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleAddLead} 
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : 'Add Lead'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload Excel Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Upload Excel File</Typography>
//             <IconButton onClick={() => setUploadDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Upload Excel or CSV file containing lead data. 
//             Supported formats: .xlsx, .xls, .csv
//           </Typography>

//           <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
//             Required columns: name, email, phone (college, course, source are optional)
//           </Typography>

//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             {file ? file.name : 'Choose Excel/CSV File'}
//             <input
//               type="file"
//               hidden
//               accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
//               onChange={handleFileChange}
//             />
//           </Button>

//           {file && (
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Selected: {file.name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Size: {(file.size / 1024 / 1024).toFixed(2)} MB
//               </Typography>
//             </Box>
//           )}

//           {/* File requirements info */}
//           <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
//             <Typography variant="caption" display="block" fontWeight="bold">
//               File Requirements:
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Excel (.xlsx, .xls) or CSV (.csv) format only
//             </Typography>
//             <Typography variant="caption" display="block">
//               • First row should contain column headers
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Required columns: name, email, phone
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Optional columns: college, course, source
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleFileUpload} 
//             variant="contained"
//             disabled={!file || uploadLoading}
//             sx={{ mr: 1 }}
//           >
//             {uploadLoading ? <CircularProgress size={24} /> : 'Upload Excel'}
//           </Button>
//           {/* Alternative upload button */}
//           <Button 
//             onClick={handleFileUploadAlternative} 
//             variant="outlined"
//             disabled={!file || uploadLoading}
//           >
//             Try Alternative
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Assign Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
//         <DialogTitle>Bulk Assign Leads</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>
//           <TextField
//             fullWidth
//             select
//             label="Assign to Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId})
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button 
//             onClick={handleBulkAssign} 
//             variant="contained"
//             disabled={!selectedTelecaller}
//           >
//             Assign Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default LeadManagement



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
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   FormControl,
//   InputLabel,
//   Select
// } from '@mui/material'
// import {
//   Add,
//   Edit,
//   Upload,
//   Refresh,
//   Person,
//   Close,
//   Forward
// } from '@mui/icons-material'
// import axios from 'axios'

// const LeadManagement = () => {
//   const [leads, setLeads] = useState([])
//   const [forwardedLeads, setForwardedLeads] = useState([])
//   const [telecallers, setTelecallers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [openDialog, setOpenDialog] = useState(false)
//   const [assignDialog, setAssignDialog] = useState(false)
//   const [uploadDialog, setUploadDialog] = useState(false)
//   const [selectedLeads, setSelectedLeads] = useState([])
//   const [selectedTelecaller, setSelectedTelecaller] = useState('')
//   const [tabValue, setTabValue] = useState(0)
//   const [stats, setStats] = useState({})
//   const [file, setFile] = useState(null)
//   const [uploadLoading, setUploadLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     college: '',
//     course: '',
//     source: 'website',
//     status: 'new'
//   })

//   // Form validation
//   const [formErrors, setFormErrors] = useState({})

//   useEffect(() => {
//     fetchLeads()
//     fetchTelecallers()
//     fetchStats()
//   }, [tabValue]) // Refetch when tab changes

//   const fetchLeads = async () => {
//     try {
//       if (tabValue === 6) {
//         // Fetch forwarded leads for the forwarded tab
//         const response = await axios.get('/api/leads/forwarded/all')
//         setForwardedLeads(response.data)
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

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get('/api/leads/stats/overview')
//       setStats(response.data)
//     } catch (error) {
//       console.error('Failed to fetch stats')
//     }
//   }

//   const handleBulkAssign = async () => {
//     if (!selectedTelecaller || selectedLeads.length === 0) {
//       setError('Please select telecaller and at least one lead')
//       return
//     }

//     try {
//       await axios.post('/api/leads/bulk-assign', {
//         leadIds: selectedLeads,
//         telecallerId: selectedTelecaller
//       })
//       fetchLeads()
//       setAssignDialog(false)
//       setSelectedLeads([])
//       setSelectedTelecaller('')
//       setSuccess('Leads assigned successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to assign leads')
//     }
//   }

//   const handleAddLead = async () => {
//     // Validate form
//     const errors = {}
//     if (!formData.name.trim()) errors.name = 'Name is required'
//     if (!formData.email.trim()) errors.email = 'Email is required'
//     if (!formData.phone.trim()) errors.phone = 'Phone is required'

//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors)
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.post('/api/leads', formData)
//       await fetchLeads()
//       await fetchStats()
//       setOpenDialog(false)
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         college: '',
//         course: '',
//         source: 'website',
//         status: 'new'
//       })
//       setFormErrors({})
//       setSuccess('Lead added successfully!')
//       setTimeout(() => setSuccess(''), 3000)
//     } catch (error) {
//       setError('Failed to add lead: ' + (error.response?.data?.message || error.message))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const isValidExcelFile = (file) => {
//     const fileName = file.name.toLowerCase()
//     const allowedExtensions = ['.xlsx', '.xls', '.csv']
//     const allowedMimeTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'text/csv',
//       'application/csv',
//       'text/x-csv',
//       'application/vnd.ms-excel'
//     ]

//     const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
//     const hasValidMimeType = !file.type || allowedMimeTypes.includes(file.type)

//     return hasValidExtension && hasValidMimeType
//   }

//   const handleFileUpload = async () => {
//     if (!file) {
//       setError('Please select a file to upload');
//       return;
//     }

//     const uploadFormData = new FormData();
//     uploadFormData.append('file', file);

//     try {
//       setUploadLoading(true);
//       setError('');

//       const response = await axios.post('/api/leads/upload', uploadFormData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         }
//       });

//       await fetchLeads();
//       await fetchStats();
//       setUploadDialog(false);
//       setFile(null);
//       setSuccess(`${response.data.processed} leads uploaded successfully!`);

//     } catch (error) {
//       setError('Upload failed: ' + (error.response?.data?.message || error.message));
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0]
//     if (selectedFile) {
//       if (!isValidExcelFile(selectedFile)) {
//         setError('Please select only Excel files (.xlsx, .xls) or CSV files (.csv)')
//         setFile(null)
//         return
//       }

//       setFile(selectedFile)
//       setError('')
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//     if (formErrors[name]) {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }))
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
//       dead: 'default',
//       pending: 'secondary'
//     }
//     return colors[status] || 'default'
//   }

//   const filteredLeads = leads.filter(lead => {
//     switch (tabValue) {
//       case 0: return lead.status === 'new'
//       case 1: return lead.status === 'assigned'
//       case 2: return lead.status === 'converted'
//       case 3: return lead.status === 'hot'
//       case 4: return lead.status === 'future'
//       case 5: return lead.status === 'dead'
//       case 6: return true // Forwarded leads handled separately
//       default: return true
//     }
//   })

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
//         <CircularProgress />
//       </Box>
//     )
//   }

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
//           Lead Management
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<Upload />}
//             onClick={() => setUploadDialog(true)}
//           >
//             Upload Excel
//           </Button>
//           <Button
//             variant="contained"
//             startIcon={<Add />}
//             onClick={() => setOpenDialog(true)}
//           >
//             Add Lead
//           </Button>
//           <Button
//             variant="outlined"
//             startIcon={<Refresh />}
//             onClick={fetchLeads}
//           >
//             Refresh
//           </Button>
//         </Box>
//       </Box>

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

//       {/* Stats Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Total Leads
//               </Typography>
//               <Typography variant="h4">
//                 {stats.total || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Converted
//               </Typography>
//               <Typography variant="h4" color="success.main">
//                 {stats.converted || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Hot Leads
//               </Typography>
//               <Typography variant="h4" color="error.main">
//                 {stats.hot || 0}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Typography color="text.secondary" gutterBottom>
//                 Forwarded Leads
//               </Typography>
//               <Typography variant="h4" color="warning.main">
//                 {forwardedLeads.length || 0}
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
//           <Tab label="New Leads" />
//           <Tab label="Assigned" />
//           <Tab label="Converted" />
//           <Tab label="Hot Leads" />
//           <Tab label="Future" />
//           <Tab label="Dead" />
//           <Tab
//             label={
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Forward fontSize="small" />
//                 Forwarded Leads
//               </Box>
//             }
//           />
//         </Tabs>

//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {tabValue === 6 ? (
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
//                     <TableCell>Lead Info</TableCell>
//                     <TableCell>Contact</TableCell>
//                     <TableCell>Source</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Assigned To</TableCell>
//                     <TableCell>Date</TableCell>
//                     <TableCell>Actions</TableCell>
//                   </>
//                 )}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {tabValue === 6 ? (
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
//                         <IconButton size="small" color="primary">
//                           <Edit />
//                         </IconButton>
//                         <IconButton size="small" color="success">
//                           <Person />
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
//                         {lead.college && (
//                           <Typography variant="body2" color="text.secondary">
//                             {lead.college}
//                           </Typography>
//                         )}
//                         {lead.course && (
//                           <Typography variant="body2" color="text.secondary">
//                             {lead.course}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Box>
//                         <Typography variant="body2">
//                           {lead.email}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {lead.phone}
//                         </Typography>
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.source}
//                         size="small"
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={lead.status}
//                         color={getStatusColor(lead.status)}
//                         size="small"
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {lead.assignedTo ? (
//                         <Typography variant="body2">
//                           {lead.assignedTo.name}
//                         </Typography>
//                       ) : (
//                         <Typography variant="body2" color="text.secondary">
//                           Not assigned
//                         </Typography>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {new Date(lead.createdAt).toLocaleDateString()}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         <IconButton size="small" color="primary">
//                           <Edit />
//                         </IconButton>
//                         <IconButton size="small" color="success">
//                           <Person />
//                         </IconButton>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//               {tabValue === 6 && forwardedLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Box sx={{ py: 4 }}>
//                       <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//                       <Typography variant="body1" color="text.secondary">
//                         No forwarded leads found
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         When telecallers forward leads to other telecallers or admin, they will appear here
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               )}
//               {tabValue !== 6 && filteredLeads.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Typography variant="body2" color="text.secondary">
//                       No leads found
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>

//       {/* Add Lead Dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Add New Lead</Typography>
//             <IconButton onClick={() => setOpenDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Grid container spacing={2} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Name *"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 error={!!formErrors.name}
//                 helperText={formErrors.name}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Email *"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 error={!!formErrors.email}
//                 helperText={formErrors.email}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Phone *"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 error={!!formErrors.phone}
//                 helperText={formErrors.phone}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="College"
//                 name="college"
//                 value={formData.college}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Course"
//                 name="course"
//                 value={formData.course}
//                 onChange={handleInputChange}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Source</InputLabel>
//                 <Select
//                   name="source"
//                   value={formData.source}
//                   label="Source"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="website">Website</MenuItem>
//                   <MenuItem value="referral">Referral</MenuItem>
//                   <MenuItem value="social_media">Social Media</MenuItem>
//                   <MenuItem value="walkin">Walk-in</MenuItem>
//                   <MenuItem value="campaign">Campaign</MenuItem>
//                   <MenuItem value="other">Other</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <FormControl fullWidth>
//                 <InputLabel>Status</InputLabel>
//                 <Select
//                   name="status"
//                   value={formData.status}
//                   label="Status"
//                   onChange={handleInputChange}
//                 >
//                   <MenuItem value="new">New</MenuItem>
//                   <MenuItem value="assigned">Assigned</MenuItem>
//                   <MenuItem value="contacted">Contacted</MenuItem>
//                   <MenuItem value="hot">Hot</MenuItem>
//                   <MenuItem value="converted">Converted</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleAddLead}
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : 'Add Lead'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Upload Excel Dialog */}
//       <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6">Upload Excel File</Typography>
//             <IconButton onClick={() => setUploadDialog(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Upload Excel or CSV file containing lead data.
//             Supported formats: .xlsx, .xls, .csv
//           </Typography>

//           <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
//             Required columns: name, email, phone (college, course, source are optional)
//           </Typography>

//           <Button
//             variant="outlined"
//             component="label"
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             {file ? file.name : 'Choose Excel/CSV File'}
//             <input
//               type="file"
//               hidden
//               accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
//               onChange={handleFileChange}
//             />
//           </Button>

//           {file && (
//             <Box>
//               <Typography variant="body2" color="text.secondary">
//                 Selected: {file.name}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 Size: {(file.size / 1024 / 1024).toFixed(2)} MB
//               </Typography>
//             </Box>
//           )}

//           <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
//             <Typography variant="caption" display="block" fontWeight="bold">
//               File Requirements:
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Excel (.xlsx, .xls) or CSV (.csv) format only
//             </Typography>
//             <Typography variant="caption" display="block">
//               • First row should contain column headers
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Required columns: name, email, phone
//             </Typography>
//             <Typography variant="caption" display="block">
//               • Optional columns: college, course, source
//             </Typography>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleFileUpload}
//             variant="contained"
//             disabled={!file || uploadLoading}
//           >
//             {uploadLoading ? <CircularProgress size={24} /> : 'Upload Excel'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Bulk Assign Dialog */}
//       <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
//         <DialogTitle>Bulk Assign Leads</DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             Selected {selectedLeads.length} leads for assignment
//           </Typography>
//           <TextField
//             fullWidth
//             select
//             label="Assign to Telecaller"
//             value={selectedTelecaller}
//             onChange={(e) => setSelectedTelecaller(e.target.value)}
//           >
//             {telecallers.map((telecaller) => (
//               <MenuItem key={telecaller._id} value={telecaller._id}>
//                 {telecaller.name} ({telecaller.employeeId})
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
//           <Button
//             onClick={handleBulkAssign}
//             variant="contained"
//             disabled={!selectedTelecaller}
//           >
//             Assign Leads
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   )
// }

// export default LeadManagement

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
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import {
  Add,
  Edit,
  Upload,
  Refresh,
  Person,
  Close,
  Forward
} from '@mui/icons-material'
import axios from 'axios'

const LeadManagement = () => {
  const [leads, setLeads] = useState([])
  const [forwardedLeads, setForwardedLeads] = useState([])
  const [telecallers, setTelecallers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [assignDialog, setAssignDialog] = useState(false)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState([])
  const [selectedTelecaller, setSelectedTelecaller] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [stats, setStats] = useState({})
  const [file, setFile] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    source: 'website',
    status: 'new'
  })

  // Form validation
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchLeads()
    fetchTelecallers()
    fetchStats()
  }, [tabValue]) // Refetch when tab changes

  // Add this useEffect to recalculate stats when leads change
  useEffect(() => {
    if (leads.length > 0 || forwardedLeads.length > 0) {
      calculateManualStats()
    }
  }, [leads, forwardedLeads])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      if (tabValue === 6) {
        // Fetch forwarded leads for the forwarded tab
        const response = await axios.get('/api/leads/forwarded/all')
        setForwardedLeads(response.data)
      } else {
        const response = await axios.get('/api/leads')
        setLeads(response.data)
      }
    } catch (error) {
      setError('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const fetchTelecallers = async () => {
    try {
      const response = await axios.get('/api/leads/users/telecallers')
      setTelecallers(response.data)
    } catch (error) {
      console.error('Failed to fetch telecallers:', error)
      // Fallback: try to get from users endpoint
      try {
        const response = await axios.get('/api/users')
        const filteredTelecallers = response.data.filter(user => 
          (user.role === 'telecaller' || (user.role === 'employee' && user.department === 'telecalling'))
        )
        setTelecallers(filteredTelecallers)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/leads/stats/overview')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats, calculating manually:', error)
      calculateManualStats()
    }
  }

  const calculateManualStats = () => {
    const manualStats = {
      total: leads.length,
      converted: leads.filter(lead => lead.status === 'converted').length,
      hot: leads.filter(lead => lead.status === 'hot').length,
      new: leads.filter(lead => lead.status === 'new').length,
      contacted: leads.filter(lead => lead.status === 'contacted').length,
      assigned: leads.filter(lead => lead.status === 'assigned').length,
      future: leads.filter(lead => lead.status === 'future').length,
      dead: leads.filter(lead => lead.status === 'dead').length,
      forwarded: forwardedLeads.length
    }
    setStats(manualStats)
  }

  const handleBulkAssign = async () => {
    if (!selectedTelecaller || selectedLeads.length === 0) {
      setError('Please select telecaller and at least one lead')
      return
    }

    try {
      await axios.post('/api/leads/bulk-assign', {
        leadIds: selectedLeads,
        telecallerId: selectedTelecaller
      })
      fetchLeads()
      setAssignDialog(false)
      setSelectedLeads([])
      setSelectedTelecaller('')
      setSuccess('Leads assigned successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to assign leads: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleAddLead = async () => {
    // Validate form
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (!formData.phone.trim()) errors.phone = 'Phone is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/leads', formData)
      await fetchLeads()
      setOpenDialog(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        course: '',
        source: 'website',
        status: 'new'
      })
      setFormErrors({})
      setSuccess('Lead added successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError('Failed to add lead: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const isValidExcelFile = (file) => {
    const fileName = file.name.toLowerCase()
    const allowedExtensions = ['.xlsx', '.xls', '.csv']
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'text/x-csv',
      'application/vnd.ms-excel'
    ]

    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext))
    const hasValidMimeType = !file.type || allowedMimeTypes.includes(file.type)

    return hasValidExtension && hasValidMimeType
  }

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      setUploadLoading(true);
      setError('');

      const response = await axios.post('/api/leads/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      await fetchLeads();
      setUploadDialog(false);
      setFile(null);
      setSuccess(`${response.data.processed} leads uploaded successfully!`);

    } catch (error) {
      setError('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      if (!isValidExcelFile(selectedFile)) {
        setError('Please select only Excel files (.xlsx, .xls) or CSV files (.csv)')
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError('')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
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
      dead: 'default',
      pending: 'secondary'
    }
    return colors[status] || 'default'
  }

  const filteredLeads = leads.filter(lead => {
    switch (tabValue) {
      case 0: return lead.status === 'new'
      case 1: return lead.status === 'assigned'
      case 2: return lead.status === 'converted'
      case 3: return lead.status === 'hot'
      case 4: return lead.status === 'future'
      case 5: return lead.status === 'dead'
      case 6: return true // Forwarded leads handled separately
      default: return true
    }
  })

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Lead Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            onClick={() => setUploadDialog(true)}
          >
            Upload Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add Lead
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchLeads}
          >
            Refresh
          </Button>
        </Box>
      </Box>

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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Leads
              </Typography>
              <Typography variant="h4">
                {stats.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Converted
              </Typography>
              <Typography variant="h4" color="success.main">
                {stats.converted || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Hot Leads
              </Typography>
              <Typography variant="h4" color="error.main">
                {stats.hot || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Forwarded Leads
              </Typography>
              <Typography variant="h4" color="warning.main">
                {stats.forwarded || forwardedLeads.length || 0}
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
          <Tab label="New Leads" />
          <Tab label="Assigned" />
          <Tab label="Converted" />
          <Tab label="Hot Leads" />
          <Tab label="Future" />
          <Tab label="Dead" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Forward fontSize="small" />
                Forwarded Leads
              </Box>
            }
          />
        </Tabs>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tabValue === 6 ? (
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
                    <TableCell>Lead Info</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tabValue === 6 ? (
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
                      <Typography variant="body2" fontWeight="bold">
                        {lead.forwardedBy ? lead.forwardedBy.name : 'System'}
                      </Typography>
                      {lead.forwardedBy && (
                        <Typography variant="caption" color="text.secondary">
                          {lead.forwardedBy.employeeId}
                        </Typography>
                      )}
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="success">
                          <Person />
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
                        {lead.college && (
                          <Typography variant="body2" color="text.secondary">
                            {lead.college}
                          </Typography>
                        )}
                        {lead.course && (
                          <Typography variant="body2" color="text.secondary">
                            {lead.course}
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
                      <Chip
                        label={lead.source}
                        size="small"
                        variant="outlined"
                      />
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
                      <Typography variant="body2">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="success">
                          <Person />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
              {tabValue === 6 && forwardedLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 4 }}>
                      <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No forwarded leads found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        When telecallers forward leads to other telecallers or admin, they will appear here
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {tabValue !== 6 && filteredLeads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No leads found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Lead Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Add New Lead</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="College"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  name="source"
                  value={formData.source}
                  label="Source"
                  onChange={handleInputChange}
                >
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="referral">Referral</MenuItem>
                  <MenuItem value="social_media">Social Media</MenuItem>
                  <MenuItem value="walkin">Walk-in</MenuItem>
                  <MenuItem value="campaign">Campaign</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="hot">Hot</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddLead}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Lead'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Excel Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Upload Excel File</Typography>
            <IconButton onClick={() => setUploadDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Upload Excel or CSV file containing lead data.
            Supported formats: .xlsx, .xls, .csv
          </Typography>

          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
            Required columns: name, email, phone (college, course, source are optional)
          </Typography>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            {file ? file.name : 'Choose Excel/CSV File'}
            <input
              type="file"
              hidden
              accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Selected: {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="caption" display="block" fontWeight="bold">
              File Requirements:
            </Typography>
            <Typography variant="caption" display="block">
              • Excel (.xlsx, .xls) or CSV (.csv) format only
            </Typography>
            <Typography variant="caption" display="block">
              • First row should contain column headers
            </Typography>
            <Typography variant="caption" display="block">
              • Required columns: name, email, phone
            </Typography>
            <Typography variant="caption" display="block">
              • Optional columns: college, course, source
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleFileUpload}
            variant="contained"
            disabled={!file || uploadLoading}
          >
            {uploadLoading ? <CircularProgress size={24} /> : 'Upload Excel'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Assign Dialog */}
      <Dialog open={assignDialog} onClose={() => setAssignDialog(false)}>
        <DialogTitle>Bulk Assign Leads</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Selected {selectedLeads.length} leads for assignment
          </Typography>
          <TextField
            fullWidth
            select
            label="Assign to Telecaller"
            value={selectedTelecaller}
            onChange={(e) => setSelectedTelecaller(e.target.value)}
          >
            {telecallers.map((telecaller) => (
              <MenuItem key={telecaller._id} value={telecaller._id}>
                {telecaller.name} ({telecaller.employeeId})
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkAssign}
            variant="contained"
            disabled={!selectedTelecaller}
          >
            Assign Leads
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LeadManagement