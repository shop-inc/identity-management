import { v1 as neo4j } from 'neo4j-driver'
import env from '../config';

const { GRAPH_DB_HOST, GRAPH_DB_USER, GRAPH_DB_PASSWORD } = env;
const driver = neo4j.driver(GRAPH_DB_HOST, neo4j.auth.basic(GRAPH_DB_USER, GRAPH_DB_PASSWORD));
const session: any = driver.session();

export default session;