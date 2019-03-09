import {TokenPayload} from 'google-auth-library/build/src/auth/loginticket';
import db from '../index';
import Profile from './profile';
import Role, {administrator, buyer} from './role';

class User {

  public static async getUserByEmail(email: string) {
    try {
      const { records } = await db.run('MATCH (n:User { email: $email }) RETURN n;', { email });
      return records;
    } catch (e) {
      throw e;
    }
  }
  public name: string;
  public email: string;
  public profile: Profile;
  public role: Role;

  constructor(identity: TokenPayload | administratorIdentity ) {
    this.name = identity.name;
    this.email = identity.email;
    this.profile = new Profile(identity.picture);
    // Role is set to buyer by default
    this.role = buyer;
  }

  public async save() {
    const params: object = {
      email: this.email,
      name: this.name,
      imageUrl: this.profile.imageUrl,
      lastUpdated: this.profile.lastUpdated,
      roleName: this.role.roleName,
    };
    try {
      // If this user exists, exit
      const userNodes = await User.getUserByEmail(this.email);
      if (userNodes.length) {
        return;
      }
      // Create the User
      // Create the Profile,
      // Create the relationship between the User and their Role which is buyer by default
      await db.run(
        `
        CREATE
          (user: User { name: $name, email: $email }),
          (profile: Profile { imageUrl: $imageUrl, lastUpdated: $lastUpdated }),
          (user)-[:HAS]->(profile)
        WITH user AS u
        MATCH (r:Role { roleName: $roleName })
        CREATE (u)-[:IS]->(r) RETURN u;
          `, params);
    } catch (e) {
      throw e;
    }
  }

  public toString() {
    return this.name;
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Administrator extends User {
  constructor(adminIdentity: administratorIdentity) {
    super(adminIdentity);
    this.role = administrator;
  }
}
export default User;
