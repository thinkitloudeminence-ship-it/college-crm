import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Chip,
  Alert,
  Divider,
  Grid,
  LinearProgress,
} from '@mui/material';
import { Phone, CallEnd } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { getLeadForCall, updateLeadStatus, clearCurrentLead } from '../../redux/slices/leadSlice';

const CallInterface = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const [callActive, setCallActive] = useState(false);
  const [callData, setCallData] = useState({
    status: 'contacted',
    callOutcome: '',
    nextFollowUp: '',
    callDuration: 0,
    notes: ''
  });

  const { currentLead, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    if (leadId) {
      dispatch(getLeadForCall(leadId));
    }

    return () => {
      dispatch(clearCurrentLead());
    };
  }, [dispatch, leadId]);

  const handleInitiateCall = () => {
    if (!currentLead) return;

    // Redirect to phone dialer
    const phoneNumber = currentLead.phone;
    window.open(`tel:${phoneNumber}`, '_self');
    
    setCallActive(true);
    
    // Start call timer simulation
    const startTime = Date.now();
    const timer = setInterval(() => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      setCallData(prev => ({ ...prev, callDuration: duration }));
    }, 1000);

    // Store timer for cleanup
    return () => clearInterval(timer);
  };

  const handleEndCall = async () => {
    if (!callData.callOutcome) {
      enqueueSnackbar('Please select a call outcome', { variant: 'warning' });
      return;
    }

    try {
      await dispatch(updateLeadStatus({
        leadId: leadId,
        ...callData
      })).unwrap();
      
      enqueueSnackbar('Call completed successfully', { variant: 'success' });
      navigate('/telecaller/leads');
    } catch (error) {
      enqueueSnackbar('Failed to update lead', { variant: 'error' });
    }
  };

  const callOutcomes = [
    'Not Reachable',
    'Call Back Later',
    'Interested - Send Details',
    'Not Interested',
    'Wrong Number',
    'Already Admitted',
    'Requested Counselling',
    'Converted'
  ];

  if (loading && !currentLead) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  if (!currentLead) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error">
          Lead not found or you don't have permission to access this lead.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Call Interface
      </Typography>

      <Grid container spacing={3}>
        {/* Lead Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Information
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {currentLead.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  {currentLead.phone}
                </Typography>
              </Box>

              {currentLead.currentEducation && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Educational Background
                  </Typography>
                  <Typography variant="body1">
                    {currentLead.currentEducation.qualification} - {currentLead.currentEducation.stream}
                  </Typography>
                </Box>
              )}

              {currentLead.preferredCourses && currentLead.preferredCourses.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Interested Courses
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {currentLead.preferredCourses.map((course, index) => (
                      <Chip 
                        key={index} 
                        label={course} 
                        size="small" 
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography variant="body2" color="textSecondary">
                  Interest Level
                </Typography>
                <Chip 
                  label={currentLead.interestedIn === 'abroad' ? 'Abroad Studies' : 'Domestic Studies'} 
                  color={currentLead.interestedIn === 'abroad' ? 'secondary' : 'primary'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Call Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {!callActive ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Ready to Call
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Click the button below to initiate the call. You will be redirected to your phone's dialer.
                  </Alert>
                  
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Phone />}
                    onClick={handleInitiateCall}
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    Initiate Call to {currentLead.phone}
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Call in Progress
                  </Typography>
                  
                  <Box textAlign="center" sx={{ mb: 3 }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {Math.floor(callData.callDuration / 60)}:{(callData.callDuration % 60).toString().padStart(2, '0')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Call Duration
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Call Outcome
                  </Typography>
                  
                  <TextField
                    select
                    fullWidth
                    value={callData.callOutcome}
                    onChange={(e) => setCallData({ ...callData, callOutcome: e.target.value })}
                    margin="normal"
                    label="Select Outcome"
                    required
                  >
                    {callOutcomes.map((outcome) => (
                      <MenuItem key={outcome} value={outcome}>
                        {outcome}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={callData.status}
                    onChange={(e) => setCallData({ ...callData, status: e.target.value })}
                    margin="normal"
                  >
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="interested">Interested</MenuItem>
                    <MenuItem value="not_interested">Not Interested</MenuItem>
                    <MenuItem value="converted">Converted</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Next Follow-up Date & Time"
                    type="datetime-local"
                    value={callData.nextFollowUp}
                    onChange={(e) => setCallData({ ...callData, nextFollowUp: e.target.value })}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    fullWidth
                    label="Additional Notes"
                    multiline
                    rows={3}
                    value={callData.notes}
                    onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                    margin="normal"
                  />

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<CallEnd />}
                      onClick={handleEndCall}
                      fullWidth
                      disabled={!callData.callOutcome}
                    >
                      End Call & Save
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallInterface;