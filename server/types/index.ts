/** This file contains all our custom defined types */

// Signature for the client's callback function
type clientCallback = (err: any, response ?: object) => void;

// tslint:disable-next-line: class-name
interface administratorIdentity {
  name: string;
  email: string;
  picture: string;
}
