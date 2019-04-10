import getEnv from './utils';
import generalOptionalVariables from './utils/optionalVariables';
import r from './utils/requiredVariables';

// Define the required variables
const requiredVariables: string[] = [...r];
// Define optional environment variables and their defaults for development
const optionalVariables = {
  GRAPH_DB_USER: 'neo4j',
  GRAPH_DB_PASSWORD: 'shopinc',
  GRAPH_DB_PROTOCOL: 'bolt',
  GRAPH_DB_HOST: 'localhost',
  GRAPH_DB_NAME: 'shopinc_dev',
  GRPC_SERVER_HOST: '127.0.0.1',
  GOOGLE_CLIENT_ID: 'our google client id',
  ADMINISTRATOR_EMAIL: 'admin@shop-inc.com',
  ADMINISTRATOR_NAME: 'Test Admin',
  PROTOBUF_USER: 'shop-inc',
  SECRET_KEY: 'secret key',
  FRONTEND_URL: 'https://url.frontend',
  MAILGUN_DOMAIN: 'mailgun',
  MAILGUN_API_KEY: 'mailgun',

  ...generalOptionalVariables,
};

export default () => getEnv(requiredVariables, optionalVariables);
