import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
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
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Edit,
  Update
} from '@mui/icons-material'
import axios from 'axios'

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [updateData, setUpdateData] = useState({
    status: '',
    progress: 0,
    comment: ''
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks')
      setTasks(response.data)
    } catch (error) {
      setError('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (task) => {
    setSelectedTask(task)
    setUpdateData({
      status: task.status,
      progress: task.progress,
      comment: ''
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedTask(null)
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/tasks/${selectedTask._id}`, updateData)
      
      // Add comment if provided
      if (updateData.comment) {
        await axios.post(`/api/tasks/${selectedTask._id}/comments`, {
          comment: updateData.comment
        })
      }
      
      fetchTasks()
      handleCloseDialog()
    } catch (error) {
      setError('Failed to update task')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in_progress': return 'warning'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
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
        My Tasks
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {task.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {task.project || 'General'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.priority} 
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status} 
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                        <Box 
                          sx={{ 
                            width: `${task.progress}%`,
                            height: 8,
                            bgcolor: 'primary.main',
                            borderRadius: 1
                          }} 
                        />
                      </Box>
                      <Typography variant="body2">
                        {task.progress}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDialog(task)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Update Task Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Update Task Progress
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {selectedTask?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedTask?.description}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={updateData.status}
                onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Progress %"
                type="number"
                value={updateData.progress}
                onChange={(e) => setUpdateData({ ...updateData, progress: parseInt(e.target.value) })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Comment"
                multiline
                rows={3}
                value={updateData.comment}
                onChange={(e) => setUpdateData({ ...updateData, comment: e.target.value })}
                placeholder="Add updates about your progress..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmployeeTasks