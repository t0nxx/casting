import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('height_range_lookup')
export class HeightRangeLookup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

}
