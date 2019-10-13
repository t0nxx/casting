import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {jobs} from "./jobs";
import {talent_categories} from "./talent_categories";


@Entity("job_category" ,{schema:"public" } )
@Index("job_category_job_category_id_2c9511f0",["jobCategory",])
@Index("job_category_job_id_09117672",["job",])
export class job_category {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>jobs, (jobs: jobs)=>jobs.jobCategorys,{  nullable:false, })
    @JoinColumn({ name:'job_id'})
    job:jobs | null;


   
    @ManyToOne(()=>talent_categories, (talent_categories: talent_categories)=>talent_categories.jobCategorys,{  nullable:false, })
    @JoinColumn({ name:'job_category_id'})
    jobCategory:talent_categories | null;

}
