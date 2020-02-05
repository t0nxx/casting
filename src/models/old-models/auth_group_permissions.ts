import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_group} from "./auth_group";
import {auth_permission} from "./auth_permission";


@Entity("auth_group_permissions" ,{schema:"public" } )
@Index("auth_group_permissions_group_id_b120cbf9",["group",])
@Index("auth_group_permissions_group_id_permission_id_0cd325b0_uniq",["group","permission",],{unique:true})
@Index("auth_group_permissions_permission_id_84c5c92e",["permission",])
export class auth_group_permissions {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>auth_group, (auth_group: auth_group)=>auth_group.authGroupPermissionss,{  nullable:false, })
    @JoinColumn({ name:'group_id'})
    group:auth_group | null;


   
    @ManyToOne(()=>auth_permission, (auth_permission: auth_permission)=>auth_permission.authGroupPermissionss,{  nullable:false, })
    @JoinColumn({ name:'permission_id'})
    permission:auth_permission | null;

}
