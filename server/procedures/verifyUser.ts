import { ServerUnaryCall } from 'grpc';
import User from '../database/models/user';
import { UserNotFound } from '../exceptions';
import { decodeJWT } from '../helpers/jwt';

export const successResponse = 'Successfully verified.';
export const alreadyResponse = 'Already verified.';

const verifyUser = async (incomingMessage: ServerUnaryCall<object> , callback: clientCallback) => {
  try {
    // @ts-ignore
    const { request: { token } } = incomingMessage;
    const identity = decodeJWT(token, 'verification');
    const user = await User.findUserByEmail(identity.email);
    if (!(user instanceof User)) {
      callback(new UserNotFound());
      return;
    }

    // @ts-ignore
    const response: VerificationResponse = {};
    if (!user.verified) {
      await user.verify();
      response.status = successResponse;
    } else {
      response.status = alreadyResponse;
    }

    response.verificationDetails = {
      verificationStatus: user.verified,
      dateVerified: user.dateVerified,
    };
    callback(null, response);
  } catch (error) {
    callback(error);
  }
};

export default verifyUser;
