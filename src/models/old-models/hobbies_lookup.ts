import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {profile_hobbies} from "./profile_hobbies";


@Entity("hobbies_lookup" ,{schema:"public" } )
@Index("hobbies_lookup_name_key",["name",],{unique:true})
@Index("hobbies_lookup_name_e285085a_like",["name",])
export class hobbies_lookup {

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
        

   
    @OneToMany(()=>profile_hobbies, (profile_hobbies: profile_hobbies)=>profile_hobbies.hobbies)
    profileHobbiess:profile_hobbies[];
    
}
