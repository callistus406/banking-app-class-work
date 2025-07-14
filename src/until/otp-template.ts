export const otpTemplate = (name: string, otp: string) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: auto;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #2e6cf7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello, ${name}</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <p class="otp">${otp}</p>
          <p>Please use this OTP to complete your action. It will expire shortly for your security.</p>
        </div>
      </body>
    </html>
  `;
};
