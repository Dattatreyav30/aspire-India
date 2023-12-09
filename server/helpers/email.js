const nodemailer = require("nodemailer");

const emailSender = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dattar6256w57612@gmail.com",
      pass: "wgndybeychezimqz",
    },
  });

  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Aspire India 👻" <dattatreya361@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
  }

  main().catch(console.error);
};
module.exports = emailSender;
