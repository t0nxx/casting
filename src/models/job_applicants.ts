import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {jobs} from "./jobs";
import {users_profile} from "./users_profile";


@Entity("job_applicants" ,{schema:"public" } )
@Index("job_applicants_job_id_57dc0d3b",["job",])
@Index("job_applicants_profile_id_4c5e1a1f",["profile",])
export class job_applicants {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"applied_date"
        })
    applied_date:Date;
        

   
    @ManyToOne(()=>jobs, (jobs: jobs)=>jobs.jobApplicantss,{  nullable:false, })
    @JoinColumn({ name:'job_id'})
    job:jobs | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.jobApplicantss,{  nullable:false, })
    @JoinColumn({ name:'profile_id'})
    profile:users_profile | null;

}
