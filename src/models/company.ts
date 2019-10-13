import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";
import {activity} from "./activity";
import {company_tags} from "./company_tags";
import {jobs} from "./jobs";


@Entity("company" ,{schema:"public" } )
@Index("company_profile_id_8cfef0e4",["profile",])
@Index("company_slug_b6928c11_like",["slug",])
@Index("company_slug_b6928c11",["slug",])
export class company {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"avatar"
        })
    avatar:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"cover"
        })
    cover:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:150,
        name:"name"
        })
    name:string;
        

    @Column("text",{ 
        nullable:true,
        name:"about"
        })
    about:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"headquarter"
        })
    headquarter:string | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_address_public"
        })
    is_address_public:boolean;
        

    @Column("character varying",{ 
        nullable:true,
        length:200,
        name:"website"
        })
    website:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"since"
        })
    since:string | null;
        

    @Column("integer",{ 
        nullable:true,
        name:"size_from"
        })
    size_from:number | null;
        

    @Column("integer",{ 
        nullable:true,
        name:"size_to"
        })
    size_to:number | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:50,
        name:"slug"
        })
    slug:string;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.companys,{  nullable:false, })
    @JoinColumn({ name:'profile_id'})
    profile:users_profile | null;


   
    @OneToMany(()=>activity, (activity: activity)=>activity.company)
    activitys:activity[];
    

   
    @OneToMany(()=>company_tags, (company_tags: company_tags)=>company_tags.company)
    companyTagss:company_tags[];
    

   
    @OneToMany(()=>jobs, (jobs: jobs)=>jobs.profile)
    jobss:jobs[];
    
}
