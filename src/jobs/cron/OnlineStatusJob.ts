import * as cron from 'node-cron';
import { getRepository } from 'typeorm';
import { ProfileSettings, myStatus } from '../../models/profile_settings';


export const ChaneUsersOnlineSatusJob = () => {
    cron.schedule('* * * * *', async () => {
        console.log('running a task every minute');
        const settingsRepository = getRepository(ProfileSettings);
        try {
            const setOnlineStaus = await settingsRepository.createQueryBuilder()
                .update()
                .set({ my_status: myStatus.ONLINE })
                .where('TIMESTAMPDIFF(MINUTE, latest_action, NOW()) < 10')
                .execute();

            const setOfflineStaus = await settingsRepository.createQueryBuilder()
                .update()
                .set({ my_status: myStatus.OFFLINE })
                .where('TIMESTAMPDIFF(MINUTE, latest_action, NOW()) > 10')
                .execute();
        } catch (error) {
            console.log('cron job faild');
        }
    });

    // cron job
    // UPDATE `profile_settings` SET `my_status` = 'OFFLINE' 
    // WHERE TIMESTAMPDIFF(MINUTE, latest_action, NOW()) > 10 ;

    // UPDATE `profile_settings` SET `my_status` = 'ONLINE' 
    // WHERE TIMESTAMPDIFF(MINUTE, latest_action, NOW()) < 10;
}
