import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('admin_notification_panel')
export class NotificationAdminPanel {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({default : ''})
    body: string;

    @CreateDateColumn()
    created: Date;

}
