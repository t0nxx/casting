import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {hobbies_lookup} from "./hobbies_lookup";
import {users_profile} from "./users_profile";


@Entity("profile_hobbies" ,{schema:"public" } )
@Index("profile_hobbies_hobbies_id_de4701d1",["hobbies",])
@Index("profile_hobbies_hobbies_id_user_profile_id_5fdc62bc_uniq",["hobbies","userProfile",],{unique:true})
@Index("profile_hobbies_user_profile_id_350bdd29",["userProfile",])
export class profile_hobbies {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>hobbies_lookup, (hobbies_lookup: hobbies_lookup)=>hobbies_lookup.profileHobbiess,{  nullable:false, })
    @JoinColumn({ name:'hobbies_id'})
    hobbies:hobbies_lookup | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.profileHobbiess,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;

}
