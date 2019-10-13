import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {django_content_type} from "./django_content_type";
import {auth_group_permissions} from "./auth_group_permissions";
import {auth_user_user_permissions} from "./auth_user_user_permissions";


@Entity("auth_permission" ,{schema:"public" } )
@Index("auth_permission_content_type_id_codename_01ab375a_uniq",["codename","contentType",],{unique:true})
@Index("auth_permission_content_type_id_2f476e4b",["contentType",])
export class auth_permission {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:255,
        name:"name"
        })
    name:string;
        

   
    @ManyToOne(()=>django_content_type, (django_content_type: django_content_type)=>django_content_type.authPermissions,{  nullable:false, })
    @JoinColumn({ name:'content_type_id'})
    contentType:django_content_type | null;


    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:100,
        name:"codename"
        })
    codename:string;
        

   
    @OneToMany(()=>auth_group_permissions, (auth_group_permissions: auth_group_permissions)=>auth_group_permissions.permission)
    authGroupPermissionss:auth_group_permissions[];
    

   
    @OneToMany(()=>auth_user_user_permissions, (auth_user_user_permissions: auth_user_user_permissions)=>auth_user_user_permissions.permission)
    authUserUserPermissionss:auth_user_user_permissions[];
    
}
