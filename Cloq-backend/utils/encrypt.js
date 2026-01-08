import crypto from "crypto";

const algorithm = "aes-256-cbc";
const iv = Buffer.alloc(16, 0);

const encrypt = (text) => {
  const secret = process.env.CRYPTO_SECRET;

  if (!secret) {
    throw new Error("CRYPTO_SECRET is not defined in environment variables");
  }

  const secretKey = Buffer.from(secret, "hex");

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export default encrypt;
