import { sendMailWithCustomHtmlTemplate, sendNewJobToMail } from '../helpers/sendMail';

export enum EmailsToSendType {
    NewsLetter = 'NewsLetter',
    NewJobAdded = 'NewJobAdded',
}


export interface EmailQueueInterface {
    type: EmailsToSendType;
    recipients: string[];
    htmlTemplate?: string;
    jobTitle?: string;
    jobDescription?: string;
    jobLink?: string;
}

export default async function ({ data }) {
    try {
        switch (data.type) {
            case EmailsToSendType.NewsLetter:
                sendMailWithCustomHtmlTemplate(data.recipients, data.htmlTemplate);
                break;
            case EmailsToSendType.NewJobAdded:
                sendNewJobToMail(data.recipients, data.jobTitle, data.jobDescription, data.jobLink);
                break;
            default:
                break;
        }

    } catch (error) {
        console.log('errror in Mails Queue              ' + error);
    }
}
