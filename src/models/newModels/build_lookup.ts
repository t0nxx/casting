import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('build_lookup')
export class BuildLookup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}
