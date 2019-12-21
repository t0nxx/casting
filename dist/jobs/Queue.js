"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue = require("bull");
const SendNotification_1 = require("./SendNotification");
const notificationQueue = new Queue('notiQueue', { redis: { host: '127.0.0.1', port: 6379 } });
notificationQueue.process(SendNotification_1.default);
notificationQueue.on('failed', job => {
    console.log('****************** job fail ******** for job ' + job);
    console.log(job);
});
exports.default = notificationQueue;
//# sourceMappingURL=Queue.js.map