const User = require('../models/User');
const Attendance = require('../models/Attendance');

const autoLogoutUsers = async () => {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Run only between 7 PM and 8 PM
    if (currentHour >= 19 && currentHour < 20) {
      console.log('Running automatic logout...');
      
      // Find all active users
      const activeUsers = await User.find({ isActive: true });
      
      for (const user of activeUsers) {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Update attendance record
          let attendance = await Attendance.findOne({
            user: user._id,
            date: today
          });

          if (attendance && !attendance.logoutTime) {
            attendance.logoutTime = new Date();
            
            // Calculate working hours
            if (attendance.loginTime) {
              const workingMs = attendance.logoutTime - attendance.loginTime;
              const breakMs = attendance.totalBreakTime * 60 * 1000;
              const actualWorkingMs = workingMs - breakMs;
              attendance.workingHours = Math.round(actualWorkingMs / (1000 * 60));
            }
            
            await attendance.save();
          }

          // Update user status
          user.isActive = false;
          await user.save();

          console.log(`Auto-logged out: ${user.name} (${user.email})`);
        } catch (userError) {
          console.error(`Error logging out user ${user.email}:`, userError);
        }
      }
      
      console.log('Automatic logout completed');
    }
  } catch (error) {
    console.error('Auto logout system error:', error);
  }
};

// Run every hour
setInterval(autoLogoutUsers, 60 * 60 * 1000);

module.exports = autoLogoutUsers;