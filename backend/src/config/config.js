require("dotenv").config();

const DbConfig = {
  mongoDBUrl: process.env.MONGODB_URL,
  mongoDBName: process.env.MONGODB_NAME || "chat-room",
}

const jwtConfig = {
  secret: process.env.JWT_SECRET,
}

const SMTPConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.STMP_HOST || "smtp.gmail.com",
  user: process.env.SMTP_USER,
  password:process.env.SMTP_PASSWORD,
  port: process.env.SMTP_PORT,
  from: process.env.SMTP_FROM,
  resendApiKey:process.env.RESEND_API_KEY
};

const CloudinaryConfig = {
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinaryKey: process.env.CLOUDINARY_KEY,
  cloudinarySecretKey: process.env.CLOUDINARY_SECRET_KEY,
}

module.exports = { DbConfig , jwtConfig, CloudinaryConfig, SMTPConfig };