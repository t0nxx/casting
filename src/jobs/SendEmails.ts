import { sendMailWithCustomHtmlTemplate } from '../helpers/sendMail';

export enum EmailsToSendType {
    NewsLetter = 'NewsLetter',
    NewJobAdded = 'NewJobAdded',
}

export interface EmailQueueInterface {
    type: EmailsToSendType;
    recipients: string[];
    htmlTemplate?: string;

}

export default async function ({ data }) {
    try {
        switch (data.type) {
            case EmailsToSendType.NewsLetter:
                sendMailWithCustomHtmlTemplate(data.recipients, data.htmlTemplate);
                break;
            case EmailsToSendType.NewJobAdded:
                // toDo();
                break;
            default:
                break;
        }

    } catch (error) {
        console.log('errror in Mails Queue              ' + error);
    }
}
