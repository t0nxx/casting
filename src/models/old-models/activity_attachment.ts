import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {profile_album} from "./profile_album";
import {auth_user} from "./auth_user";


@Entity("activity_attachment" ,{schema:"public" } )
@Index("activity_attachment_activity_id_306ddcd5",["activity",])
@Index("activity_attachment_album_id_66267b17",["album",])
@Index("activity_attachment_auth_user_id_7433c68f",["authUser",])
export class activity_attachment {

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
        

    @Column("text",{ 
        nullable:true,
        name:"path"
        })
    path:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:25,
        name:"type"
        })
    type:string;
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activityAttachments,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>profile_album, (profile_album: profile_album)=>profile_album.activityAttachments,{  })
    @JoinColumn({ name:'album_id'})
    album:profile_album | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activityAttachments,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;


    @Column("character varying",{ 
        nullable:false,
        length:150,
        name:"path_json"
        })
    path_json:string;
        
}
