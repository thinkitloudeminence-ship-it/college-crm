// const Lead = require('../models/Lead');
// const User = require('../models/User');

// // CollegeForm.in webhook handler
// const collegeFormWebhook = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phone, 
//       college, 
//       course, 
//       city, 
//       source = 'collegeform.in',
//       additional_info 
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Missing required fields: name, email, phone' 
//       });
//     }

//     // Find active telecallers for assignment
//     const telecallers = await User.find({ 
//       role: 'telecaller', 
//       status: 'active',
//       isActive: true 
//     });

//     let assignedTo = null;
    
//     if (telecallers.length > 0) {
//       // Simple round-robin assignment - you can implement more sophisticated logic
//       const randomIndex = Math.floor(Math.random() * telecallers.length);
//       assignedTo = telecallers[randomIndex]._id;
//     }

//     // Create lead
//     const lead = new Lead({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone.toString().trim(),
//       college: college?.trim() || '',
//       course: course?.trim() || '',
//       city: city?.trim() || '',
//       source,
//       status: assignedTo ? 'assigned' : 'new',
//       assignedTo: assignedTo,
//       assignedBy: assignedTo, // or set to system admin
//       remarks: `Auto-created from ${source}` + (additional_info ? ` - ${additional_info}` : ''),
//       timeline: [{
//         action: 'created',
//         remarks: `Lead created from ${source} webhook`,
//         updatedBy: assignedTo || null
//       }]
//     });

//     await lead.save();

//     console.log(`Lead created from CollegeForm.in: ${name} (${email})`);

//     res.status(201).json({
//       success: true,
//       message: 'Lead created successfully',
//       leadId: lead._id,
//       assigned: !!assignedTo
//     });

//   } catch (error) {
//     console.error('CollegeForm webhook error:', error);
    
//     // Handle duplicate leads gracefully
//     if (error.code === 11000) {
//       return res.status(200).json({
//         success: true,
//         message: 'Lead already exists in system',
//         duplicate: true
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// // Social media form webhook (similar structure)
// const socialMediaWebhook = async (req, res) => {
//   try {
//     const { platform, form_data } = req.body;
    
//     // Process social media lead data
//     const lead = new Lead({
//       name: form_data.name,
//       email: form_data.email,
//       phone: form_data.phone,
//       source: `social_media_${platform}`,
//       status: 'new',
//       remarks: `From ${platform} social media campaign`
//     });

//     await lead.save();

//     res.status(201).json({
//       success: true,
//       message: 'Social media lead created successfully'
//     });
//   } catch (error) {
//     console.error('Social media webhook error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };

// module.exports = {
//   collegeFormWebhook,
//   socialMediaWebhook
// };

const Lead = require('../models/Lead');
const User = require('../models/User');

// CollegeForm.in webhook handler
const collegeFormWebhook = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      college, 
      course, 
      city, 
      source = 'collegeform.in',
      additional_info 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: name, email, phone' 
      });
    }

    // Find active telecallers for assignment
    const telecallers = await User.find({ 
      role: 'telecaller', 
      status: 'active'
    });

    let assignedTo = null;
    
    if (telecallers.length > 0) {
      // Round-robin assignment - find telecaller with least assigned leads
      const telecallerStats = await Promise.all(
        telecallers.map(async (telecaller) => {
          const assignedCount = await Lead.countDocuments({ 
            assignedTo: telecaller._id,
            status: { $in: ['new', 'assigned', 'contacted'] }
          });
          return { telecaller, assignedCount };
        })
      );

      // Sort by assigned count and pick the one with least assignments
      telecallerStats.sort((a, b) => a.assignedCount - b.assignedCount);
      assignedTo = telecallerStats[0].telecaller._id;
    }

    // Create lead
    const lead = new Lead({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.toString().trim(),
      college: college?.trim() || '',
      course: course?.trim() || '',
      city: city?.trim() || '',
      source,
      status: assignedTo ? 'assigned' : 'new',
      assignedTo: assignedTo,
      assignedBy: assignedTo, // or set to system admin
      remarks: `Auto-created from ${source}` + (additional_info ? ` - ${additional_info}` : ''),
      timeline: [{
        action: 'created',
        remarks: `Lead created from ${source} webhook`,
        updatedBy: assignedTo || null
      }]
    });

    await lead.save();

    console.log(`Lead created from CollegeForm.in: ${name} (${email}) - Assigned: ${!!assignedTo}`);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      leadId: lead._id,
      assigned: !!assignedTo,
      assignedTo: assignedTo ? telecallers.find(t => t._id.equals(assignedTo))?.name : null
    });

  } catch (error) {
    console.error('CollegeForm webhook error:', error);
    
    // Handle duplicate leads gracefully
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: 'Lead already exists in system',
        duplicate: true
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Manual lead upload for admin
const manualLeadUpload = async (req, res) => {
  try {
    const leadsData = req.body.leads; // Array of leads
    const assignedTo = req.body.assignedTo; // Specific telecaller ID

    if (!leadsData || !Array.isArray(leadsData)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid leads data'
      });
    }

    const results = {
      created: 0,
      duplicates: 0,
      errors: []
    };

    for (const leadData of leadsData) {
      try {
        const { name, email, phone, college, course, city } = leadData;

        // Check if lead already exists
        const existingLead = await Lead.findOne({ 
          $or: [{ email }, { phone }] 
        });

        if (existingLead) {
          results.duplicates++;
          continue;
        }

        const lead = new Lead({
          name: name?.trim(),
          email: email?.toLowerCase().trim(),
          phone: phone?.toString().trim(),
          college: college?.trim(),
          course: course?.trim(),
          city: city?.trim(),
          source: 'manual',
          status: assignedTo ? 'assigned' : 'new',
          assignedTo: assignedTo,
          assignedBy: req.user._id,
          timeline: [{
            action: 'created',
            remarks: 'Manually uploaded',
            updatedBy: req.user._id
          }]
        });

        await lead.save();
        results.created++;
      } catch (error) {
        results.errors.push(`Lead ${leadData.email}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Processed ${leadsData.length} leads`,
      results
    });

  } catch (error) {
    console.error('Manual lead upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  collegeFormWebhook,
  manualLeadUpload
};