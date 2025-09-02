// src/mail/client.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  // IMPORTANTE: false na 587
  auth: {
    user: process.env.SMTP_USER,
    // seu gmail
    pass: process.env.SMTP_PASS
    // senha de app (16 caracteres)
  },
  // Evita resolver IPv6 que pode falhar em algumas redes
  family: 4
});

export {
  transporter
};
