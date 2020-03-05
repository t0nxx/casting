import * as cron from 'node-cron';
import * as moment from 'moment';
import * as childProcess from 'child_process';
import * as AWS from 'aws-sdk';
import { AwsAccessKeyId, AwsSecretAccessKey, AwsRegion } from '../../config/Secrets';

AWS.config.update({
    accessKeyId: AwsAccessKeyId,
    secretAccessKey: AwsSecretAccessKey,
    region: AwsRegion,
});

const s3 = new AWS.S3();

const bucketName = 'casting-secret-new';

export const dbDailyBackup = () => {
    cron.schedule('* 6 * * *', async () => {
        console.log('running a task every day at 6 am');

        try {
            const dumpCommand = `mysqldump -uroot -ptonitonitoni casting_dev`;
            childProcess.exec(dumpCommand, (error, stdout, stderr) => {
                const bufferData = Buffer.from(stdout, 'utf8');
                const fileName = `${moment().format('YYYY-MM-DD-HH-mm-ss')}.sql`;

                s3.upload({
                    Body: bufferData,
                    Bucket: `${bucketName}/db_dump`,
                    Key: fileName,
                })
                    .promise()
                    .then(data => {
                        return data.Location;
                    }
                        , err => {
                            return err;
                        });
            });

        } catch (error) {
            console.log('cron job faild');
        }
    });

}
