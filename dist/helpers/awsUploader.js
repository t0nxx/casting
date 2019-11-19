"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const Secrets_1 = require("../config/Secrets");
AWS.config.update({
    accessKeyId: Secrets_1.AwsAccessKeyId,
    secretAccessKey: Secrets_1.AwsSecretAccessKey,
    region: Secrets_1.AwsRegion,
});
const s3 = new AWS.S3();
const bucketName = 'casting-secret';
exports.UploadToS3 = (file, type) => {
    const folder = type === 'image' ? 'images' : type === 'video' ? 'videos' : type === 'audio' ? 'voices' : 'videos';
    return s3.upload({
        Body: file.data,
        Bucket: `${bucketName}/${folder}`,
        Key: `${Date.now().toString()} - ${file.name}`,
        ACL: 'public-read',
        ContentType: file.mimetype,
    })
        .promise()
        .then(data => {
        return data.Location;
    }, err => {
        return err;
    });
};
//# sourceMappingURL=awsUploader.js.map