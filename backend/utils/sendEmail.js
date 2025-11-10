// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: process.env.EMAIL_SERVICE,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: options.email,
//       subject: options.subject,
//       text: options.message,
//       html: options.html,
//     };

//     const result = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', result.messageId);
//     return result;
//   } catch (error) {
//     console.error('Email error:', error);
//     throw error;
//   }
// };

// // Send welcome email to new employees
// const sendWelcomeEmail = async (employeeEmail, employeeName, password, loginLink) => {
//   const subject = 'Welcome to CRM System';
//   const html = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #1976d2;">Welcome to CRM System!</h2>
//       <p>Hello ${employeeName},</p>
//       <p>Your account has been created successfully.</p>
//       <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
//         <p><strong>Email:</strong> ${employeeEmail}</p>
//         <p><strong>Password:</strong> ${password}</p>
//         <p><strong>Login URL:</strong> ${loginLink}</p>
//       </div>
//       <p>Please login and change your password immediately.</p>
//       <p>Best regards,<br>CRM Admin Team</p>
//     </div>
//   `;

//   return await sendEmail({
//     email: employeeEmail,
//     subject,
//     html
//   });
// };

// module.exports = { sendEmail, sendWelcomeEmail };


const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `CRM System <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Send welcome email to new employees
const sendWelcomeEmail = async (employeeEmail, employeeName, password, loginLink) => {
  const subject = 'Welcome to CRM System - Your Account Details';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to CRM System!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your Employee Management Portal</p>
      </div>
      
      <div style="padding: 30px;">
        <p>Hello <strong>${employeeName}</strong>,</p>
        
        <p>Your account has been successfully created in our CRM System. Here are your login details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${employeeEmail}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="${loginLink}" style="color: #667eea;">${loginLink}</a></p>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; margin: 20px 0;">
          <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please change your password after first login for security reasons.</p>
        </div>
        
        <p>You can use the CRM system to:</p>
        <ul style="color: #555;">
          <li>Manage your daily tasks and projects</li>
          <li>Track your attendance and working hours</li>
          <li>Communicate with your team members</li>
          <li>Update your work progress</li>
          <li>Request leaves and breaks</li>
        </ul>
        
        <p>If you have any questions or need assistance, please contact your manager or the system administrator.</p>
        
        <p>Best regards,<br>
        <strong>CRM Administration Team</strong></p>
      </div>
      
      <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 0 0 10px 10px; color: #6c757d; font-size: 14px;">
        <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `;

  return await sendEmail({
    email: employeeEmail,
    subject,
    html
  });
};

// Send task assignment email
const sendTaskAssignmentEmail = async (employeeEmail, employeeName, taskTitle, assignedBy, dueDate) => {
  const subject = `New Task Assigned: ${taskTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">New Task Assigned</h2>
      <p>Hello <strong>${employeeName}</strong>,</p>
      
      <p>You have been assigned a new task:</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1976d2;">${taskTitle}</h3>
        <p><strong>Assigned by:</strong> ${assignedBy}</p>
        <p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
      </div>
      
      <p>Please log in to the CRM system to view task details and update your progress.</p>
      
      <p>Best regards,<br>CRM System</p>
    </div>
  `;

  return await sendEmail({
    email: employeeEmail,
    subject,
    html
  });
};

module.exports = { sendEmail, sendWelcomeEmail, sendTaskAssignmentEmail };