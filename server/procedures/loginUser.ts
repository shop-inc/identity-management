import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { ServerUnaryCall } from 'grpc';
import User from '../database/models/user';
import { UserNotFound } from '../exceptions';
import { generateJWT, verifyGoogleToken } from '../helpers';

const loginUser = async (incomingMessage: ServerUnaryCall<object> , callback: clientCallback) => {
  try {
    // @ts-ignore
    const { request: { token: idToken } } = incomingMessage;
    const identity: TokenPayload = await verifyGoogleToken(idToken);
    const user = await User.findUserByEmail(identity.email);
    if (!(user instanceof User)) {
      callback(new UserNotFound());
      return;
    }
    await user.checkVerifiedUser();
    const token = generateJWT(user);
    const {
      name, email, profile: { imageUrl, lastUpdated },
    } = user;
    const response = {
      name,
      email,
      profile: {
        imageUrl,
        lastUpdated,
      },
      token,
    };
    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

export default loginUser;
