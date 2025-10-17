import nodemailer from 'nodemailer';

const isMock = process.env.MAIL_MOCK === 'true';

let transporter;

if (isMock) {
  transporter = nodemailer.createTransport({ jsonTransport: true });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
  });
}

export async function sendMail({ forWho, subject, html }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || '"Soporte" <no-reply@tuapp.com>',
    to: forWho,
    subject: subject,
    html
  });
}