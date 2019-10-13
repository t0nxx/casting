import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {django_content_type} from "./django_content_type";
import {auth_user} from "./auth_user";


@Entity("django_admin_log" ,{schema:"public" } )
@Index("django_admin_log_content_type_id_c4bce8eb",["contentType",])
@Index("django_admin_log_user_id_c564eba6",["user",])
export class django_admin_log {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"action_time"
        })
    action_time:Date;
        

    @Column("text",{ 
        nullable:true,
        name:"object_id"
        })
    object_id:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:200,
        name:"object_repr"
        })
    object_repr:string;
        

    @Column("smallint",{ 
        nullable:false,
        name:"action_flag"
        })
    action_flag:number;
        

    @Column("text",{ 
        nullable:false,
        name:"change_message"
        })
    change_message:string;
        

   
    @ManyToOne(()=>django_content_type, (django_content_type: django_content_type)=>django_content_type.djangoAdminLogs,{  })
    @JoinColumn({ name:'content_type_id'})
    contentType:django_content_type | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.djangoAdminLogs,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;

}
