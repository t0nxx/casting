import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hair_lookup')
export class HairLookup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
