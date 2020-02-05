import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {company_tags} from "./company_tags";
import {job_category} from "./job_category";
import {users_profile_categories} from "./users_profile_categories";


@Entity("talent_categories" ,{schema:"public" } )
@Index("talent_categories_name_en_name_ar_d47bc0cd_uniq",["name_ar","name_en",],{unique:true})
export class talent_categories {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"name_en"
        })
    name_en:string;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"name_ar"
        })
    name_ar:string;
        

   
    @OneToMany(()=>company_tags, (company_tags: company_tags)=>company_tags.category)
    companyTagss:company_tags[];
    

   
    @OneToMany(()=>job_category, (job_category: job_category)=>job_category.jobCategory)
    jobCategorys:job_category[];
    

   
    @OneToMany(()=>users_profile_categories, (users_profile_categories: users_profile_categories)=>users_profile_categories.talentCategory)
    usersProfileCategoriess:users_profile_categories[];
    
}
