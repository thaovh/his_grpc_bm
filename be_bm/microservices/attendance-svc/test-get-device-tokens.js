const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

// Configuration
// Users-svc runs on port 50051
const USERS_GRPC_URL = process.env.USERS_GRPC_URL || process.env.USERS_SVC_URL || 'localhost:50051';
const EMPLOYEE_CODE = process.env.EMPLOYEE_CODE || '1844';

// Proto file paths - Try users-svc proto first, fallback to attendance-svc proto
const usersSvcProtoPath = path.join(__dirname, '..', 'users-svc', 'src', '_proto', 'users.proto');
const attendanceSvcProtoPath = path.join(__dirname, 'src', '_proto', 'users.proto');
const protoPath = fs.existsSync(usersSvcProtoPath) ? usersSvcProtoPath : attendanceSvcProtoPath;
const commonsProtoPath = path.join(__dirname, 'src', '_proto', 'commons.proto');

// Check if proto files exist
if (!fs.existsSync(protoPath)) {
    console.error(`❌ Proto file not found: ${protoPath}`);
    process.exit(1);
}

console.log('📋 Configuration:');
console.log(`   gRPC URL: ${USERS_GRPC_URL}`);
console.log(`   Employee Code: ${EMPLOYEE_CODE}`);
console.log(`   Proto Path: ${protoPath}`);
console.log('');

// Load proto files
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    includeDirs: [path.join(__dirname, 'src', '_proto')],
});

const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

// Create gRPC client
console.log(`🔌 Connecting to gRPC server at ${USERS_GRPC_URL}...`);
const client = new usersProto.UsersService(
    USERS_GRPC_URL,
    grpc.credentials.createInsecure()
);

// Test GetDeviceTokens
console.log(`🔍 Testing GetDeviceTokens for employee: ${EMPLOYEE_CODE}...`);
console.log('');
console.log('   Available methods:', Object.keys(usersProto.UsersService.service || {}));
console.log('');

const request = {
    employeeCode: EMPLOYEE_CODE
};

client.GetDeviceTokens(request, (error, response) => {
    if (error) {
        console.error('❌ Error calling GetDeviceTokens:');
        console.error(`   Code: ${error.code}`);
        console.error(`   Message: ${error.message}`);
        console.error(`   Details: ${error.details}`);
        process.exit(1);
    }

    console.log('✅ Success! Response received:');
    console.log('');
    
    // Check response structure
    console.log('   Raw response:', JSON.stringify(response, null, 2));
    console.log('');
    
    const tokens = response.deviceTokens || response.tokens || [];
    
    if (tokens && tokens.length > 0) {
        console.log(`   📱 Found ${tokens.length} device token(s):`);
        tokens.forEach((token, index) => {
            const truncated = token.length > 50 ? token.substring(0, 50) + '...' : token;
            console.log(`   ${index + 1}. ${truncated}`);
        });
        console.log('');
        console.log('✅ Users service is returning device tokens correctly!');
    } else {
        console.log('   ⚠️  No device tokens found');
        console.log('');
        console.log('⚠️  This could mean:');
        console.log('   1. Employee code does not have any registered device tokens');
        console.log('   2. Device tokens exist but isActive = 0');
        console.log('   3. Entity field mapping issue (isActive field)');
        console.log('   4. Users-svc needs to be restarted after adding isActive field');
    }
    
    process.exit(0);
});

// Set timeout
setTimeout(() => {
    console.error('❌ Request timeout after 10 seconds');
    process.exit(1);
}, 10000);

