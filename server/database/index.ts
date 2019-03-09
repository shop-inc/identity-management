import { v1 as neo4j } from 'neo4j-driver';
// @ts-ignore
import { Neo4jError } from 'neo4j-driver/lib/v1/error.js';
import Session from 'neo4j-driver/types/v1/session';
import env from '../config';
import { errorLogger } from '../loggers';

// tslint:disable-next-line: no-shadowed-variable
const testConnection = async (session: Session) => {
  try {
    await session.run('MATCH (n) RETURN n LIMIT 1');
  } catch (e) {
    if (e.code === 'Neo.ClientError.Security.Unauthorized') {
      errorLogger('Connection to Neo4j failed due to authentication failure. exiting...');
      process.exit();
    }
    throw e;
  }
};

const { GRAPH_DB_HOST , GRAPH_DB_USER, GRAPH_DB_PASSWORD, GRAPH_DB_PROTOCOL, GRAPH_DB_PORT } = env;
const uri: string = `${GRAPH_DB_PROTOCOL}://${GRAPH_DB_HOST}:${GRAPH_DB_PORT}`;

const driver = neo4j.driver(uri, neo4j.auth.basic(GRAPH_DB_USER, GRAPH_DB_PASSWORD));
const session: Session = driver.session();

testConnection(session);

export default session;
