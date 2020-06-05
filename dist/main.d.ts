import 'reflect-metadata';
import * as Queue from 'bull';
export declare const notificationQueue: Queue.Queue<any>;
export declare const autoReplyMessageQueue: Queue.Queue<any>;
export declare const sendEmailsQueue: Queue.Queue<any>;
