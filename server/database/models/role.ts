import db from '../index';

class Role {

  public static async getRoleByName(roleName: string) {
    // TODO return instance of role
    const { records } = await db.run(
      'MATCH (r:Role { roleName: $roleName }) RETURN r;',
      { roleName },
    );
    return records;
  }

  public roleName: string;

  constructor(roleName: string) {
    this.roleName = roleName;
  }

  public async save() {
    // Check if this role exists in the graph db
    const roleNodes = await Role.getRoleByName(this.roleName);

    // if role exists, exit the function
    if (roleNodes.length) {
      return;
    }
    // store the role in the graph db
    await db.run(
      'CREATE (r:Role { roleName: $roleName });',
      { roleName: this.roleName },
    );
  }

}

export const administrator = new Role('Administrator');
export const buyer = new Role('Buyer');
export const seller = new Role('Seller');

export default Role;
