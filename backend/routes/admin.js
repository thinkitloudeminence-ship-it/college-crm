// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const XLSX = require('xlsx');
// const multer = require('multer');
// const Employee = require('../models/Employee');
// const Lead = require('../models/Lead');
// const Admin = require('../models/Admin');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//         file.mimetype === 'application/vnd.ms-excel') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only Excel files are allowed (.xlsx, .xls)'), false);
//     }
//   }
// });

// // All routes protected for admin only
// router.use(protect);
// router.use(authorize('admin', 'superadmin'));

// // @desc    Create new employee
// // @route   POST /api/admin/employees
// // @access  Private/Admin
// router.post('/employees', [
//   body('name')
//     .notEmpty().withMessage('Name is required')
//     .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
//     .trim(),
//   body('email')
//     .isEmail().withMessage('Please provide a valid email')
//     .normalizeEmail(),
//   body('phone')
//     .matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit Indian phone number')
//     .trim(),
//   body('designation')
//     .isIn(['telecaller', 'counsellor', 'developer', 'hr', 'manager', 'coordinator'])
//     .withMessage('Invalid designation'),
//   body('department')
//     .isIn(['admissions', 'counselling', 'abroad_studies', 'technical', 'hr', 'operations'])
//     .withMessage('Invalid department'),
//   body('password')
//     .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { name, email, phone, designation, department, password, profile } = req.body;

//     // Check if employee already exists
//     const existingEmployee = await Employee.findOne({
//       $or: [{ email }, { phone }]
//     });

//     if (existingEmployee) {
//       return res.status(400).json({
//         success: false,
//         message: 'Employee with this email or phone already exists'
//       });
//     }

//     // Create employee
//     const employeeData = {
//       name,
//       email,
//       phone,
//       designation,
//       department,
//       password
//     };

//     if (profile) {
//       employeeData.profile = profile;
//     }

//     const employee = await Employee.create(employeeData);

//     // Log the action (you might want to save this to an audit log)
//     console.log(`Employee created by admin ${req.user.id}: ${employee.employeeId}`);

//     res.status(201).json({
//       success: true,
//       message: 'Employee created successfully',
//       data: {
//         employeeId: employee.employeeId,
//         name: employee.name,
//         email: employee.email,
//         phone: employee.phone,
//         designation: employee.designation,
//         department: employee.department,
//         isActive: employee.isActive,
//         password: password // Return plain password only for admin reference
//       }
//     });

//   } catch (error) {
//     console.error('Create employee error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while creating employee'
//     });
//   }
// });

// // @desc    Get all employees with filters and pagination
// // @route   GET /api/admin/employees
// // @access  Private/Admin
// router.get('/employees', async (req, res) => {
//   try {
//     const {
//       designation,
//       department,
//       isActive,
//       search,
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build query
//     const query = {};
    
//     if (designation) query.designation = designation;
//     if (department) query.department = department;
//     if (isActive !== undefined) query.isActive = isActive === 'true';

//     // Search functionality
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { employeeId: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Sort configuration
//     const sortConfig = {};
//     sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const employees = await Employee.find(query)
//       .select('-password -loginAttempts -lockUntil')
//       .sort(sortConfig)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .lean();

//     const total = await Employee.countDocuments(query);

//     // Get employee statistics
//     const stats = await Employee.aggregate([
//       { $match: query },
//       {
//         $group: {
//           _id: '$designation',
//           count: { $sum: 1 },
//           active: {
//             $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     res.json({
//       success: true,
//       data: employees,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//         limit: parseInt(limit)
//       },
//       stats
//     });

//   } catch (error) {
//     console.error('Get employees error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching employees'
//     });
//   }
// });

// // @desc    Get employee by ID
// // @route   GET /api/admin/employees/:id
// // @access  Private/Admin
// router.get('/employees/:id', async (req, res) => {
//   try {
//     const employee = await Employee.findById(req.params.id)
//       .select('-password -loginAttempts -lockUntil');

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     // Get employee's assigned leads count
//     const leadsCount = await Lead.countDocuments({ assignedTo: employee._id });
//     const convertedLeads = await Lead.countDocuments({ 
//       assignedTo: employee._id, 
//       status: 'converted' 
//     });

//     const employeeWithStats = {
//       ...employee.toObject(),
//       leadsCount,
//       convertedLeads,
//       conversionRate: leadsCount > 0 ? (convertedLeads / leadsCount * 100).toFixed(2) : 0
//     };

//     res.json({
//       success: true,
//       data: employeeWithStats
//     });

//   } catch (error) {
//     console.error('Get employee error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching employee'
//     });
//   }
// });

// // @desc    Update employee
// // @route   PUT /api/admin/employees/:id
// // @access  Private/Admin
// router.put('/employees/:id', [
//   body('name').optional().isLength({ min: 2, max: 50 }).trim(),
//   body('email').optional().isEmail().normalizeEmail(),
//   body('phone').optional().matches(/^[6-9]\d{9}$/),
//   body('designation').optional().isIn(['telecaller', 'counsellor', 'developer', 'hr', 'manager', 'coordinator']),
//   body('department').optional().isIn(['admissions', 'counselling', 'abroad_studies', 'technical', 'hr', 'operations'])
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const employee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     ).select('-password -loginAttempts -lockUntil');

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Employee updated successfully',
//       data: employee
//     });

