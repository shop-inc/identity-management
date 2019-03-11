import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { ServerUnaryCall } from 'grpc';
import env from '../config';
import User from '../database/models/user';
import { InvalidIdToken } from '../exceptions';
import { generateJWT, VerificationEmail } from '../helpers';

const { GOOGLE_CLIENT_ID } = env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Verifies the id token
 * @param idToken
 */
const verify = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (e) {
    throw new InvalidIdToken();
  }
};

const createUser = async (incomingMessage: ServerUnaryCall<object> , callback: clientCallback) => {
  try {
    // @ts-ignore
    const { request: { token: idToken } } = incomingMessage;
    const identity: TokenPayload = await verify(idToken);
    let user = await User.findUserByEmail(identity.email);
    if (!user) {
      user = new User(identity);
    }
    await user.save();
    const token = generateJWT(user);
    const response = {
      name: user.name,
      email: user.email,
      profile: {
        imageUrl: user.profile.imageUrl,
        lastUpdated: user.profile.lastUpdated,
      },
      token,
    };
    // Callback with the response since mail sending is asynchronous
    callback(null, response);

    // Send the email if the user had not been sent an email
    if (!user.mailSent) {
      const verificationEmail = new VerificationEmail(user);
      verificationEmail.send();
    }
  } catch (error) {
    callback(error);
  }
};

export default createUser;
