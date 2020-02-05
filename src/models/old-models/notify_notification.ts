import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {django_content_type} from "./django_content_type";
import {auth_user} from "./auth_user";


@Entity("notify_notification" ,{schema:"public" } )
@Index("notify_notification_actor_content_type_id_1a428036",["actorContentType",])
@Index("notify_notification_obj_content_type_id_93f677d5",["objContentType",])
@Index("notify_notification_recipient_id_07222ca5",["recipient",])
@Index("notify_notification_target_content_type_id_55b5712a",["targetContentType",])
export class notify_notification {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("integer",{ 
        nullable:true,
        name:"actor_object_id"
        })
    actor_object_id:number | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"actor_text"
        })
    actor_text:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:200,
        name:"actor_url_text"
        })
    actor_url_text:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:50,
        name:"verb"
        })
    verb:string;
        

    @Column("character varying",{ 
        nullable:true,
        length:255,
        name:"description"
        })
    description:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:20,
        name:"nf_type"
        })
    nf_type:string;
        

    @Column("integer",{ 
        nullable:true,
        name:"target_object_id"
        })
    target_object_id:number | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"target_text"
        })
    target_text:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:200,
        name:"target_url_text"
        })
    target_url_text:string | null;
        

    @Column("integer",{ 
        nullable:true,
        name:"obj_object_id"
        })
    obj_object_id:number | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"obj_text"
        })
    obj_text:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:200,
        name:"obj_url_text"
        })
    obj_url_text:string | null;
        

    @Column("jsonb",{ 
        nullable:true,
        name:"extra"
        })
    extra:object | null;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created"
        })
    created:Date;
        

    @Column("boolean",{ 
        nullable:false,
        name:"read"
        })
    read:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"deleted"
        })
    deleted:boolean;
        

   
    @ManyToOne(()=>django_content_type, (django_content_type: django_content_type)=>django_content_type.notifyNotifications,{  })
    @JoinColumn({ name:'actor_content_type_id'})
    actorContentType:django_content_type | null;


   
    @ManyToOne(()=>django_content_type, (django_content_type: django_content_type)=>django_content_type.notifyNotifications2,{  })
    @JoinColumn({ name:'obj_content_type_id'})
    objContentType:django_content_type | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.notifyNotifications,{  nullable:false, })
    @JoinColumn({ name:'recipient_id'})
    recipient:auth_user | null;


   
    @ManyToOne(()=>django_content_type, (django_content_type: django_content_type)=>django_content_type.notifyNotifications3,{  })
    @JoinColumn({ name:'target_content_type_id'})
    targetContentType:django_content_type | null;

}
