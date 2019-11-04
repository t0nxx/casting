import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './users_profile';
import { IsEnum } from 'class-validator';

export enum settingsView {
    // can see profile , can send message ... etc
    ONLY_FRIENDS = 'ONLY_FRIENDS',
    COMPANY = 'COMPANY',
    ALL = 'ALL',

}

export enum myStatus {
    // can see profile , can send message ... etc
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',

}
@Entity('profile_settings')

export class ProfileSettings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: settingsView.ALL })
    can_see_profile: settingsView;

    @Column({ default: settingsView.ALL })
    can_see_wall: settingsView;

    @Column({ default: settingsView.ALL })
    can_comment: settingsView;

    @Column({ default: settingsView.ALL })
    can_contact_info: settingsView;

    @Column({ default: settingsView.ALL })
    can_send_message: settingsView;

    @Column({ default: settingsView.ALL })
    can_see_friends: settingsView;

    @Column({ default: false })
    response_all_time: boolean;

    @Column({ default: null })
    response_from: Date;

    @Column({ default: null })
    response_to: Date;

    @Column({ default: 'No provided setting' })
    response_message: string;

    @Column({ default: false })
    auto_play_video: boolean;

    @Column({ default: false })
    jobs_notification: boolean;

    @Column({ default: myStatus.ONLINE })
    my_status: myStatus;

    @OneToOne(type => Profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    profile: Profile;
}
