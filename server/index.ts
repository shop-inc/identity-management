import grpcServer from './server';

process.once('unhandledRejection', ((reason) => {console.error(reason); process.exit(); }));

grpcServer.start();
