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

    @IsNotEmpty({ message: 'name_ar is required' })
    @Column({ unique: true })
    name_ar: string;

    // @OneToMany(() => company_tags, (company_tags: company_tags) => company_tags.category)
    // companyTagss: company_tags[];

    // @OneToMany(() => job_category, (job_category: job_category) => job_category.jobCategory)
    // jobCategorys: job_category[];

    // @OneToMany(() => users_profile_categories, (users_profile_categories: users_profile_categories) => users_profile_categories.talentCategory)
    // usersProfileCategoriess: users_profile_categories[];

}
