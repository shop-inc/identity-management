/** This file contains all our custom defined types */

// Signature for the client's callback function
type clientCallback = (err: any, response ?: object) => void;

interface MailData {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

interface UserConstructor {
  name?: string;
  email?: string;
  picture?: string;
  lastUpdated?: string;
  roleName?: string;
  verified?: boolean;
  dateVerified?: string;
  mailSent?: boolean;
  mailSentDate?: string;
}

interface JWTPayload {
  email?: string,
  narrative?: string,
  jti?: string,
  iat?: number,
  exp?: number,
  aud?: string
}

interface VerificationResponse {
  status: string,
  verificationDetails: {
    verificationStatus: boolean,
    dateVerified: string,
  }
}
