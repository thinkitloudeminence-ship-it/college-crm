const express = require('express');
const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected for admin only
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// @desc    Get comprehensive reports
// @route   GET /api/reports
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { period = '30days' } = req.query;

    // Calculate date range based on period
    let startDate = new Date();
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get lead statistics
    const leadStats = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $facet: {
          statusCounts: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceCounts: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          monthlyCounts: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ]
        }
      }
    ]);

    // Get employee performance
    const employeePerformance = await Employee.aggregate([
      { $match: { designation: 'telecaller', isActive: true } },
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'assignedLeads'
        }
      },
      {
        $project: {
          name: 1,
          employeeId: 1,
          totalLeads: { $size: '$assignedLeads' },
          convertedLeads: {
            $size: {
              $filter: {
                input: '$assignedLeads',
                as: 'lead',
                cond: { $eq: ['$$lead.status', 'converted'] }
              }
            }
          },
          conversionRate: {
            $cond: {
              if: { $gt: [{ $size: '$assignedLeads' }, 0] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      {
                        $size: {
                          $filter: {
                            input: '$assignedLeads',
                            as: 'lead',
                            cond: { $eq: ['$$lead.status', 'converted'] }
                          }
                        }
                      },
                      { $size: '$assignedLeads' }
                    ]
                  },
                  100
                ]
              },
              else: 0
            }
          }
        }
      },
      { $sort: { conversionRate: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        startDate,
        leadStats: leadStats[0],
        employeePerformance
      }
    });

  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating reports'
    });
  }
});

module.exports = router;