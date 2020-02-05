import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {auth_permission} from "./auth_permission";


@Entity("auth_user_user_permissions" ,{schema:"public" } )
@Index("auth_user_user_permissions_permission_id_1fbb5f2c",["permission",])
@Index("auth_user_user_permissions_user_id_permission_id_14a6b632_uniq",["permission","user",],{unique:true})
@Index("auth_user_user_permissions_user_id_a95ead1b",["user",])
export class auth_user_user_permissions {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.authUserUserPermissionss,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;


   
    @ManyToOne(()=>auth_permission, (auth_permission: auth_permission)=>auth_permission.authUserUserPermissionss,{  nullable:false, })
    @JoinColumn({ name:'permission_id'})
    permission:auth_permission | null;

}
