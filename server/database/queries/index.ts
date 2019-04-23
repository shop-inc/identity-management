import mongoose from 'mongoose';
import databases from '../index';

const db = databases.graphdb;

export const clearMongoDB = async () => {
  for (const collection in mongoose.connection.collections) {
    if (mongoose.connection.collections[collection]) {
      await mongoose.connection.collections[collection].deleteMany({});
    }
  }
};

export const clearGraphDB = async () => {
  await db.run('MATCH (n) DETACH DELETE n;')
};
