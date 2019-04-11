import mongoose from 'mongoose';
import env from '../config';

const config = {
  useNewUrlParser: true,
  useCreateIndex: true,
};

const { MONGO_DB_PORT, MONGO_DB_HOST, MONGO_DB_NAME } = env;

const MONGO_DB_URL = `mongodb://${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;
const mongo = mongoose.connect(
  MONGO_DB_URL,
  config,
);

export default mongo;
