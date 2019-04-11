import Token from '../../database/models/token';
import User from '../../database/models/user';
import { clearGraphDB, clearMongoDB } from '../../database/queries';
import seedGraphDB from '../../database/seeders';
import { decodeJWT, generateJWT } from '../../helpers/jwt';
import logoutUser, { loggedOutAlready, logoutSuccess } from '../logoutUser';
import { mockUser as mockUserData } from '../mockData';

describe('Logout rpc', () => {
  const clientCallback = jest.fn();
  const mockUser = new User(mockUserData);

  beforeAll(async (done) => {
    await clearMongoDB();
    await clearGraphDB();
    await seedGraphDB();
    done();
  });

  afterAll(async (done) => {
    await clearGraphDB();
    done();
  });

  beforeEach(() => {
    clientCallback.mockReset();
  });

  it('should throw JWTNarrativeMismatch for token with wrong narrative', async (done) => {
    const narrative = 'wrong narrative';
    const token = generateJWT(mockUser, undefined, narrative);
    // @ts-ignore
    await logoutUser({ request: { token } }, clientCallback);
    const [[arg1]] = clientCallback.mock.calls;
    expect(arg1.message).toEqual(`Expected the payload's narrative to equal login but received ${narrative}!`);
    done();
  });

  it('should return User not found if the user is not found in db', async (done) => {
    const token = generateJWT(mockUser);
    // @ts-ignore
    await logoutUser({ request: { token } }, clientCallback);
    const [[arg1]] = clientCallback.mock.calls;
    expect(arg1.message).toEqual('User not found!');
    done();
  });

  it('should store the token\'s identifier in mongo', async (done) => {
    await mockUser.save();
    const token = generateJWT(mockUser);
    // @ts-ignore
    await logoutUser({ request: { token } }, clientCallback);
    const [[arg1, arg2]] = clientCallback.mock.calls;
    expect(arg1).toEqual(null);
    expect(arg2.message).toEqual(logoutSuccess);
    done();
  });

  it('should return already logged out if token with similar jti is found in db', async (done) => {
    const token = generateJWT(mockUser);
    const { jti, exp } = decodeJWT(token);
    await Token.create({
      jti,
      exp: new Date(exp),
    });
    // @ts-ignore
    await logoutUser({ request: { token } }, clientCallback);
    const [[arg1, arg2]] = clientCallback.mock.calls;
    expect(arg1).toEqual(null);
    expect(arg2.message).toEqual(loggedOutAlready);
    done();
  });
});
