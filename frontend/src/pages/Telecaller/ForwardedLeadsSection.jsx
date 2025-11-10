// import React, { useState, useEffect } from 'react';
// import {
//   Paper,
//   Typography,
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Button,
//   Alert
// } from '@mui/material';
// import { Forward, Visibility } from '@mui/icons-material';
// import axios from 'axios';

// const ForwardedLeadsSection = () => {
//   const [forwardedLeads, setForwardedLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchForwardedLeads();
//   }, []);

//   const fetchForwardedLeads = async () => {
//     try {
//       const response = await axios.get('/api/leads/forwarded/my-forwards');
//       setForwardedLeads(response.data);
//     } catch (error) {
//       setError('Failed to fetch forwarded leads');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       new: 'default',
//       assigned: 'primary',
//       contacted: 'info',
//       hot: 'error',
//       converted: 'success',
//       future: 'warning',
//       dead: 'default'
//     };
//     return colors[status] || 'default';
//   };

//   if (loading) {
//     return <Typography>Loading forwarded leads...</Typography>;
//   }

//   return (
//     <Paper sx={{ p: 3, mt: 3 }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//           Leads Forwarded by Me
//         </Typography>
//         <Button 
//           variant="outlined" 
//           size="small"
//           onClick={fetchForwardedLeads}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {forwardedLeads.length === 0 ? (
//         <Box sx={{ textAlign: 'center', py: 4 }}>
//           <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
//           <Typography variant="body1" color="text.secondary">
//             No leads forwarded yet
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             When you forward leads to other telecallers or admin, they will appear here
//           </Typography>
//         </Box>
//       ) : (
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Lead Information</TableCell>
//                 <TableCell>Forwarded To</TableCell>
//                 <TableCell>Reason</TableCell>
//                 <TableCell>Forward Date</TableCell>
//                 <TableCell>Current Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {forwardedLeads.map((lead) => (
//                 <TableRow key={lead._id}>
//                   <TableCell>
//                     <Typography variant="body1" fontWeight="bold">
//                       {lead.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {lead.phone} • {lead.email}
//                     </Typography>
//                     {lead.college && (
//                       <Typography variant="caption" color="text.secondary">
//                         {lead.college}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" fontWeight="bold">
//                       {lead.forwardedTo ? lead.forwardedTo.name : 'Admin'}
//                     </Typography>
//                     {lead.forwardedTo && (
//                       <Typography variant="caption" color="text.secondary">
//                         {lead.forwardedTo.employeeId}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {lead.forwardReason}
//                     </Typography>
//                     {lead.forwardNotes && (
//                       <Typography variant="caption" color="text.secondary">
//                         {lead.forwardNotes}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {new Date(lead.forwardedAt).toLocaleDateString()}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {new Date(lead.forwardedAt).toLocaleTimeString()}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={lead.status} 
//                       color={getStatusColor(lead.status)}
//                       size="small"
//                     />
//                   </TableCell>
//                   <TableCell>
//                     <Button 
//                       size="small" 
//                       startIcon={<Visibility />}
//                       onClick={() => window.location.href = `/telecaller/leads/${lead._id}`}
//                     >
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Paper>
//   );
// };

// export default ForwardedLeadsSection;




import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Forward, Visibility, AdminPanelSettings } from '@mui/icons-material';
import axios from 'axios';

const ForwardedLeadsSection = ({ isAdmin = false }) => {
  const [forwardedLeads, setForwardedLeads] = useState([]);
  const [allForwardedLeads, setAllForwardedLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchForwardedLeads();
  }, [isAdmin, tabValue]);

  const fetchForwardedLeads = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isAdmin) {
        response = await axios.get('/api/leads/forwarded/all');
        setAllForwardedLeads(response.data);
      } else {
        if (tabValue === 0) {
          response = await axios.get('/api/leads/forwarded/my-forwards');
        } else {
          response = await axios.get('/api/leads/forwarded/received');
        }
        setForwardedLeads(response.data);
      }
    } catch (error) {
      setError('Failed to fetch forwarded leads');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'default',
      assigned: 'primary',
      contacted: 'info',
      hot: 'error',
      converted: 'success',
      future: 'warning',
      dead: 'default'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Typography>Loading forwarded leads...</Typography>;
  }

  const leadsToShow = isAdmin ? allForwardedLeads : forwardedLeads;

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {isAdmin ? 'All Forwarded Leads' : 'Forwarded Leads'}
          </Typography>
          {isAdmin && <AdminPanelSettings color="action" />}
        </Box>
        
        {!isAdmin && (
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Forwarded by Me" />
            <Tab label="Forwarded to Me" />
          </Tabs>
        )}
        
        <Button 
          variant="outlined" 
          size="small"
          onClick={fetchForwardedLeads}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {leadsToShow.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Forward sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            {isAdmin ? 'No leads have been forwarded yet' : 
             tabValue === 0 ? 'No leads forwarded yet' : 'No leads forwarded to you yet'}
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead Information</TableCell>
                {isAdmin && <TableCell>Forwarded By</TableCell>}
                <TableCell>Forwarded To</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Forward Date</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadsToShow.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
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
                  </TableCell>
                  {isAdmin && (
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
                  )}
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
                    <Button 
                      size="small" 
                      startIcon={<Visibility />}
                      onClick={() => window.location.href = isAdmin ? 
                        `/admin/leads/${lead._id}` : `/telecaller/leads/${lead._id}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ForwardedLeadsSection;