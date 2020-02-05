import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";


@Entity("activity_mention" ,{schema:"public" } )
@Index("activity_mention_activity_id_09aff1a4",["activity",])
@Index("activity_mention_auth_user_id_3cad07ba",["authUser",])
export class activity_mention {

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
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activityMentions,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activityMentions,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;

}