//   } catch (error) {
//     console.error('Update employee error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating employee'
//     });
//   }
// });

// // @desc    Delete employee (soft delete)
// // @route   DELETE /api/admin/employees/:id
// // @access  Private/Admin
// router.delete('/employees/:id', async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndUpdate(
//       req.params.id,
//       { isActive: false },
//       { new: true }
//     );

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found'
//       });
//     }

//     // Reassign their leads to unassigned
//     await Lead.updateMany(
//       { assignedTo: employee._id, status: { $in: ['new', 'contacted', 'interested'] } },
//       { 
//         $unset: { assignedTo: 1, assignedBy: 1, assignedAt: 1 },
//         $set: { status: 'new' }
//       }
//     );

//     res.json({
//       success: true,
//       message: 'Employee deactivated successfully. Their leads have been unassigned.'
//     });

//   } catch (error) {
//     console.error('Delete employee error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while deactivating employee'
//     });
//   }
// });

// // @desc    Upload leads via Excel
// // @route   POST /api/admin/leads/upload
// // @access  Private/Admin
// router.post('/leads/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please upload an Excel file'
//       });
//     }

//     const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     if (data.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Excel file is empty or has no data'
//       });
//     }

//     const leads = [];
//     const errors = [];
//     const duplicates = [];
//     let successCount = 0;

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       try {
//         // Normalize data from different column name formats
//         const leadData = {
//           name: row['Student Name'] || row['studentName'] || row['Name'] || row['name'],
//           phone: String(row['Phone'] || row['phone'] || row['Phone Number'] || row['phoneNumber']).trim(),
//           email: (row['Email'] || row['email'] || '').toLowerCase().trim(),
//           alternatePhone: String(row['Alternate Phone'] || row['alternatePhone'] || row['Alt Phone'] || '').trim(),
//           gender: (row['Gender'] || row['gender'] || 'Other').charAt(0).toUpperCase() + 
//                   (row['Gender'] || row['gender'] || 'Other').slice(1).toLowerCase(),
//           dateOfBirth: row['DOB'] || row['dob'] || row['Date of Birth'] ? new Date(row['DOB'] || row['dob'] || row['Date of Birth']) : null,
//           currentEducation: {
//             qualification: row['Qualification'] || row['qualification'] || '12th',
//             stream: row['Stream'] || row['stream'] || 'Other',
//             board: row['Board'] || row['board'] || 'Unknown',
//             passingYear: parseInt(row['Passing Year'] || row['passingYear'] || new Date().getFullYear()),
//             percentage: String(row['Percentage'] || row['percentage'] || ''),
//             schoolCollege: row['School'] || row['school'] || row['College'] || row['college'] || ''
//           },
//           interestedIn: (row['Interested In'] || row['interestedIn'] || 'domestic').toLowerCase(),
//           preferredCourses: (row['Preferred Courses'] || row['preferredCourses'] || '').split(',').map(c => c.trim()).filter(c => c),
//           preferredCountries: (row['Preferred Countries'] || row['preferredCountries'] || '').split(',').map(c => c.trim()).filter(c => c),
//           budget: row['Budget'] || row['budget'],
//           source: 'manual_upload',
//           location: {
//             city: row['City'] || row['city'] || '',
//             state: row['State'] || row['state'] || '',
//             pincode: String(row['Pincode'] || row['pincode'] || '')
//           },
//           createdBy: req.user.id
//         };

//         // Validate required fields
//         if (!leadData.name || !leadData.phone) {
//           errors.push(`Row ${i + 2}: Name and Phone are required`);
//           continue;
//         }

//         // Validate phone format
//         if (!/^[6-9]\d{9}$/.test(leadData.phone)) {
//           errors.push(`Row ${i + 2}: Invalid phone number format`);
//           continue;
//         }

//         // Check for duplicate phone
//         const existingLead = await Lead.findOne({ phone: leadData.phone });
//         if (existingLead) {
//           duplicates.push(`Row ${i + 2}: Lead with phone ${leadData.phone} already exists`);
//           continue;
//         }

//         const lead = new Lead(leadData);
//         await lead.validate(); // This will throw if validation fails
//         leads.push(lead);
//         successCount++;

//       } catch (error) {
//         errors.push(`Row ${i + 2}: ${error.message}`);
//       }
//     }

//     if (leads.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No valid leads found in the file',
//         data: {
//           uploaded: 0,
//           errors,
//           duplicates
//         }
//       });
//     }

//     // Save all valid leads in batches to avoid overwhelming the database
//     const batchSize = 100;
//     const savedLeads = [];
    
//     for (let i = 0; i < leads.length; i += batchSize) {
//       const batch = leads.slice(i, i + batchSize);
//       const batchResult = await Lead.insertMany(batch, { ordered: false });
//       savedLeads.push(...batchResult);
//     }

//     res.json({
//       success: true,
//       message: `Leads upload completed. ${successCount} leads processed successfully.`,
//       data: {
//         uploaded: savedLeads.length,
//         errors: errors.length > 0 ? errors : undefined,
//         duplicates: duplicates.length > 0 ? duplicates : undefined
//       }
//     });

//   } catch (error) {
//     console.error('Upload leads error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while uploading leads',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// // @desc    Assign leads to telecaller
// // @route   POST /api/admin/leads/assign
// // @access  Private/Admin
// router.post('/leads/assign', [
//   body('leadIds').isArray({ min: 1 }).withMessage('At least one lead ID is required'),
//   body('employeeId').isMongoId().withMessage('Valid employee ID is required')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { leadIds, employeeId } = req.body;

//     // Check if employee exists and is an active telecaller
//     const employee = await Employee.findOne({
//       _id: employeeId,
//       designation: 'telecaller',
//       isActive: true
//     });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Active telecaller not found'
//       });
//     }

//     // Update leads
//     const result = await Lead.updateMany(
//       {
//         _id: { $in: leadIds },
//         $or: [
//           { assignedTo: { $exists: false } },
//           { assignedTo: null }
//         ]
//       },
//       {
//         $set: {
//           assignedTo: employeeId,
//           assignedBy: req.user.id,
//           assignedAt: new Date(),
//           status: 'new'
//         }
//       }
//     );

//     // Update employee's performance metrics
//     await Employee.findByIdAndUpdate(
//       employeeId,
//       { $inc: { 'performance.totalLeads': result.modifiedCount } }
//     );

//     res.json({
//       success: true,
//       message: `Successfully assigned ${result.modifiedCount} leads to ${employee.name}`,
//       data: {
//         assignedCount: result.modifiedCount,
//         employee: {
//           name: employee.name,
//           employeeId: employee.employeeId,
//           designation: employee.designation
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Assign leads error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while assigning leads'
//     });
//   }
// });

// // @desc    Bulk assign leads to multiple telecallers
// // @route   POST /api/admin/leads/bulk-assign
// // @access  Private/Admin
// router.post('/leads/bulk-assign', [
//   body('leadsPerTelecaller').isInt({ min: 1, max: 1000 }).withMessage('Leads per telecaller must be between 1 and 1000')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { leadsPerTelecaller } = req.body;

//     // Get all active telecallers
//     const telecallers = await Employee.find({
//       designation: 'telecaller',
//       isActive: true
//     });

//     if (telecallers.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No active telecallers found'
//       });
//     }

//     // Get unassigned leads
//     const unassignedLeads = await Lead.find({
//       $or: [
//         { assignedTo: { $exists: false } },
//         { assignedTo: null }
//       ],
//       status: 'new'
//     }).limit(leadsPerTelecaller * telecallers.length);

//     if (unassignedLeads.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No unassigned leads available'
//       });
//     }

//     const assignmentResults = [];
//     let leadIndex = 0;
//     let totalAssigned = 0;

//     // Distribute leads among telecallers
//     for (const telecaller of telecallers) {
//       const telecallerLeads = unassignedLeads.slice(leadIndex, leadIndex + leadsPerTelecaller);
      
//       if (telecallerLeads.length > 0) {
//         const leadIds = telecallerLeads.map(lead => lead._id);
        
//         // Assign leads to telecaller
//         await Lead.updateMany(
//           { _id: { $in: leadIds } },
//           {
//             $set: {
//               assignedTo: telecaller._id,
//               assignedBy: req.user.id,
//               assignedAt: new Date(),
//               status: 'new'
//             }
//           }
//         );

//         // Update telecaller's performance
//         await Employee.findByIdAndUpdate(
//           telecaller._id,
//           { $inc: { 'performance.totalLeads': telecallerLeads.length } }
//         );

//         assignmentResults.push({
//           telecaller: telecaller.name,
//           employeeId: telecaller.employeeId,
//           leadsAssigned: telecallerLeads.length
//         });

//         leadIndex += telecallerLeads.length;
//         totalAssigned += telecallerLeads.length;
//       }
//     }

//     res.json({
//       success: true,
//       message: `Successfully assigned ${totalAssigned} leads to ${telecallers.length} telecallers`,
//       data: assignmentResults
//     });

//   } catch (error) {
//     console.error('Bulk assign error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while bulk assigning leads'
//     });
//   }
// });

// // @desc    Get admin dashboard statistics
// // @route   GET /api/admin/dashboard
// // @access  Private/Admin
// router.get('/dashboard', async (req, res) => {
//   try {
//     // Total counts
//     const totalEmployees = await Employee.countDocuments({ isActive: true });
//     const totalLeads = await Lead.countDocuments();
//     const assignedLeads = await Lead.countDocuments({ assignedTo: { $exists: true, $ne: null } });
//     const unassignedLeads = totalLeads - assignedLeads;

//     // Employee counts by designation
//     const employeeCounts = await Employee.aggregate([
//       { $match: { isActive: true } },
//       { $group: { _id: '$designation', count: { $sum: 1 } } }
//     ]);

//     // Lead counts by status
//     const leadStatusCounts = await Lead.aggregate([
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     // Lead counts by source
//     const leadSourceCounts = await Lead.aggregate([
//       { $group: { _id: '$source', count: { $sum: 1 } } }
//     ]);

//     // Monthly leads count for chart
//     const monthlyLeads = await Lead.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: '$createdAt' },
//             month: { $month: '$createdAt' }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { '_id.year': 1, '_id.month': 1 } },
//       { $limit: 12 }
//     ]);

//     // Telecaller performance
//     const telecallerPerformance = await Employee.aggregate([
//       { $match: { designation: 'telecaller', isActive: true } },
//       {
//         $lookup: {
//           from: 'leads',
//           localField: '_id',
//           foreignField: 'assignedTo',
//           as: 'assignedLeads'
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           employeeId: 1,
//           totalLeads: { $size: '$assignedLeads' },
//           convertedLeads: {
//             $size: {
//               $filter: {
//                 input: '$assignedLeads',
//                 as: 'lead',
//                 cond: { $eq: ['$$lead.status', 'converted'] }
//               }
//             }
//           },
//           contactedLeads: {
//             $size: {
//               $filter: {
//                 input: '$assignedLeads',
//                 as: 'lead',
//                 cond: { $eq: ['$$lead.status', 'contacted'] }
//               }
//             }
//           },
//           conversionRate: {
//             $cond: {
//               if: { $gt: [{ $size: '$assignedLeads' }, 0] },
//               then: {
//                 $multiply: [
//                   {
//                     $divide: [
//                       {
//                         $size: {
//                           $filter: {
//                             input: '$assignedLeads',
//                             as: 'lead',
//                             cond: { $eq: ['$$lead.status', 'converted'] }
//                           }
//                         }
//                       },
//                       { $size: '$assignedLeads' }
//                     ]
//                   },
//                   100
//                 ]
//               },
//               else: 0
//             }
//           }
//         }
//       },
//       { $sort: { conversionRate: -1 } }
//     ]);

//     // Recent activities
//     const recentLeads = await Lead.find()
//       .populate('assignedTo', 'name employeeId')
//       .populate('createdBy', 'name')
//       .sort({ createdAt: -1 })
//       .limit(10)
//       .select('name phone status assignedTo createdAt');

//     // Follow-up required leads
//     const followUpLeads = await Lead.find({
//       'callHistory.nextFollowUp': {
//         $gte: new Date(),
//         $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
//       },
//       status: { $in: ['new', 'contacted', 'interested'] }
//     })
//     .populate('assignedTo', 'name employeeId')
//     .sort({ 'callHistory.nextFollowUp': 1 })
//     .limit(10)
//     .select('name assignedTo status callHistory');

//     res.json({
//       success: true,
//       data: {
//         overview: {
//           totalEmployees,
//           totalLeads,
//           assignedLeads,
//           unassignedLeads,
//           conversionRate: totalLeads > 0 ? 
//             (leadStatusCounts.find(s => s._id === 'converted')?.count || 0) / totalLeads * 100 : 0
//         },
//         employeeCounts,
//         leadStatusCounts,
//         leadSourceCounts,
//         monthlyLeads,
//         telecallerPerformance,
//         recentLeads,
//         followUpLeads
//       }
//     });

//   } catch (error) {
//     console.error('Dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching dashboard data'
//     });
//   }
// });

// // @desc    Get all leads with advanced filtering
// // @route   GET /api/admin/leads
// // @access  Private/Admin
// router.get('/leads', async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       search,
//       status,
//       source,
//       assignedTo,
//       stream,
//       priority,
//       startDate,
//       endDate,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build query
//     const query = {};

//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { 'currentEducation.schoolCollege': { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (status) query.status = status;
//     if (source) query.source = source;
//     if (assignedTo) query.assignedTo = assignedTo;
//     if (stream) query['currentEducation.stream'] = stream;
//     if (priority) query.priority = priority;

//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }

//     // Sort configuration
//     const sortConfig = {};
//     sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     // Execute query with pagination
//     const leads = await Lead.find(query)
//       .populate('assignedTo', 'name employeeId designation')
//       .populate('createdBy', 'name')
//       .sort(sortConfig)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .lean();

//     const total = await Lead.countDocuments(query);

//     res.json({
//       success: true,
//       data: leads,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get leads error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching leads'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Lead = require('../models/Lead');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected for admin only
router.use(protect);
router.use(authorize('admin'));

// @desc    Create employee
// @route   POST /api/admin/employees
// @access  Private/Admin
router.post('/employees', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'telecaller']).withMessage('Role must be admin or telecaller')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, password, role, phone, department } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      department
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating employee'
    });
  }
});

