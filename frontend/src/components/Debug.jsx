import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

const Debug = ({ message, data }) => {
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'warning.light' }}>
      <Typography variant="h6" color="warning.dark">
        Debug: {message}
      </Typography>
      <Typography variant="body2" component="pre">
        {JSON.stringify(data, null, 2)}
      </Typography>
    </Paper>
  )
}

export default Debug