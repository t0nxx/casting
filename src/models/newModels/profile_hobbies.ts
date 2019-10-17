import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile_hobbies')
export class Hobbies {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
