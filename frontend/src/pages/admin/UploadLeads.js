import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import { CloudUpload, Assignment, People } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { uploadLeads, assignLeads } from '../../redux/slices/leadSlice';

const UploadLeads = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    employeeId: '',
    leadsPerTelecaller: 100
  });

  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const { loading } = useSelector((state) => state.leads);

  const telecallers = employees.filter(emp => 
    emp.designation === 'telecaller' && emp.isActive
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await dispatch(uploadLeads(formData)).unwrap();
      setUploadResult(result);
      setActiveStep(1);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleAssignLeads = async (bulk = false) => {
    try {
      if (bulk) {
        // Bulk assign to all telecallers
        await dispatch(assignLeads({
          leadsPerTelecaller: assignmentData.leadsPerTelecaller
        })).unwrap();
      } else {
        // Assign to specific telecaller
        if (!assignmentData.employeeId) return;
        
        // Here you would typically select specific lead IDs
        // For now, this is a simplified version
        await dispatch(assignLeads({
          employeeId: assignmentData.employeeId,
          leadIds: [] // This would be populated with actual lead IDs
        })).unwrap();
      }
      
      setActiveStep(2);
    } catch (error) {
      console.error('Assignment failed:', error);
    }
  };

  const steps = [
    {
      label: 'Upload Excel File',
      description: 'Upload your leads data in Excel format',
    },
    {
      label: 'Assign Leads',
      description: 'Assign uploaded leads to telecallers',
    },
    {
      label: 'Confirmation',
      description: 'Leads assigned successfully',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload & Assign Leads
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              
              {index === 0 && (
                <Box sx={{ mt: 2 }}>
                  <input
                    accept=".xlsx,.xls"
                    style={{ display: 'none' }}
                    id="excel-upload"
                    type="file"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="excel-upload">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUpload />}
                      disabled={loading}
                    >
                      Select Excel File
                    </Button>
                  </label>
                  
                  {selectedFile && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Selected file: {selectedFile.name}
                    </Alert>
                  )}

                  {uploadResult && (
                    <Card sx={{ mt: 2 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Upload Results
                        </Typography>
                        <Typography color="success.main">
                          Successfully uploaded: {uploadResult.data.uploaded} leads
                        </Typography>
                        {uploadResult.data.errors && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            {uploadResult.data.errors.length} errors found
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}

              {index === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Bulk Assignment
                  </Typography>
                  
                  <TextField
                    select
                    label="Leads per Telecaller"
                    value={assignmentData.leadsPerTelecaller}
                    onChange={(e) => setAssignmentData({
                      ...assignmentData,
                      leadsPerTelecaller: e.target.value
                    })}
                    sx={{ mr: 2, minWidth: 150 }}
                  >
                    {[50, 100, 150, 200].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} leads
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    onClick={() => handleAssignLeads(true)}
                    disabled={loading || !uploadResult}
                    startIcon={<People />}
                  >
                    Assign to All Telecallers
                  </Button>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Specific Assignment
                  </Typography>

                  <TextField
                    select
                    label="Select Telecaller"
                    value={assignmentData.employeeId}
                    onChange={(e) => setAssignmentData({
                      ...assignmentData,
                      employeeId: e.target.value
                    })}
                    sx={{ mr: 2, minWidth: 200 }}
                  >
                    {telecallers.map((telecaller) => (
                      <MenuItem key={telecaller._id} value={telecaller._id}>
                        {telecaller.name} ({telecaller.employeeId})
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="outlined"
                    onClick={() => handleAssignLeads(false)}
                    disabled={loading || !assignmentData.employeeId}
                    startIcon={<Assignment />}
                  >
                    Assign to Selected
                  </Button>
                </Box>
              )}

              {index === 2 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Leads have been successfully assigned to telecallers!
                </Alert>
              )}

              {loading && <LinearProgress sx={{ mt: 2 }} />}
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {/* Sample Excel Format */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Excel File Format
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Your Excel file should have the following columns:
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Column Name</TableCell>
                  <TableCell>Required</TableCell>
                  <TableCell>Example</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Student Name / name</TableCell>
                  <TableCell><Chip label="Required" color="error" size="small" /></TableCell>
                  <TableCell>John Doe</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Phone / phone</TableCell>
                  <TableCell><Chip label="Required" color="error" size="small" /></TableCell>
                  <TableCell>9876543210</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email / email</TableCell>
                  <TableCell><Chip label="Optional" color="default" size="small" /></TableCell>
                  <TableCell>john@example.com</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gender / gender</TableCell>
                  <TableCell><Chip label="Required" color="error" size="small" /></TableCell>
                  <TableCell>Male/Female/Other</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Stream / stream</TableCell>
                  <TableCell><Chip label="Required" color="error" size="small" /></TableCell>
                  <TableCell>Science/Commerce/Arts</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadLeads;