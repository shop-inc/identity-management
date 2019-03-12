// @ts-ignore
import interceptors from '@echo-health/grpc-interceptors';
import grpc from 'grpc';
import env from './config';
import { serverLogger } from './loggers';

const grpcServer = interceptors.serverProxy(new grpc.Server());

const morganGRPC = async (context: any, next: any) => {
  // do stuff before call
  const startTime = Date.now();
  const [ userAgent ] = context.call.metadata.get('user-agent');
  await next();

  // do stuff after call
  const stopTime = Date.now();
  serverLogger(`user-agent: ${userAgent}, call-time: ${stopTime - startTime}ms`);
};

grpcServer.use(morganGRPC);
const { GRPC_SERVER_HOST, GRPC_SERVER_PORT } = env;
grpcServer.bind(`${GRPC_SERVER_HOST}:${GRPC_SERVER_PORT}`, grpc.ServerCredentials.createInsecure());

export default grpcServer;
