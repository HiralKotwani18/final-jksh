const nodemailer = require("nodemailer");
const environment = require("./environment");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    service: "gmail",
    auth: {
      user: environment.gmail.user,
      pass: environment.gmail.pass,
    },
  });

  const mailOptions = {
    from: environment.gmail.user,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
