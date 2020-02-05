import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("profile_social_networks" ,{schema:"public" } )
@Index("profile_social_networks_url_key",["url",],{unique:true})
@Index("profile_social_networks_url_5eb066ea_like",["url",])
@Index("profile_social_networks_user_profile_id_9a07152a",["userProfile",])
export class profile_social_networks {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"network"
        })
    network:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        unique: true,
        length:200,
        name:"url"
        })
    url:string | null;
        

   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileSocialNetworkss,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;

}
