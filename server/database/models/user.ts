import { UnverifiedUser } from '../../exceptions';
import databases from '../index';
import Profile from './profile';
import Role, { administrator, buyer } from './role';

const db = databases.graphdb;

class User {
  /**
   * Returns an instance of User if a user with the given email was found, else false
   * @param email {String} The user's email
   */
  public static async findUserByEmail(email: string) {
    try {
      // TODO Return only most recent profile.
      const { records } = await db.run(
        `MATCH (u:User { email: $email })-[relIs:IS]->(role:Role),
                         (u)-[:HAS]->(p:Profile)
                   RETURN u.name AS name, u.email AS email, p.imageUrl AS picture, p.lastUpdated AS lastUpdated,
                     relIs.verified AS verified, relIs.dateVerified AS dateVerified,
                     relIs.mailSent AS mailSent, relIs.mailSentDate AS mailSentDate,
                     role.roleName as roleName`
        , { email });
      if (!records.length) {
        return false;
      }
      const [record] = records;
      const params = {
        name: record.get('name'),
        email: record.get('email'),
        verified: record.get('verified'),
        dateVerified: record.get('dateVerified'),
        mailSent: record.get('mailSent'),
        mailSentDate: record.get('mailSentDate'),
        roleName: record.get('roleName'),
        picture: record.get('picture'),
        lastUpdated: record.get('lastUpdated'),
      };
      return new User(params);
    } catch (e) {
      /* istanbul ignore next */
      throw e;
    }
  }

  public name: string;
  public email: string;
  public profile: Profile;
  public role: Role;
  public verified: boolean;
  public dateVerified: string;
  public mailSent: boolean;
  public mailSentDate: string;

  /**
   * The class that represents a user
   * @param identity: {UserConstructor} The details that the user should have
   */
  constructor(identity: UserConstructor) {
    this.name = identity.name;
    this.email = identity.email;
    this.profile = new Profile(identity.picture, identity.lastUpdated);
    // Role is set to buyer by default
    this.role = identity.roleName ? new Role(identity.roleName) : buyer;
    this.verified = identity.verified || false;
    this.dateVerified = identity.dateVerified || '';
    this.mailSent = identity.mailSent || false;
    this.mailSentDate = identity.mailSentDate || '';
  }

  public async save() {
    try {
      // If this user exists, exit
      const existingUser = await User.findUserByEmail(this.email);
      if (existingUser) {
        return;
      }
      // Create the User,
      // Create the Profile,
      // Create the relationship between the User and their Profile,
      // Create the relationship between the User and their Role.
      await db.run(
        `
        CREATE
          (user: User { name: $name, email: $email }),
          (profile: Profile { imageUrl: $imageUrl, lastUpdated: $lastUpdated }),
          (user)-[:HAS]->(profile)
        WITH user AS u
        MATCH (r:Role { roleName: $roleName })
        CREATE (u)-[:IS { verified: $verified, dateVerified: $dateVerified,
        mailSent: $mailSent, mailSentDate: $mailSentDate }]->(r);
          `, this.serialize());
    } catch (e) {
      // TODO Handle exception
      /* istanbul ignore next */
      throw e;
    }
  }

  public serialize = () => ({
    email: this.email,
    name: this.name,
    imageUrl: this.profile.imageUrl,
    lastUpdated: this.profile.lastUpdated,
    roleName: this.role.roleName,
    verified: this.verified,
    dateVerified: this.dateVerified,
    mailSent: this.mailSent,
    mailSentDate: this.mailSentDate,
  });

  public updateMailSent = async (properties ?: { mailSentDate?: string, mailSent?: boolean}) => {
    try {

      const props = {
        mailSent: true,
        mailSentDate: new Date().toISOString(),
        ...properties,
      };

      await db.run(
        'MATCH (: User { email: $email })-[r:IS]->(:Role { roleName: $roleName }) SET r += $props;',
        {
          ...this.serialize(),
          props,
        });
      this.mailSent = props.mailSent;
      this.mailSentDate = props.mailSentDate;
    } catch (e) {
      // TODO Handle exception
      /* istanbul ignore next */
      throw e;
    }
  };

  public checkVerifiedUser() {
    // Checking if the email was sent
    const sentDate: number = new Date(Date.parse(this.mailSentDate)).getTime();
    const timeDifference = new Date().getTime() - sentDate;
    // tslint:disable-next-line: whitespace
    const intervalDays = (timeDifference/1000)/60/60/24;
    if (this.mailSent && !this.verified) {
      if (Math.floor(intervalDays) > 3) {
        throw new UnverifiedUser();
      }
    }
    return;
  }

  public async verify() {
    try {
      const props = {
        verified: true,
        dateVerified: new Date().toISOString(),
      };
      await db.run(
        'MATCH (: User { email: $email })-[r:IS]->(:Role { roleName: $roleName }) SET r += $props;',
        {
          ...this.serialize(),
          props,
        });
      this.verified = props.verified;
      this.dateVerified = props.dateVerified;
    } catch (e) {
      // TODO Handle exception
      /* istanbul ignore next */
      throw e;
    }
  }
}

export class Administrator extends User {
  constructor(adminIdentity: UserConstructor) {
    super(adminIdentity);
    this.role = administrator;
    this.verified = true;
  }
}
export default User;
