import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("profile_training" ,{schema:"public" } )
@Index("profile_training_course_name_institute_us_33bccca1_uniq",["course_name","institute","userProfile",],{unique:true})
@Index("profile_training_user_profile_id_9393669f",["userProfile",])
export class profile_training {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"course_name"
        })
    course_name:string;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"institute"
        })
    institute:string;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileTrainings,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;

}
