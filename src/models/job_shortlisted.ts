import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {jobs} from "./jobs";
import {users_profile} from "./users_profile";


@Entity("job_shortlisted" ,{schema:"public" } )
@Index("job_shortlisted_job_id_b51d05f1",["job",])
@Index("job_shortlisted_profile_id_50ec5dd8",["profile",])
export class job_shortlisted {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"shortlisted_date"
        })
    shortlisted_date:Date;
        

   
    @ManyToOne(()=>jobs, (jobs: jobs)=>jobs.jobShortlisteds,{  nullable:false, })
    @JoinColumn({ name:'job_id'})
    job:jobs | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.jobShortlisteds,{  nullable:false, })
    @JoinColumn({ name:'profile_id'})
    profile:users_profile | null;

}
