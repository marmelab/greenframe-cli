const pjson = require('../package.json');

// Import required AWS SDK clients and commands for Node.js.
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('node:path');
const fs = require('node:fs');

const files = ['./scripts/ressources/install.sh', './scripts/ressources/install-frpc.sh']; // Path to and name of object. For example '../myFiles/index.js'.

// Set the AWS Region.
const REGION = 'eu-west-3'; // e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

const uploadFile = (file) => {
    const fileStream = fs.createReadStream(file);
    // Set the parameters
    const uploadParams = {
        Bucket: pjson.oclif.update.s3.bucket,
        // Add the required 'Key' parameter using the 'path' module.
        Key: path.basename(file),
        // Add the required 'Body' parameter
        Body: fileStream,
    };
    return s3Client.send(new PutObjectCommand(uploadParams));
};

// Upload file to specified bucket.
const run = async () => {
    try {
        files.forEach(async (file) => {
            await uploadFile(file);
            console.log('Success', file);
        });
    } catch (error) {
        console.log('Error', error);
    }
};

run();
