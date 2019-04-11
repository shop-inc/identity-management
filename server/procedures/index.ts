/** This file collects all defined procedures and exports them in an object */
import createUser from './createUser';
import loginUser from './loginUser';
import logoutUser from './logoutUser';
import verifyUser from './verifyUser';

const procedures = {
  createUser,
  loginUser,
  verifyUser,
  logout: logoutUser,
};

export default procedures;
