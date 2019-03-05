import getEnv from './utils';
import generalOptionalVariables from './utils/optionalVariables';

// Define the required variables
const requiredVariables: Array<string> = [];
// Define optional environment variables and their defaults for development
const optionalVariables = {
    GRAPH_DB_USER: 'neo4j',
    GRAPH_DB_PASSWORD: 'admin',
    GRAPH_DB_HOST: 'localhost',
    GRAPH_DB_NAME: 'shopinc_dev',
    ...generalOptionalVariables,
};

export default () => getEnv(requiredVariables, optionalVariables);
