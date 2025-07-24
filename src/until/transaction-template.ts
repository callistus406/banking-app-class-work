function generateTransactionEmail(data:{
  name : string,
  transaction_id: string,
  transaction_amount: number,
  transaction_date: string,
  payment_method: string,
  transaction_status: "Success" | "Failed",
  year:any
}) {

    const { name, transaction_id, transaction_amount, transaction_date, payment_method, transaction_status, year } = data;
  const isSuccess = transaction_status.toLowerCase() === 'success';

  const status_heading = isSuccess
    ? '✅ Transaction Successful'
    : '❌ Transaction Failed';

  const status_message = isSuccess
    ? 'We’re happy to let you know your transaction was completed successfully.'
    : 'Unfortunately, your transaction could not be processed. Please try again or contact support.';

  const status_color = isSuccess ? '#28a745' : '#dc3545';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${status_heading}</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f5f6fa; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f6fa;">
    <tr>
      <td align="center">
        <table class="container" width="600" cellpadding="20" cellspacing="0" style="background-color:#ffffff; margin:20px 0; border-radius:8px; box-shadow:0 0 5px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding-top:30px;">
              <h2 style="margin:0; font-size:24px;">${status_heading}</h2>
              <p style="color:#888; font-size:14px;">Transaction ID: ${transaction_id}</p>
            </td>
          </tr>

          <tr>
            <td>
              <p>Hi ${name},</p>
              <p>${status_message}</p>

              <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:20px; background-color:#f9f9f9; border-radius:6px;">
                <tr>
                  <td><strong>Amount:</strong></td>
                  <td>${transaction_amount}</td>
                </tr>
                <tr>
                  <td><strong>Date:</strong></td>
                  <td>${transaction_date}</td>
                </tr>
                <tr>
                  <td><strong>Payment Method:</strong></td>
                  <td>${payment_method}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td style="color: ${status_color};"><strong>${transaction_status}</strong></td>
                </tr>
              </table>

              ${
                isSuccess
                  ? `<p style="margin-top:30px;">You can keep this email as a receipt for your records.</p>`
                  : `<p style="margin-top:30px;">Please double-check your payment details and try again.</p>`
              }

              <p style="margin-top:20px;">If you have any questions, feel free to reply to this email.</p>
              <p>Thanks,<br>The schoolLife Banking Team</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size:12px; color:#999;">
              <p style="margin-top:40px;">© ${new Date().getFullYear()}. All rights reserved.</p>
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
export default generateTransactionEmail;
