import * as AWS from 'aws-sdk';
import { AwsAccessKeyId, AwsSecretAccessKey, AwsRegion } from '../config/Secrets';
AWS.config.update({
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    region: AwsRegion,
});

const s3 = new AWS.S3();

const bucketName = 'casting-secret';

export const UploadToS3 = (file, type) => {
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
        }
            , err => {
                return err;
            });
};
