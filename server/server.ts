import env from './config';
import grpc from 'grpc';
import { resolve } from 'path';
import createUser from './procedures'

const {GRPC_SERVER_HOST, GRPC_SERVER_PORT} = env;

const PROTO_PATH = resolve(__dirname, './protobufs');

const protoLoader = require('@grpc/proto-loader');
const identityPackageDefinition = protoLoader.loadSync(
    resolve(PROTO_PATH, './example.proto'),
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const grpcServer = new grpc.Server();
const identityDescriptor = grpc.loadPackageDefinition(identityPackageDefinition);
const { IdentityService }: any = identityDescriptor;

grpcServer.addService(IdentityService.service, {
    createUser: createUser,
});

grpcServer.bind(`${GRPC_SERVER_HOST}:${GRPC_SERVER_PORT}`, grpc.ServerCredentials.createInsecure());

export default grpcServer;
