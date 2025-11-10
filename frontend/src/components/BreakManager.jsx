import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import {
  FreeBreakfast,
  LunchDining,
  MeetingRoom,
  Wash,
  Timer
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BreakManager = () => {
  const [breakDialogOpen, setBreakDialogOpen] = useState(false);
  const [activeBreak, setActiveBreak] = useState(null);
  const [breakTimer, setBreakTimer] = useState(0);
  const [breakData, setBreakData] = useState({
    type: 'tea',
    reason: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    let interval;
    if (activeBreak) {
      interval = setInterval(() => {
        setBreakTimer(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [activeBreak]);

  const breakTypes = [
    { value: 'tea', label: 'Tea Break', icon: <FreeBreakfast />, duration: 15 },
    { value: 'lunch', label: 'Lunch Break', icon: <LunchDining />, duration: 45 },
    { value: 'meeting', label: 'Meeting', icon: <MeetingRoom />, duration: 30 },
    { value: 'washroom', label: 'Washroom Break', icon: <Wash />, duration: 10 },
    { value: 'other', label: 'Other', icon: <Timer />, duration: 15 }
  ];

  const startBreak = async () => {
    try {
      await axios.post('/api/attendance/break/start', {
        breakType: breakData.type,
        reason: breakData.reason
      });
      
      const selectedBreak = breakTypes.find(b => b.value === breakData.type);
      setActiveBreak({
        type: breakData.type,
        label: selectedBreak.label,
        startTime: new Date(),
        duration: selectedBreak.duration
      });
      
      setBreakDialogOpen(false);
      setBreakTimer(0);
    } catch (error) {
      console.error('Error starting break:', error);
    }
  };

  const endBreak = async () => {
    try {
      await axios.post('/api/attendance/break/end');
      setActiveBreak(null);
      setBreakTimer(0);
    } catch (error) {
      console.error('Error ending break:', error);
    }
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };

  return (
    <Box>
      {/* Active Break Display */}
      {activeBreak && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.light' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" color="warning.dark">
                On {activeBreak.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duration: {formatTime(breakTimer)} / {formatTime(activeBreak.duration)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Started: {activeBreak.startTime.toLocaleTimeString()}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              color="error"
              onClick={endBreak}
            >
              End Break
            </Button>
          </Box>
        </Paper>
      )}

      {/* Break Buttons */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {breakTypes.map((breakType) => (
          <Button
            key={breakType.value}
            variant={activeBreak ? "outlined" : "contained"}
            startIcon={breakType.icon}
            onClick={() => {
              setBreakData({ type: breakType.value, reason: '' });
              setBreakDialogOpen(true);
            }}
            disabled={!!activeBreak}
            sx={{ 
              minWidth: '120px',
              flex: '1 1 calc(33.333% - 8px)'
            }}
          >
            {breakType.label}
          </Button>
        ))}
      </Box>

      {/* Break Dialog */}
      <Dialog open={breakDialogOpen} onClose={() => setBreakDialogOpen(false)}>
        <DialogTitle>
          Start {breakTypes.find(b => b.value === breakData.type)?.label}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Break Type"
            value={breakData.type}
            onChange={(e) => setBreakData({ ...breakData, type: e.target.value })}
            sx={{ mt: 2 }}
          >
            {breakTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {type.icon}
                  {type.label} ({type.duration} min)
                </Box>
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Reason (Optional)"
            multiline
            rows={2}
            value={breakData.reason}
            onChange={(e) => setBreakData({ ...breakData, reason: e.target.value })}
            sx={{ mt: 2 }}
            placeholder="Brief reason for the break..."
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            Recommended duration: {breakTypes.find(b => b.value === breakData.type)?.duration} minutes
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreakDialogOpen(false)}>Cancel</Button>
          <Button onClick={startBreak} variant="contained">
            Start Break
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BreakManager;