import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
} from '@mui/material'
import {
  Person,
  Email,
  Phone,
  Assignment,
  Business,
} from '@mui/icons-material'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading profile...</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {user.name}
              </Typography>
              
              <Chip
                label={user.role === 'admin' ? 'Administrator' : 
                       user.designation ? user.designation.charAt(0).toUpperCase() + user.designation.slice(1) : 'Employee'}
                color="primary"
                sx={{ mb: 2 }}
              />
              
              {user.employeeId && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Employee ID: {user.employeeId}
                </Typography>
              )}
              
              <Typography variant="body2" color="textSecondary">
                {user.department && `${user.department.charAt(0).toUpperCase() + user.department.slice(1)} Department`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Person color="primary" />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Email color="primary" />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {user.phone && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Phone color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {user.employeeId && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Assignment color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Employee ID
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.employeeId}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {user.department && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Business color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Department
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.department.charAt(0).toUpperCase() + user.department.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {user.designation && (
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Business color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Designation
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {user.designation.charAt(0).toUpperCase() + user.designation.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Information */}
        {user.profile && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={3}>
                  {user.profile.address && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {user.profile.address}
                      </Typography>
                    </Grid>
                  )}
                  {user.profile.city && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        City
                      </Typography>
                      <Typography variant="body1">
                        {user.profile.city}
                      </Typography>
                    </Grid>
                  )}
                  {user.profile.dateOfJoining && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        Date of Joining
                      </Typography>
                      <Typography variant="body1">
                        {new Date(user.profile.dateOfJoining).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default Profile