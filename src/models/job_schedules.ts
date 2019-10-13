import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {jobs} from "./jobs";
import {users_profile} from "./users_profile";


@Entity("job_schedules" ,{schema:"public" } )
@Index("job_schedules_job_id_ae94439b",["job",])
@Index("job_schedules_profile_id_d8c11172",["profile",])
export class job_schedules {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created_date"
        })
    created_date:Date;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"interview_date"
        })
    interview_date:Date;
        

    @Column("character varying",{ 
        nullable:false,
        length:150,
        name:"interviewer"
        })
    interviewer:string;
        

    @Column("text",{ 
        nullable:false,
        name:"location"
        })
    location:string;
        

   
    @ManyToOne(()=>jobs, (jobs: jobs)=>jobs.jobScheduless,{  nullable:false, })
    @JoinColumn({ name:'job_id'})
    job:jobs | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.jobScheduless,{  nullable:false, })
    @JoinColumn({ name:'profile_id'})
    profile:users_profile | null;

}
