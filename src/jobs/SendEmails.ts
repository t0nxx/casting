import { sendMailWithCustomHtmlTemplate, sendNewJobToMail } from '../helpers/sendMail';

export enum EmailsToSendType {
    NewsLetter = 'NewsLetter',
    NewJobAdded = 'NewJobAdded',
}


export interface EmailQueueInterface {
    type: EmailsToSendType;
    /**
     * recipients: string[]; , it should like that , but i put any cause i need to split it in many situatuions 
     * , the returned array of split operation is from type unknown which cause an error
     */

    recipients: any;
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
