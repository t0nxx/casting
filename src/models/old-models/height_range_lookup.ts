import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("height_range_lookup" ,{schema:"public" } )
@Index("height_range_lookup_name_e023aaa9_like",["name",])
@Index("height_range_lookup_name_key",["name",],{unique:true})
export class height_range_lookup {

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
        

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.height)
    usersProfiles:users_profile[];
    
}
