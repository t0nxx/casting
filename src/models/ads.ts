import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('advertisement')
export class Advertisement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    path: string;

    @CreateDateColumn()
    create_date: Date;

    @Column({ default: false })
    vip: boolean;

    @Column({ default: true })
    link_button: boolean;

    @Column({ default: '' })
    link_button_text: string;

    @Column({ default: '' })
    name: string;

}
