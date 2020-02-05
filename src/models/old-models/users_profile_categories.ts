import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {talent_categories} from "./talent_categories";
import {users_profile} from "./users_profile";


@Entity("users_profile_categories" ,{schema:"public" } )
@Index("users_profile_categories_talent_category_id_09579968",["talentCategory",])
@Index("users_profile_categories_user_profile_id_talent_c_4de59dba_uniq",["talentCategory","userProfile",],{unique:true})
@Index("users_profile_categories_user_profile_id_d914a4d0",["userProfile",])
export class users_profile_categories {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>talent_categories, (talent_categories: talent_categories)=>talent_categories.usersProfileCategoriess,{  nullable:false, })
    @JoinColumn({ name:'talent_category_id'})
    talentCategory:talent_categories | null;


   
    @ManyToOne(()=>users_profile, (users_profile: users_profile)=>users_profile.usersProfileCategoriess,{  nullable:false, })
    @JoinColumn({ name:'user_profile_id'})
    userProfile:users_profile | null;

}
