import { Entity, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './users_profile';
import { Jobs } from './jobs';

@Entity('who_see_me')
export class WhoSeeMe {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({ default: 1 })
    viewed: number;

    @PrimaryColumn({ default: 1 })
    viewer: number;

}
