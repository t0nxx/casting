import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile_courses')
export class Courses {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'unknown' })
    course_name: string;

    @Column({ default: 'unknown' })
    institute: string;

}
