import jwt from 'jsonwebtoken';
import env from '../config';
import User from '../database/models/user';
import { JWTNarrativeMismatch } from '../exceptions';

const { SECRET_KEY } = env;

export const generateJWT = (user: User, expiresAfter?: number, narrative?: string) => {
  return jwt.sign(
    { email: user.email, narrative: narrative || 'login' },
    SECRET_KEY,
    { expiresIn: expiresAfter || 60 * 60 * 24 },
  );
};

export const decodeJWT = (token: string, narrative?: string) => {
  let payload: JWTPayload;
  try {
    const payloadTemp = jwt.verify(token, SECRET_KEY);

    if (typeof payloadTemp !== 'object') {
      // istanbul ignore next
      throw new TypeError('jwt.verify did not return an object');
    }
    payload = { ...payloadTemp };
  } catch (e) {
    // istanbul ignore next
    throw e;
  }

  const narrativeMatch = narrative || 'login';
  if (payload.narrative !== narrativeMatch) {
    throw new JWTNarrativeMismatch(narrativeMatch, payload.narrative);
  }
  return payload;
};
