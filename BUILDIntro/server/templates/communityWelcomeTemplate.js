export const communityWelcomeTemplate = (userId, emailId) => {

  return `
  <div style="font-family: Arial, sans-serif; padding:20px">
      <h2>Welcome to DGX Community 🎉</h2>

      <p>Hello User,</p>

      <p>Thank you for joining the DGX Community.</p>

      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Email:</strong> ${emailId}</p>

      <p>We are excited to have you with us.</p>

      <hr/>

      <p style="font-size:12px;color:gray">
        DGX Community Team
      </p>
  </div>
  `;

};