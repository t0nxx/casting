import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("hair_lookup" ,{schema:"public" } )
@Index("hair_lookup_name_key",["name",],{unique:true})
@Index("hair_lookup_name_065f4ae1_like",["name",])
export class hair_lookup {

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
        

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.hair)
    usersProfiles:users_profile[];
    
}
