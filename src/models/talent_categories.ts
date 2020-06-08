import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
// import {company_tags} from "./company_tags";
// import {job_category} from "./job_category";
// import {users_profile_categories} from "./users_profile_categories";

@Entity('talent_categories')
export class TalentCategories {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'name_en is required' })
    @Column({ unique: true })
    name_en: string;

    @Column({ default : '' })
    name_ar: string;

}
