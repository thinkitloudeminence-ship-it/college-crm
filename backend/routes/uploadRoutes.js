// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const Lead = require('../models/Lead');
// const User = require('../models/User');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Configure multer for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//         file.mimetype === 'application/vnd.ms-excel') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only Excel files are allowed'), false);
//     }
//   }
// });

// // Upload Excel file and create leads
// router.post('/leads', auth, authorize('admin'), upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet);

//     if (data.length === 0) {
//       return res.status(400).json({ message: 'Excel file is empty' });
//     }

//     const leads = [];
//     const errors = [];

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       try {
//         // Validate required fields
//         if (!row.name || !row.email || !row.phone) {
//           errors.push(`Row ${i + 2}: Missing required fields (name, email, phone)`);
//           continue;
//         }

//         const lead = new Lead({
//           name: row.name,
//           email: row.email,
//           phone: row.phone.toString(),
//           college: row.college || '',
//           course: row.course || '',
//           city: row.city || '',
//           source: 'manual',
//           status: 'new',
//           assignedBy: req.user._id
//         });

//         leads.push(lead);
//       } catch (error) {
//         errors.push(`Row ${i + 2}: ${error.message}`);
//       }
//     }

//     if (leads.length > 0) {
//       await Lead.insertMany(leads);
//     }

//     res.json({
//       message: `Successfully processed ${leads.length} leads`,
//       imported: leads.length,
//       errors: errors,
//       failed: errors.length
//     });

//   } catch (error) {
//     console.error('Upload leads error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;









// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const Lead = require('../models/Lead');
// const User = require('../models/User');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Configure multer for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//         file.mimetype === 'application/vnd.ms-excel') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only Excel files are allowed'), false);
//     }
//   }
// });

// // Upload Excel file and create leads
// router.post('/leads', auth, authorize('admin'), upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet);

//     if (data.length === 0) {
//       return res.status(400).json({ message: 'Excel file is empty' });
//     }

//     const leads = [];
//     const errors = [];

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       try {
//         // Validate required fields
//         if (!row.name || !row.email || !row.phone) {
//           errors.push(`Row ${i + 2}: Missing required fields (name, email, phone)`);
//           continue;
//         }

//         const lead = new Lead({
//           name: row.name,
//           email: row.email,
//           phone: row.phone.toString(),
//           college: row.college || '',
//           course: row.course || '',
//           city: row.city || '',
//           source: 'manual',
//           status: 'new',
//           assignedBy: req.user._id
//         });

//         leads.push(lead);
//       } catch (error) {
//         errors.push(`Row ${i + 2}: ${error.message}`);
//       }
//     }

//     if (leads.length > 0) {
//       await Lead.insertMany(leads);
//     }

//     res.json({
//       message: `Successfully processed ${leads.length} leads`,
//       imported: leads.length,
//       errors: errors,
//       failed: errors.length
//     });

//   } catch (error) {
//     console.error('Upload leads error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Assign leads to telecaller in bulk
// router.post('/assign-bulk', auth, authorize('admin'), async (req, res) => {
//   try {
//     const { leadIds, telecallerId } = req.body;

//     if (!leadIds || !Array.isArray(leadIds) || !telecallerId) {
//       return res.status(400).json({ message: 'Invalid request data' });
//     }

//     // Verify telecaller exists
//     const telecaller = await User.findOne({ 
//       _id: telecallerId, 
//       role: 'telecaller' 
//     });
    
//     if (!telecaller) {
//       return res.status(400).json({ message: 'Invalid telecaller' });
//     }

//     const result = await Lead.updateMany(
//       { _id: { $in: leadIds } },
//       { 
//         assignedTo: telecallerId,
//         status: 'assigned',
//         $push: {
//           timeline: {
//             action: 'bulk_assigned',
//             remarks: `Bulk assigned to ${telecaller.name}`,
//             updatedBy: req.user._id
//           }
//         }
//       }
//     );

//     res.json({ 
//       message: `${result.modifiedCount} leads assigned to ${telecaller.name}`,
//       assignedCount: result.modifiedCount
//     });

//   } catch (error) {
//     console.error('Bulk assign error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow Excel and CSV files
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv',
      'application/csv',
      'text/x-csv',
      'text/comma-separated-values'
    ];
    
    // Check file extension as fallback
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed'), false);
    }
  }
});

// Upload Excel/CSV file and create leads
router.post('/upload', auth, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received:', {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    const leads = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        // Validate required fields
        if (!row.name || !row.email || !row.phone) {
          errors.push(`Row ${i + 2}: Missing required fields (name, email, phone)`);
          continue;
        }

        const lead = new Lead({
          name: row.name,
          email: row.email,
          phone: row.phone.toString(),
          college: row.college || '',
          course: row.course || '',
          city: row.city || '',
          source: row.source || 'excel_upload',
          status: 'new',
          assignedBy: req.user._id
        });

        leads.push(lead);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    if (leads.length > 0) {
      await Lead.insertMany(leads);
    }

    res.json({
      message: `Successfully processed ${leads.length} leads`,
      processed: leads.length,
      errors: errors,
      failed: errors.length
    });

  } catch (error) {
    console.error('Upload leads error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Alternative upload endpoint
router.post('/bulk-upload', auth, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Bulk upload - File received:', req.file.originalname);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const leads = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row.name || !row.email || !row.phone) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        const lead = new Lead({
          name: row.name,
          email: row.email,
          phone: row.phone.toString(),
          college: row.college || '',
          course: row.course || '',
          city: row.city || '',
          source: row.source || 'bulk_upload',
          status: 'new',
          assignedBy: req.user._id
        });

        leads.push(lead);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    if (leads.length > 0) {
      await Lead.insertMany(leads);
    }

    res.json({
      message: `Successfully imported ${leads.length} leads`,
      count: leads.length,
      errors: errors
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Import endpoint
router.post('/import', auth, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Import - File received:', req.file.originalname);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const leads = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row.name || !row.email || !row.phone) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        const lead = new Lead({
          name: row.name,
          email: row.email,
          phone: row.phone.toString(),
          college: row.college || '',
          course: row.course || '',
          city: row.city || '',
          source: row.source || 'import',
          status: 'new',
          assignedBy: req.user._id
        });

        leads.push(lead);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    if (leads.length > 0) {
      await Lead.insertMany(leads);
    }

    res.json({
      message: `Successfully imported ${leads.length} leads`,
      imported: leads.length,
      errors: errors
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Assign leads to telecaller in bulk
router.post('/assign-bulk', auth, authorize('admin'), async (req, res) => {
  try {
    const { leadIds, telecallerId } = req.body;

    if (!leadIds || !Array.isArray(leadIds) || !telecallerId) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Verify telecaller exists
    const telecaller = await User.findOne({ 
      _id: telecallerId, 
      role: 'telecaller' 
    });
    
    if (!telecaller) {
      return res.status(400).json({ message: 'Invalid telecaller' });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      { 
        assignedTo: telecallerId,
        status: 'assigned',
        $push: {
          timeline: {
            action: 'bulk_assigned',
            remarks: `Bulk assigned to ${telecaller.name}`,
            updatedBy: req.user._id
          }
        }
      }
    );

    res.json({ 
      message: `${result.modifiedCount} leads assigned to ${telecaller.name}`,
      assignedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bulk assign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;