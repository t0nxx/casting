import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {auth_group} from "./auth_group";


@Entity("auth_user_groups" ,{schema:"public" } )
@Index("auth_user_groups_group_id_97559544",["group",])
@Index("auth_user_groups_user_id_group_id_94350c0c_uniq",["group","user",],{unique:true})
@Index("auth_user_groups_user_id_6a12ed8b",["user",])
export class auth_user_groups {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.authUserGroupss,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;


   
    @ManyToOne(()=>auth_group, (auth_group: auth_group)=>auth_group.authUserGroupss,{  nullable:false, })
    @JoinColumn({ name:'group_id'})
    group:auth_group | null;

}
