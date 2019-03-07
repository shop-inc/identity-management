/** Helper functions that are reused throughout the microservice */
import User from '../database/models/user';
import env from '../config';
import jwt from 'jsonwebtoken';

export const generateJWT = (user: User) => {
  const { SECRET_KEY } = env;
  return jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: 60 * 60 * 24 });
};
