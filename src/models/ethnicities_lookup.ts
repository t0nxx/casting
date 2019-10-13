import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("ethnicities_lookup" ,{schema:"public" } )
@Index("ethnicities_lookup_name_key",["name",],{unique:true})
@Index("ethnicities_lookup_name_69edbb64_like",["name",])
export class ethnicities_lookup {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        unique: true,
        length:150,
        name:"name"
        })
    name:string | null;
        

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.ethnicity)
    usersProfiles:users_profile[];
    
}
