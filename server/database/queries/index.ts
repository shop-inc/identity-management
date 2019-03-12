import db from '../index';

export const clearDB = async () => {
  await db.run('MATCH (n) DETACH DELETE n;')
};
