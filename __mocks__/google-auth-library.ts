import { mockUser } from '../server/procedures/mockData';

const getPayload = () => mockUser;

export const verifyIdToken = jest.fn()
  // Mock an error in verification when it is first called
  .mockImplementationOnce(() => {throw new Error()})
  // Mock a successful verification thereafter
  .mockImplementation(() => ({ getPayload }));

// Class that mocks the actual OAuth2 client by google-auth-library
// It exposes a mock function verifyIdToken
export class OAuth2Client {
  public verifyIdToken = verifyIdToken;
}
