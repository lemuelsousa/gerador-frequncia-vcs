import { Request, Response } from "express";
import { authorizationUrl, config, oauth2Client } from "../auth";
import { google } from "googleapis";
import { logger } from "../utils/logger";
import "express-session";

export const loginConsentHandler = (req: Request, res: Response): void => {
  logger.info("Login page accessed", {
    timestamp: Date.now(),
  });
  res.send(`<a href="${authorizationUrl}">Login with Google</a>`);
};

export const callbackUriHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Get the authorization code from the query parameters
  const code = req.query.code as string;
  if (!code) {
    res.status(404).send("Error while checking authorization code.");
    return;
  }

  try {
    // Exchange the code for an access token and a refresh token
    const { tokens } = await oauth2Client.getToken(code);
    // create user-specific OAuth2 client
    const userOauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
    // set the credentials for the user-specific OAuth2 client
    userOauth2Client.setCredentials(tokens);

    // get the user's profile information
    const oauth2 = google.oauth2({
      auth: userOauth2Client,
      version: "v2",
    });
    const { data: userProfile } = await oauth2.userinfo.get();

    // Require user's id and email
    if (!userProfile.id || !userProfile.email) {
      res.status(400).send("Missing Google profile id or email");
      return;
    }

    // store the user's profile information in the session
    const session = req.session;
    session.user = {
      id: userProfile.id,
      name: userProfile.name ?? undefined,
      email: userProfile.email,
      picture: userProfile.picture ?? undefined,
      tokens: tokens,
    };

    // ensure session is persisted before redirecting
    req.session.save((err) => {
      if (err) {
        logger.error("Session save error", { error: err });
        return res.status(500).send("Error during authentication");
      }
      // redirect to the profile information page
      res.redirect("/profile");
    });
  } catch (error) {
    console.error("Error acquiring tokens:", error);
    res.status(500).send("Error during authentication");
    return;
  }
};

export const profileInfoHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  // check session
  const session = req.session;

  if (!session?.user) {
    res.status(401).send("Not authenticated");
    return;
  }

  // return session data
  res.json({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    picture: session.user.picture,
  });
};

export const logoutHandler = (req: Request, res: Response): void => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/auth/login");
  });
};
