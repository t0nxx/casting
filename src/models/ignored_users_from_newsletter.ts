import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ignored_mails_from_newsletter')
export class IgnoredMailsFromNewsletter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;
}
