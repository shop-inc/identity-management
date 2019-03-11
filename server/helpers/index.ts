/** Helper functions that are reused throughout the microservice */
import jwt from 'jsonwebtoken';
import env from '../config';
import User from '../database/models/user';

export const generateJWT = (user: User) => {
  const { SECRET_KEY } = env;
  return jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: 60 * 60 * 24 });
};
