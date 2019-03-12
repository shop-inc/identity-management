import getEnv from './utils';
import generalOptionalVariables from './utils/optionalVariables';
import r from './utils/requiredVariables';

// Define the required variables
const requiredVariables: string[] = [...r];
// Define optional environment variables and their defaults for development
const optionalVariables = {
  GRAPH_DB_USER: 'neo4j',
  GRAPH_DB_PASSWORD: 'admin',
  GRAPH_DB_PROTOCOL: 'bolt',
  GRAPH_DB_HOST: 'localhost',
  GRAPH_DB_NAME: 'shopinc_dev',
  GRPC_SERVER_HOST: '127.0.0.1',
  GOOGLE_CLIENT_ID: 'our google client id',
  ADMINISTRATOR_EMAIL: 'admin@shop-inc.com',
  ...generalOptionalVariables,
};

export default () => getEnv(requiredVariables, optionalVariables);
