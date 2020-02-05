import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";


@Entity("activity_social_actions" ,{schema:"public" } )
@Index("activity_social_actions_activity_id_7cae677a",["activity",])
@Index("activity_social_actions_auth_user_id_9430483a",["authUser",])
@Index("activity_social_actions_has_dislike_eef4969f",["has_dislike",])
@Index("activity_social_actions_has_like_464c110b",["has_like",])
@Index("activity_social_actions_has_share_2006f986",["has_share",])
export class activity_social_actions {

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
        

    @Column("boolean",{ 
        nullable:false,
        name:"has_like"
        })
    has_like:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"has_dislike"
        })
    has_dislike:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"has_share"
        })
    has_share:boolean;
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activitySocialActionss,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activitySocialActionss,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;

}
