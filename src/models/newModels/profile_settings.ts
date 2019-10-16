import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Profile } from './users_profile';

@Entity('profile_settings')

export class ProfileSettings {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'No provided setting' })
    can_see_profile: string;

    @Column({ default: 'No provided setting' })
    can_see_wall: string;

    @Column({ default: 'No provided setting' })
    can_comment: string;

    @Column({ default: 'No provided setting' })
    can_contact_info: string;

    @Column({ default: 'No provided setting' })
    can_send_message: string;

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

    @Column({ default: 'No provided setting' })
    can_see_friends: string;

    @Column({ default: 'No provided setting' })
    my_status: string;

    @OneToOne(type => Profile)
    @JoinColumn()
    profile: Profile;
}
