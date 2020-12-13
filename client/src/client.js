const PROTO_PATH = "./mountains.proto";
const MOUNTAINS_SERVER = process.env.MOUNTAINS_SERVER || "localhost:8321";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

const mountains_proto = grpc.loadPackageDefinition(packageDefinition).mountains;
const client = new mountains_proto.MountainService(
	MOUNTAINS_SERVER,
	grpc.credentials.createInsecure()
);

console.log("Connecting to server %s", MOUNTAINS_SERVER)

module.exports = client;
