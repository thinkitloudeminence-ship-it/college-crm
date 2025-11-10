const getWelcomeEmailTemplate = (employeeName, email, password, loginUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .credentials { background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; background: #f1f1f1; border-radius: 0 0 10px 10px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to CRM System!</h1>
                <p>Your Employee Management Portal</p>
            </div>
            <div class="content">
                <p>Hello <strong>${employeeName}</strong>,</p>
                
                <p>Your account has been successfully created in our CRM System. Here are your login details:</p>
                
                <div class="credentials">
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please change your password after first login for security reasons.</p>
                </div>
                
                <p>You can use the CRM system to:</p>
                <ul>
                    <li>Manage your daily tasks and projects</li>
                    <li>Track your attendance and working hours</li>
                    <li>Communicate with your team members</li>
                    <li>Update your work progress</li>
                    <li>Request leaves and breaks</li>
                </ul>
                
                <a href="${loginUrl}" class="button">Login to CRM</a>
                
                <p>If you have any questions or need assistance, please contact your manager or the system administrator.</p>
                
                <p>Best regards,<br>
                <strong>CRM Administration Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const getTaskAssignmentTemplate = (employeeName, taskTitle, assignedBy, dueDate, taskDescription) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; background: #f9f9f9; }
            .task-info { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #1976d2; margin: 15px 0; }
            .footer { text-align: center; padding: 15px; background: #f1f1f1; border-radius: 0 0 10px 10px; color: #666; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Task Assigned</h2>
            </div>
            <div class="content">
                <p>Hello <strong>${employeeName}</strong>,</p>
                
                <p>You have been assigned a new task:</p>
                
                <div class="task-info">
                    <h3 style="margin-top: 0; color: #1976d2;">${taskTitle}</h3>
                    <p><strong>Description:</strong> ${taskDescription}</p>
                    <p><strong>Assigned by:</strong> ${assignedBy}</p>
                    <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
                </div>
                
                <p>Please log in to the CRM system to view task details and update your progress.</p>
                
                <p>Best regards,<br>CRM System</p>
            </div>
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getTaskAssignmentTemplate
};