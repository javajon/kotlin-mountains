import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.join(__dirname, "./mountains.proto");
const MOUNTAINS_SERVER = process.env.MOUNTAINS_SERVER || "localhost:9090";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const mountainProto = grpc.loadPackageDefinition(packageDefinition).mountains;
const client = new mountainProto.MountainService(
    MOUNTAINS_SERVER,
    grpc.credentials.createInsecure()
);

console.log("Connecting to gRPC server at %s", MOUNTAINS_SERVER);

export default client;