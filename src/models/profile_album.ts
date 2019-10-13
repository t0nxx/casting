import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";
import {activity_attachment} from "./activity_attachment";


@Entity("profile_album" ,{schema:"public" } )
@Index("profile_album_album_name_user_profile_id_0d8a9ffa_uniq",["album_name","userProfile",],{unique:true})
@Index("profile_album_user_profile_id_3fd4bbd4",["userProfile",])
export class profile_album {

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
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"album_name"
        })
    album_name:string;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileAlbums,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;


   
    @OneToMany(()=>activity_attachment, (activity_attachment: activity_attachment)=>activity_attachment.album)
    activityAttachments:activity_attachment[];
    
}
