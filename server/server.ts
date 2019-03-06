import env from './config';
import grpc from 'grpc';
import { resolve } from 'path';
import {serverLogger} from './loggers';
import procedures from './procedures';
// @ts-ignore
import interceptors from '@echo-health/grpc-interceptors';

const {GRPC_SERVER_HOST, GRPC_SERVER_PORT} = env;

const PROTO_PATH = resolve(__dirname, './protobufs');

const protoLoader = require('@grpc/proto-loader');
const identityPackageDefinition = protoLoader.loadSync(
    resolve(PROTO_PATH, './identity.proto'),
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const grpcServer = interceptors.serverProxy(new grpc.Server());
const identityDescriptor = grpc.loadPackageDefinition(identityPackageDefinition);
const { IdentityService }: any = identityDescriptor;

grpcServer.addService(IdentityService.service, procedures);


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

grpcServer.bind(`${GRPC_SERVER_HOST}:${GRPC_SERVER_PORT}`, grpc.ServerCredentials.createInsecure());

export default grpcServer;