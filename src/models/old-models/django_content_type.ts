import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_permission} from "./auth_permission";
import {django_admin_log} from "./django_admin_log";
import {notify_notification} from "./notify_notification";


@Entity("django_content_type" ,{schema:"public" } )
@Index("django_content_type_app_label_model_76bd3d3b_uniq",["app_label","model",],{unique:true})
export class django_content_type {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:100,
        name:"app_label"
        })
    app_label:string;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:100,
        name:"model"
        })
    model:string;
        

   
    @OneToMany(()=>auth_permission, (auth_permission: auth_permission)=>auth_permission.contentType)
    authPermissions:auth_permission[];
    

   
    @OneToMany(()=>django_admin_log, (django_admin_log: django_admin_log)=>django_admin_log.contentType)
    djangoAdminLogs:django_admin_log[];
    

   
    @OneToMany(()=>notify_notification, (notify_notification: notify_notification)=>notify_notification.actorContentType)
    notifyNotifications:notify_notification[];
    

   
    @OneToMany(()=>notify_notification, (notify_notification: notify_notification)=>notify_notification.objContentType)
    notifyNotifications2:notify_notification[];
    

   
    @OneToMany(()=>notify_notification, (notify_notification: notify_notification)=>notify_notification.targetContentType)
    notifyNotifications3:notify_notification[];
    
}
