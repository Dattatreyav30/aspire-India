const nodemailer = require("nodemailer");
require("dotenv").config();

const emailSender = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Aspire India 👻" <dattatreya361@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>${otp}</b`, // html body
    });
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};
module.exports = emailSender;
