import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Phone,
  Assignment,
  Search,
  FilterList,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { getLeads, assignLeads } from '../../redux/slices/leadSlice'
import { getEmployees } from '../../redux/slices/employeeSlice'

const LeadManagement = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    assignedTo: '',
  })
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedLeads, setSelectedLeads] = useState([])
  const [assignmentData, setAssignmentData] = useState({
    employeeId: '',
  })

  const { leads, loading } = useSelector((state) => state.leads)
  const { employees } = useSelector((state) => state.employees)

  useEffect(() => {
    loadLeads()
    loadEmployees()
  }, [])

  const loadLeads = async () => {
    try {
      await dispatch(getLeads()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load leads', { variant: 'error' })
    }
  }

  const loadEmployees = async () => {
    try {
      await dispatch(getEmployees()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load employees', { variant: 'error' })
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleAssignLeads = async () => {
    if (!assignmentData.employeeId || selectedLeads.length === 0) {
      enqueueSnackbar('Please select leads and a telecaller', { variant: 'warning' })
      return
    }

    try {
      await dispatch(assignLeads({
        leadIds: selectedLeads,
        employeeId: assignmentData.employeeId
      })).unwrap()
      
      enqueueSnackbar(`Successfully assigned ${selectedLeads.length} leads`, { variant: 'success' })
      setAssignDialogOpen(false)
      setSelectedLeads([])
      setAssignmentData({ employeeId: '' })
      loadLeads()
    } catch (error) {
      enqueueSnackbar('Failed to assign leads', { variant: 'error' })
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'primary',
      contacted: 'info',
      interested: 'warning',
      converted: 'success',
      not_interested: 'error',
      admitted: 'success',
      lost: 'error',
    }
    return colors[status] || 'default'
  }

  const getSourceColor = (source) => {
    const colors = {
      manual_upload: 'primary',
      facebook: 'info',
      instagram: 'secondary',
      whatsapp: 'success',
      website: 'warning',
      reference: 'default',
    }
    return colors[source] || 'default'
  }

  const formatSource = (source) => {
    const sourceMap = {
      manual_upload: 'Manual Upload',
      facebook: 'Facebook',
      instagram: 'Instagram',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      youtube: 'YouTube',
      website: 'Website',
      reference: 'Reference',
      walkin: 'Walk-in',
      seminar: 'Seminar',
      other: 'Other',
    }
    return sourceMap[source] || source
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !filters.search || 
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.phone.includes(filters.search)
    const matchesStatus = !filters.status || lead.status === filters.status
    const matchesSource = !filters.source || lead.source === filters.source
    const matchesAssigned = !filters.assignedTo || 
      (filters.assignedTo === 'unassigned' ? !lead.assignedTo : lead.assignedTo?._id === filters.assignedTo)

    return matchesSearch && matchesStatus && matchesSource && matchesAssigned
  })

  const telecallers = employees.filter(emp => emp.designation === 'telecaller' && emp.isActive)

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Lead Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAssignDialogOpen(true)}
          disabled={selectedLeads.length === 0}
        >
          Assign Selected ({selectedLeads.length})
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search leads..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                  <MenuItem value="not_interested">Not Interested</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  value={filters.source}
                  label="Source"
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                  <MenuItem value="">All Sources</MenuItem>
                  <MenuItem value="manual_upload">Manual Upload</MenuItem>
                  <MenuItem value="facebook">Facebook</MenuItem>
                  <MenuItem value="instagram">Instagram</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={filters.assignedTo}
                  label="Assigned To"
                  onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="unassigned">Unassigned</MenuItem>
                  {telecallers.map(telecaller => (
                    <MenuItem key={telecaller._id} value={telecaller._id}>
                      {telecaller.name} ({telecaller.employeeId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilters({
                  search: '',
                  status: '',
                  source: '',
                  assignedTo: '',
                })}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <Grid container spacing={3}>
        {filteredLeads.map((lead) => (
          <Grid item xs={12} sm={6} md={4} key={lead._id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                border: selectedLeads.includes(lead._id) ? '2px solid' : '1px solid',
                borderColor: selectedLeads.includes(lead._id) ? 'primary.main' : 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                },
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
                {/* Lead Header */}
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {lead.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" fontFamily="monospace">
                      {lead.phone}
                    </Typography>
                  </Box>
                  <Chip
                    label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    color={getStatusColor(lead.status)}
                    size="small"
                  />
                </Box>

                {/* Lead Details */}
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

                {/* Tags and Meta */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Chip
                      label={formatSource(lead.source)}
                      color={getSourceColor(lead.source)}
                      size="small"
                      sx={{ mr: 1 }}
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
                  <Typography variant="caption" color="textSecondary">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Leads Message */}
      {filteredLeads.length === 0 && (
        <Box textAlign="center" py={6}>
          <Phone sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No leads found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {leads.length === 0 ? 'No leads in the system yet.' : 'Try adjusting your filters.'}
          </Typography>
        </Box>
      )}

      {/* Assign Leads Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Leads to Telecaller</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Assigning {selectedLeads.length} selected leads to:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Telecaller</InputLabel>
            <Select
              value={assignmentData.employeeId}
              label="Select Telecaller"
              onChange={(e) => setAssignmentData({ employeeId: e.target.value })}
            >
              {telecallers.map(telecaller => (
                <MenuItem key={telecaller._id} value={telecaller._id}>
                  {telecaller.name} ({telecaller.employeeId}) - {telecaller.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
  )
}

export default LeadManagement