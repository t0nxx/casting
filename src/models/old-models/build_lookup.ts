import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {users_profile} from "./users_profile";


@Entity("build_lookup" ,{schema:"public" } )
@Index("build_lookup_name_key",["name",],{unique:true})
@Index("build_lookup_name_c2fdc3d9_like",["name",])
export class build_lookup {

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
        

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.build)
    usersProfiles:users_profile[];
    
}
