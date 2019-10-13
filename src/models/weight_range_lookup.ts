import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("weight_range_lookup" ,{schema:"public" } )
@Index("weight_range_lookup_name_key",["name",],{unique:true})
@Index("weight_range_lookup_name_5712ab5e_like",["name",])
export class weight_range_lookup {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        unique: true,
        length:50,
        name:"name"
        })
    name:string | null;
        

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.weight)
    usersProfiles:users_profile[];
    
}
