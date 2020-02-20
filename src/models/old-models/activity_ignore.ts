import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";


@Entity("activity_ignore" ,{schema:"public" } )
@Index("activity_ignore_activity_id_d32ade49",["activity",])
@Index("activity_ignore_auth_user_id_0d52f505",["authUser",])
export class activity_ignore {

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
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activityIgnores,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activityIgnores,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;

}