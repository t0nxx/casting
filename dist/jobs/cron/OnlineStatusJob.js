"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron = require("node-cron");
const typeorm_1 = require("typeorm");
const profile_settings_1 = require("../../models/newModels/profile_settings");
exports.ChaneUsersOnlineSatusJob = () => {
    cron.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
        console.log('running a task every minute');
        const settingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
        try {
            const setOnlineStaus = yield settingsRepository.createQueryBuilder()
                .update()
                .set({ my_status: profile_settings_1.myStatus.ONLINE })
                .where('TIMESTAMPDIFF(MINUTE, latest_action, NOW()) < 10')
                .execute();
            const setOfflineStaus = yield settingsRepository.createQueryBuilder()
                .update()
                .set({ my_status: profile_settings_1.myStatus.OFFLINE })
                .where('TIMESTAMPDIFF(MINUTE, latest_action, NOW()) > 10')
                .execute();
        }
        catch (error) {
            console.log('cron job faild');
        }
    }));
};
//# sourceMappingURL=OnlineStatusJob.js.map