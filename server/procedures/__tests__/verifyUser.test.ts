import User from '../../database/models/user';
import { clearGraphDB } from '../../database/queries';
import seedGraphDB from '../../database/seeders';
import { generateJWT } from '../../helpers/jwt';
import { mockUser } from '../mockData';
import verifyUser, { alreadyResponse, successResponse } from '../verifyUser';

describe('Verify User rpc', () => {
  const clientCallback = jest.fn();
  const user = new User(mockUser);

  beforeAll(async (done) => {
    await clearGraphDB();
    await seedGraphDB();
    done();
  });

  afterAll(async (done) => {
    await clearGraphDB();
    done();
  });

  afterEach(() => {
    clientCallback.mockReset();
  });

  it('should throw error if the token was signed using wrong narrative', async (done) => {
    const emailToken = generateJWT(user, undefined, 'wrong narrative');
    // @ts-ignore
    await verifyUser({ request: { token: emailToken } }, clientCallback);
    const [[arg1]] = clientCallback.mock.calls;
    expect(arg1.message).toEqual(
      'Expected the payload\'s narrative to equal verification but received wrong narrative!',
    );
    done();
  });

  it('should throw error if the user is not found', async (done) => {
    const emailToken = generateJWT(user, undefined, 'verification');
    // @ts-ignore
    await verifyUser({ request: { token: emailToken } }, clientCallback);
    const [[arg1]] = clientCallback.mock.calls;
    expect(arg1.message).toEqual(
      'User not found!',
    );
    done();
  });

  it('should verify the user and update their details in the db', async (done) => {
    await user.save();
    const emailToken = generateJWT(user, undefined, 'verification');
    // @ts-ignore
    await verifyUser({ request: { token: emailToken } }, clientCallback);
    const storedUser = await User.findUserByEmail(mockUser.email);
    if (!storedUser) {
      expect(1).toEqual(2);
      return;
    }
    expect(storedUser.verified).toEqual(true);
    expect(storedUser.dateVerified).toBeTruthy();

    const [[arg1, arg2]] = clientCallback.mock.calls;
    expect(arg1).toBe(null);
    expect(arg2.status).toEqual(successResponse);
    expect(arg2).toHaveProperty('verificationDetails');
    const { verificationDetails } = arg2;
    expect(verificationDetails.verificationStatus).toEqual(true);
    expect(verificationDetails.dateVerified).toEqual(storedUser.dateVerified);
    done();
  });

  it('should return \'Already verified\' if the user was already verified', async (done) => {
    const emailToken = generateJWT(user, undefined, 'verification');
    // @ts-ignore
    await verifyUser({ request: { token: emailToken } }, clientCallback);
    const [[arg1, arg2]] = clientCallback.mock.calls;
    expect(arg1).toBe(null);
    expect(arg2.status).toEqual(alreadyResponse);
    expect(arg2).toHaveProperty('verificationDetails');
    const { verificationDetails } = arg2;
    expect(verificationDetails.verificationStatus).toEqual(true);
    expect(verificationDetails.dateVerified).toBeTruthy();
    done();
  });
});
