import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("profile_viewers" ,{schema:"public" } )
@Index("profile_viewers_user_profile_id_b15d1f54",["userProfile",])
@Index("profile_viewers_visitor_profile_id_e86c6562",["visitorProfile",])
export class profile_viewers {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileViewerss,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileViewerss2,{  })
    @JoinColumn({ name:'visitor_profile_id'})
    visitorProfile:users_profile | null;

}
