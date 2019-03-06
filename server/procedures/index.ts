import db from '../database';

const createUser = async (incomingMessage: any, callback: any) => {
  try {
    const { request: { name } } = incomingMessage;
    const { records } = await db.run(
      'CREATE (n: User {name: $name}) RETURN n.name AS name',
      { name }
    );
    const [record] = records;
    const message = `User: ${ record.get('name') } created successfully`;
    callback(null, {userResult: message})
  } catch (error) {
    callback(error);
  }
}

export default createUser;
