function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000).toString();
}


function getOTPhtml(otp){
    return `<!DOCTYPE html>

<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; background:#ffffff; margin-top:40px; border-radius:10px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
<!-- Header -->
<tr>
  <td align="center" style="background-color:#4CAF50; padding:20px;">
    <h1 style="color:#ffffff; margin:0;">Verify Your Email</h1>
  </td>
</tr>

<!-- Body -->
<tr>
  <td style="padding:30px; text-align:center;">
    <p style="font-size:16px; color:#333;">
      Hello 👋,<br><br>
      Use the OTP below to verify your email address.
    </p>

    <!-- OTP Box -->
    <div style="margin:20px auto; padding:15px 25px; display:inline-block; background:#f1f1f1; border-radius:8px;">
      <h2 style="letter-spacing:5px; color:#4CAF50; margin:0;">
        ${otp}
      </h2>
    </div>

    <p style="font-size:14px; color:#777;">
      This OTP is valid for <strong>10 minutes</strong>.
    </p>

    <p style="font-size:14px; color:#777;">
      If you did not request this, please ignore this email.
    </p>
  </td>
</tr>

<!-- Footer -->
<tr>
  <td align="center" style="background:#f9f9f9; padding:15px;">
    <p style="font-size:12px; color:#aaa; margin:0;">
      © 2026 Your Company. All rights reserved.
    </p>
  </td>
</tr>

  </table>

</body>
</html>


    `

}

export {generateOTP, getOTPhtml};