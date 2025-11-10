// import React, { useState } from 'react'
// import {
//   Container,
//   Paper,
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Alert
// } from '@mui/material'
// import { useAuth } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'

// const Login = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
  
//   const { login } = useAuth()
//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     const result = await login(email, password)
    
//     if (result.success) {
//       navigate('/')
//     } else {
//       setError(result.message)
//     }
    
//     setLoading(false)
//   }

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//         }}
//       >
//         <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
//           <Typography component="h1" variant="h4" align="center" gutterBottom>
//             CRM System
//           </Typography>
//           <Typography component="h2" variant="h5" align="center" gutterBottom>
//             Sign In
//           </Typography>
          
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

//           <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Email Address"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Password"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={loading}
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </Button>
//           </Box>

//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="text.secondary" align="center">
//               Demo Credentials:
//             </Typography>
//             <Typography variant="body2" color="text.secondary" align="center">
//               Admin: admin@crm.com / admin123
//             </Typography>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   )
// }

// export default Login



import React, { useState } from 'react'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
    
    setLoading(false)
  }

  const demoCredentials = [
    { role: 'Admin', email: 'admin@crm.com', password: 'admin123' },
    { role: 'Manager', email: 'manager@crm.com', password: 'manager123' },
    { role: 'Employee', email: 'employee@crm.com', password: 'employee123' },
    { role: 'Telecaller', email: 'telecaller@crm.com', password: 'telecaller123' }
  ]

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: 6, 
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            borderRadius: 2,
            mb: 4
          }}
        >
          <Typography component="h1" variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            CRM System
          </Typography>
          <Typography variant="h6">
            Employee Management & Lead Tracking System
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 4, width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Login Form */}
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Typography component="h2" variant="h4" align="center" gutterBottom color="primary">
              Sign In
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </Paper>

          {/* Demo Credentials */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Demo Credentials
            </Typography>
            {demoCredentials.map((cred, index) => (
              <Card 
                key={index} 
                sx={{ mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }}
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
              >
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {cred.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {cred.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Password: {cred.password}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Features */}
        <Box sx={{ mt: 6, textAlign: 'center', width: '100%' }}>
          <Typography variant="h5" gutterBottom color="primary">
            Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mt: 2 }}>
            {[
              'Multi-role Access Control',
              'Lead Management',
              'Task Tracking',
              'Real-time Chat',
              'Attendance System',
              'Performance Reports',
              'Email Integration',
              'Break Management'
            ].map((feature, index) => (
              <Chip 
                key={index}
                label={feature}
                variant="outlined"
                color="primary"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login