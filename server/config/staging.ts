import getEnv from './utils';
import generalOptionalVariables from './utils/optionalVariables';
import r from './utils/requiredVariables';

// Define the required variables
const requiredVariables: string[] = [...r];
// Define optional environment variables and their defaults for development
const optionalVariables = {
  GRAPH_DB_PROTOCOL: 'bolt',
  GRAPH_DB_NAME: 'shopinc',
  GRPC_SERVER_HOST: '0.0.0.0',
  FRONTEND_URL: 'https://frontend.url',
  PROTOBUF_USER: 'shop-inc',
  ...generalOptionalVariables,
};

export default () => getEnv(requiredVariables, optionalVariables);
