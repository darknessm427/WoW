// File 1: build-jwt.js (Generate secure JWT tokens)

const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Secret key for signing the JWT
const SECRET = process.env.JWT_SECRET || "changeme_super_secure_secret_key";

// List of users and their file URLs
const users = {
  u01: {
    url: "https://raw.githubusercontent.com/michaelrezza/wow/main/sing-box-hiddify.json",
    ip: "1.2.3.4",
    exp_days: 3
  },
  u02: {
    url: "https://raw.githubusercontent.com/michaelrezza/wow/main/Xray-WoW.json",
    ip: "5.6.7.8",
    exp_days: 5
  }
};

const tokens = {};

for (const [key, user] of Object.entries(users)) {
  const payload = {
    url: user.url,
    ip: user.ip,
    exp: Math.floor(Date.now() / 1000) + user.exp_days * 24 * 60 * 60
  };
  const token = jwt.sign(payload, SECRET);
  tokens[key] = { token, expires_at: new Date(payload.exp * 1000).toISOString() };
}

fs.writeFileSync("tokens.json", JSON.stringify(tokens, null, 2));
console.log("Tokens have been generated and saved to tokens.json.");
