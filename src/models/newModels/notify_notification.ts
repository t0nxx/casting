import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Profile } from './users_profile';

@Entity('notification')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    verb: string;

    @Column()
    type: number;

    @Column({ default: null })
    target_job_slug: string;

    @Column({ default: null })
    target_profile_slug: string;

    @Column({ default: null })
    target_company: string;

    @Column({ default: null })
    target_activity_id: number;

    @CreateDateColumn()
    created: Date;

    @Column({ default: false })
    read: boolean;

    @Column({ default: null })
    actor_first_name: string;

    @Column({ default: null })
    actor_last_name: string;

    @Column({ default: null })
    actor_avatar: string;

    @ManyToOne(type => Profile, p => p.notifications, { onDelete: 'CASCADE' })
    recipient: Profile;
}
