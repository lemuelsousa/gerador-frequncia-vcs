import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;

// Create an OAuth2 client
export const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline", // 'offline' gets you a refresh token
  scope: scopes,
  include_granted_scopes: true,
});

export const config = {
  clientId,
  clientSecret,
  redirectUri,
};