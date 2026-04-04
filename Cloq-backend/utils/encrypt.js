import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// ENCRYPTION_KEY must be 32 bytes.
const ENCRYPTION_KEY = process.env.CRYPTO_SECRET 
  ? Buffer.from(process.env.CRYPTO_SECRET, 'hex') 
  : crypto.randomBytes(32); 

const ALGORITHM = "aes-256-cbc";

/**
 * Encrypts a text string.
 * @param {string} text 
 * @returns {{ encryptedData: string, iv: string }}
 */
export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
};

/**
 * Decrypts an encrypted text string.
 * @param {string} encryptedData 
 * @param {string} iv 
 * @returns {string}
 */
export const decrypt = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, Buffer.from(iv, "hex"));
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
