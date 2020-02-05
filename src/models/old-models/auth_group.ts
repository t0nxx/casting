import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_group_permissions} from "./auth_group_permissions";
import {auth_user_groups} from "./auth_user_groups";


@Entity("auth_group" ,{schema:"public" } )
@Index("auth_group_name_a6ea08ec_like",["name",])
@Index("auth_group_name_key",["name",],{unique:true})
export class auth_group {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:80,
        name:"name"
        })
    name:string;
        

   
    @OneToMany(()=>auth_group_permissions, (auth_group_permissions: auth_group_permissions)=>auth_group_permissions.group)
    authGroupPermissionss:auth_group_permissions[];
    

   
    @OneToMany(()=>auth_user_groups, (auth_user_groups: auth_user_groups)=>auth_user_groups.group)
    authUserGroupss:auth_user_groups[];
    
}
