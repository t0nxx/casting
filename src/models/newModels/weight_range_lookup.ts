import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('weight_range_lookup')
export class WeightRangeLookup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
