import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";


@Entity("friendship_follow" ,{schema:"public" } )
@Index("friendship_follow_followee_id_3348979c",["followee",])
@Index("friendship_follow_follower_id_followee_id_75264015_uniq",["followee","follower",],{unique:true})
@Index("friendship_follow_follower_id_c10685be",["follower",])
export class friendship_follow {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created"
        })
    created:Date;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFollows,{  nullable:false, })
    @JoinColumn({ name:'followee_id'})
    followee:auth_user | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFollows2,{  nullable:false, })
    @JoinColumn({ name:'follower_id'})
    follower:auth_user | null;

}
