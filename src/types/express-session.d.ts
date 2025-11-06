import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      name?: string;
      email?: string;
      picture?: string;
      // Store token payload if you need to call Google APIs later
      tokens?: unknown;
    };
  }
}


