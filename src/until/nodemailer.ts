import nodemailer from "nodemailer";
let configOptions = {
  host: "1.2.3.4",
  port: 465,
  secure: true,
  tls: {
    // must provide server name, otherwise TLS certificate check will fail
    servername: "example.com",
  },
};

export const sendMail = async (
  data: { email: string; subject: string; emailInfo:any },
  cb: Function
) => {
  try {
    const sender = "callistus455@gmail.com";
    const transporter = nodemailer.createTransport({
      host: sender,
      //   port: 587,
      service: "gmail",
      secure: true,
      auth: {
        user: sender,
        pass: "nkyn vzqa hxln iych",
      },
    });

    const message = {
      from: sender,
      to: data.email,
      subject: data.subject,
      html: cb(data),
    };

    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};
