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
  mailSent?: boolean;
  mailSentDate?: string;
}
