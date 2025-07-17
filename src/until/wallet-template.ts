export const accountInfoTemplate = (data:{customerName: string, accountName: string, accountNumber: string}) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            margin: auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .heading {
            color: #333333;
          }
          .info {
            font-size: 16px;
            margin: 20px 0;
          }
          .label {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="heading">Hello, ${data.customerName}</h2>
          <p>Here are your account details:</p>
          <div class="info">
            <p><span class="label">Account Name:</span> ${data.accountName}</p>
            <p><span class="label">Account Number:</span> ${data.accountNumber}</p>
          </div>
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          <p>Best regards,<br />The Support Team</p>
        </div>
      </body>
    </html>
  `;
};
