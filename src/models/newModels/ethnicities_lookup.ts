import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ethnicities_lookup')
export class EthnicitiesLookup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
