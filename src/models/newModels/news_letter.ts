import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity('news_letter')
export class NewsLetter {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'email name is required' })
    @IsEmail()
    @Column({ unique: true })
    email: string;

    @CreateDateColumn()
    createDate: Date;
}