// @desc    Get all employees
// @route   GET /api/admin/employees
// @access  Private/Admin
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees'
    });
  }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'telecaller' });
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const convertedLeads = await Lead.countDocuments({ status: 'converted' });

    // Lead status distribution
    const leadStatusCounts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent leads
    const recentLeads = await Lead.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalEmployees,
          totalLeads,
          newLeads,
          convertedLeads,
          conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0
        },
        leadStatusCounts,
        recentLeads
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @desc    Get all leads
// @route   GET /api/admin/leads
// @access  Private/Admin
router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads'
    });
  }
});

// @desc    Assign leads to telecaller
// @route   POST /api/admin/leads/assign
// @access  Private/Admin
router.post('/leads/assign', [
  body('leadIds').isArray().withMessage('Lead IDs must be an array'),
  body('employeeId').isMongoId().withMessage('Valid employee ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { leadIds, employeeId } = req.body;

    // Check if employee exists and is telecaller
    const employee = await User.findOne({ _id: employeeId, role: 'telecaller' });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Telecaller not found'
      });
    }

    // Update leads
    const result = await Lead.updateMany(
      { _id: { $in: leadIds } },
      { 
        assignedTo: employeeId,
        status: 'new'
      }
    );

    res.json({
      success: true,
      message: `Successfully assigned ${result.modifiedCount} leads to ${employee.name}`,
      data: {
        assignedCount: result.modifiedCount,
        employee: {
          name: employee.name,
          email: employee.email
        }
      }
    });

  } catch (error) {
    console.error('Assign leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning leads'
    });
  }
});

module.exports = router;