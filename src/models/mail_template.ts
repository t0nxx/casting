import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('newsletter_mail_template')
export class NewsLetterMailTemplate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('longtext')
    body: string;

    @CreateDateColumn()
    create_date: Date;

    @UpdateDateColumn()
    update_date: Date;

}
