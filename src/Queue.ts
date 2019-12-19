import * as  Queue from 'bull'
import SendNotifiation from './jobs/SendNotification';
const notificationQueue = new Queue('notiQueue', { redis: { host: '127.0.0.1', port: 6379 } });


notificationQueue.process(SendNotifiation);


notificationQueue.on('failed', job => {
   
    console.log('****************** job fail ******** for job ' + job);
    console.log(job);
})
export default notificationQueue;

