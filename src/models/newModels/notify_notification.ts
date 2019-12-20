import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notification')
export class Notification {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('integer')
    actor_object_id: number | null;

    @Column()
    actor_text: string | null;

    @Column()
    actor_url_text: string | null;

    @Column()
    verb: string;

    @Column()
    description: string | null;

    @Column()
    nf_type: string;

    @Column()
    target_text: string ;

    @Column()
    target_url: string ;

    @CreateDateColumn()
    created: Date;

    @Column({ default: false })
    read: boolean;

    @Column({ default: false })
    deleted: boolean;

    // @ManyToOne(() => auth_user, (auth_user: auth_user) => auth_user.notifyNotifications, {  nullable: false })
    // @JoinColumn({ name: 'recipient_id'})
    // recipient: auth_user | null;

}
