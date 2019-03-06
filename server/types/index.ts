/** This file contains all our custom defined types */

// Signature for the client's callback function
type clientCallback = (err: any, response ?: object) => void;

type administratorIdentity = {
  name: string,
  email: string,
  picture: string,
}
