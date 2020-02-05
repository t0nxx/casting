import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {company} from "./company";
import {job_applicants} from "./job_applicants";
import {job_category} from "./job_category";
import {job_schedules} from "./job_schedules";
import {job_shortlisted} from "./job_shortlisted";


@Entity("jobs" ,{schema:"public" } )
@Index("jobs_profile_id_0453d121",["profile",])
@Index("jobs_slug_44de2c8b_like",["slug",])
@Index("jobs_slug_key",["slug",],{unique:true})
@Index("jobs_title_key",["title",],{unique:true})
@Index("jobs_title_5ec67837_like",["title",])
export class jobs {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"publish_date"
        })
    publish_date:Date;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:250,
        name:"title"
        })
    title:string;
        

    @Column("text",{ 
        nullable:false,
        name:"description"
        })
    description:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"have_daily_perks"
        })
    have_daily_perks:boolean;
        

    @Column("numeric",{ 
        nullable:false,
        precision:7,
        scale:2,
        name:"daily_perks_budget"
        })
    daily_perks_budget:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"have_transportation"
        })
    have_transportation:boolean;
        

    @Column("numeric",{ 
        nullable:false,
        precision:7,
        scale:2,
        name:"transportation_budget"
        })
    transportation_budget:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"have_meal"
        })
    have_meal:boolean;
        

    @Column("numeric",{ 
        nullable:false,
        precision:7,
        scale:2,
        name:"meal_budget"
        })
    meal_budget:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"have_space_rest"
        })
    have_space_rest:boolean;
        

    @Column("numeric",{ 
        nullable:false,
        precision:7,
        scale:2,
        name:"space_rest_budget"
        })
    space_rest_budget:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_male"
        })
    is_male:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_female"
        })
    is_female:boolean;
        

    @Column("integer",{ 
        nullable:true,
        name:"age"
        })
    age:number | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"hide_company"
        })
    hide_company:boolean;
        

    @Column("numeric",{ 
        nullable:true,
        precision:7,
        scale:2,
        name:"latitude"
        })
    latitude:string | null;
        

    @Column("numeric",{ 
        nullable:true,
        precision:7,
        scale:2,
        name:"longitude"
        })
    longitude:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:50,
        name:"slug"
        })
    slug:string;
        

   
    @ManyToOne(()=>company, (company: company)=>company.jobss,{  nullable:false, })
    @JoinColumn({ name:'profile_id'})
    profile:company | null;


   
    @OneToMany(()=>job_applicants, (job_applicants: job_applicants)=>job_applicants.job)
    jobApplicantss:job_applicants[];
    

   
    @OneToMany(()=>job_category, (job_category: job_category)=>job_category.job)
    jobCategorys:job_category[];
    

   
    @OneToMany(()=>job_schedules, (job_schedules: job_schedules)=>job_schedules.job)
    jobScheduless:job_schedules[];
    

   
    @OneToMany(()=>job_shortlisted, (job_shortlisted: job_shortlisted)=>job_shortlisted.job)
    jobShortlisteds:job_shortlisted[];
    
}
