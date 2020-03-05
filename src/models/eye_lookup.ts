import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('eye_lookup')
export class EyeLookup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
