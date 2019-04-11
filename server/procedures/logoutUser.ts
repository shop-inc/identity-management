import { ServerUnaryCall } from 'grpc';
import Token from '../database/models/token';
import User from '../database/models/user';
import { UserNotFound } from '../exceptions';
import { decodeJWT } from '../helpers/jwt';

export const logoutSuccess = 'Successfully logged out!';
export const loggedOutAlready = 'Already logged out!';

const logoutUser = async (incomingMessage: ServerUnaryCall<object> , callback: clientCallback) => {
  try {
    // @ts-ignore
    const { request: { token } } = incomingMessage;
    const identity = decodeJWT(token);

    const { jti, exp: expiryTime } = identity;
    const blacklistedToken = await Token.findOne({ jti });

    if (blacklistedToken != null) {
      callback(null, { message: loggedOutAlready });
      return;
    }

    const user = await User.findUserByEmail(identity.email);
    if (!(user instanceof User)) {
      callback(new UserNotFound());
      return;
    }

    const exp = new Date(expiryTime * 1000);

    await Token.create({
      jti,
      exp,
    });

    callback(null, { message: logoutSuccess });
  } catch (error) {
    callback(error);
  }
};

export default logoutUser;
