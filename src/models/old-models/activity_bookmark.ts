import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";


@Entity("activity_bookmark" ,{schema:"public" } )
@Index("activity_bookmark_activity_id_8cab830c",["activity",])
@Index("activity_bookmark_auth_user_id_68a8ddb2",["authUser",])
export class activity_bookmark {

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
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activityBookmarks,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activityBookmarks,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;

}
