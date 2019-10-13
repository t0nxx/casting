import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("profile_settings" ,{schema:"public" } )
@Index("profile_settings_user_profile_id_1e134e75",["userProfile",])
export class profile_settings {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_see_profile"
        })
    can_see_profile:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_see_wall"
        })
    can_see_wall:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_comment"
        })
    can_comment:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_contact_info"
        })
    can_contact_info:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_send_message"
        })
    can_send_message:string | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"response_all_time"
        })
    response_all_time:boolean;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"response_from"
        })
    response_from:Date | null;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"response_to"
        })
    response_to:Date | null;
        

    @Column("text",{ 
        nullable:true,
        name:"response_message"
        })
    response_message:string | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"auto_play_video"
        })
    auto_play_video:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"jobs_notification"
        })
    jobs_notification:boolean;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileSettingss,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;


    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"can_see_friends"
        })
    can_see_friends:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"my_status"
        })
    my_status:string | null;
        
}
