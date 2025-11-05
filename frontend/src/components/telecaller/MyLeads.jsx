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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import {
  Phone,
  Search,
  FilterList,
  Call,
  Schedule,
} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { getTelecallerLeads, updateLeadStatus } from '../../redux/slices/leadSlice'

const MyLeads = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
  })
  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [callData, setCallData] = useState({
    status: 'contacted',
    callOutcome: '',
    nextFollowUp: '',
    notes: '',
  })

  const { telecallerLeads, loading } = useSelector((state) => state.leads)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      await dispatch(getTelecallerLeads()).unwrap()
    } catch (error) {
      enqueueSnackbar('Failed to load leads', { variant: 'error' })
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const handleCallInitiate = (lead) => {
    setSelectedLead(lead)
    setCallDialogOpen(true)
    // In a real app, this would trigger the actual phone call
    console.log('Initiating call to:', lead.phone)
  }

  const handleCallSubmit = async () => {
    if (!selectedLead || !callData.callOutcome) {
      enqueueSnackbar('Please fill in call outcome', { variant: 'warning' })
      return
    }

    try {
      await dispatch(updateLeadStatus({
        leadId: selectedLead._id,
        ...callData
      })).unwrap()
      
      enqueueSnackbar('Call logged successfully', { variant: 'success' })
      setCallDialogOpen(false)
      setSelectedLead(null)
      setCallData({
        status: 'contacted',
        callOutcome: '',
        nextFollowUp: '',
        notes: '',
      })
      loadLeads()
    } catch (error) {
      enqueueSnackbar('Failed to update lead', { variant: 'error' })
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

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'default',
      medium: 'primary',
      high: 'warning',
      urgent: 'error',
    }
    return colors[priority] || 'default'
  }

  const callOutcomes = [
    'Not Reachable',
    'Call Back Later',
    'Interested - Send Details',
    'Not Interested',
    'Wrong Number',
    'Already Admitted Elsewhere',
    'Requested Counselling',
    'Converted - Admission Confirmed',
  ]

  const filteredLeads = telecallerLeads.filter(lead => {
    const matchesSearch = !filters.search || 
      lead.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = !filters.status || lead.status === filters.status
    const matchesPriority = !filters.priority || lead.priority === filters.priority

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Leads
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {filteredLeads.length} leads assigned
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="">All Priority</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
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
                  priority: '',
                })}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead Name</TableCell>
                  <TableCell>Education</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Last Contact</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {lead.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {lead.currentEducation?.qualification}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {lead.currentEducation?.stream}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {lead.currentEducation?.board}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.interestedIn === 'abroad' ? 'Abroad' : 'Domestic'}
                        color={lead.interestedIn === 'abroad' ? 'secondary' : 'primary'}
                        size="small"
                      />
                      {lead.preferredCourses && lead.preferredCourses.length > 0 && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          {lead.preferredCourses.slice(0, 2).join(', ')}
                          {lead.preferredCourses.length > 2 && '...'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        color={getStatusColor(lead.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                        color={getPriorityColor(lead.priority)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {lead.callHistory && lead.callHistory.length > 0
                          ? new Date(lead.callHistory[lead.callHistory.length - 1].callDate).toLocaleDateString()
                          : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleCallInitiate(lead)}
                          title="Call Lead"
                        >
                          <Call />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => navigate(`/telecaller/call/${lead._id}`)}
                          title="Call Details"
                        >
                          <Phone />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLeads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Phone sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No leads found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {telecallerLeads.length === 0 
                          ? 'No leads assigned to you yet.' 
                          : 'Try adjusting your filters.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Call Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Call Lead: {selectedLead?.name}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Call Outcome</InputLabel>
              <Select
                value={callData.callOutcome}
                label="Call Outcome"
                onChange={(e) => setCallData({ ...callData, callOutcome: e.target.value })}
                required
              >
                {callOutcomes.map((outcome) => (
                  <MenuItem key={outcome} value={outcome}>
                    {outcome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={callData.status}
                label="Status"
                onChange={(e) => setCallData({ ...callData, status: e.target.value })}
              >
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="interested">Interested</MenuItem>
                <MenuItem value="not_interested">Not Interested</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Next Follow-up"
              type="datetime-local"
              value={callData.nextFollowUp}
              onChange={(e) => setCallData({ ...callData, nextFollowUp: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={callData.notes}
              onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
              placeholder="Add call notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCallDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCallSubmit} 
            variant="contained"
            disabled={!callData.callOutcome}
          >
            Save Call Log
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyLeads