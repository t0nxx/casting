import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";


@Entity("activity_control" ,{schema:"public" } )
@Index("activity_control_activity_id_f7720356",["activity",])
@Index("activity_control_auth_user_id_151efd70",["authUser",])
export class activity_control {

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
        name:"is_hidden"
        })
    is_hidden:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_saved"
        })
    is_saved:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_reported"
        })
    is_reported:boolean;
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activityControls,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activityControls,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;

}
