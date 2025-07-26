function generateTransactionEmail(data: {
  name: string;
  transactionId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: string;
  year: any;
}) {
  const { name, transactionId, amount, date, paymentMethod, status, year } =
    data;
  const isSuccess = status === "success";

  const statusColor = isSuccess ? "#28a745" : "#dc3545";
  const statusMessage = isSuccess
    ? "Transaction Successful"
    : "Transaction Failed";
  const statusDescription = isSuccess
    ? `Your payment of ${amount} has been processed successfully.`
    : `We were unable to process your payment of ${amount}. Please try again or contact support.`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Transaction Notification</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="margin:20px 0;">
          <tr>
            <td align="center" style="padding: 30px; background-color: #007bff; color: #ffffff; font-size: 24px; font-weight: bold;">
              Transaction Notification
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px;">
              <p>Hello ${name},</p>

              <div style="padding: 20px; background-color: ${statusColor}; color: #fff; border-radius: 5px; margin: 20px 0;">
                <strong style="font-size: 18px;">${statusMessage}</strong><br/>
                ${statusDescription}
              </div>

              <table cellpadding="10" cellspacing="0" border="0" width="100%" style="background-color:#f9f9f9; border:1px solid #ddd;">
                <tr>
                  <td><strong>Transaction ID:</strong></td>
                  <td>${transactionId}</td>
                </tr>
                <tr>
                  <td><strong>Amount:</strong></td>
                  <td>${amount}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>${date}</td>
                </tr>
                <tr>
                  <td><strong>Method:</strong></td>
                  <td>${paymentMethod}</td>
                </tr>
              </table>

              <p>If you have any questions, feel free to contact our support team.</p>

              <p>Best regards,<br/>Your Company Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background-color: #f1f1f1; padding: 20px; font-size: 12px; color: #888888;">
              &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
