import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  /** 1. Create a transporter */
  /**
   * Using mailtrap (Sandbox) as a transporter
   */
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  /** 2. Define email options */

  const mailOptions = {
    from: 'Vaibhav Kadwey <vaibhavkadwey@newme.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:<></>
  };
  /** 3. Send  the email */

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
