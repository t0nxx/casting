import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";


@Entity("friendship_friend" ,{schema:"public" } )
@Index("friendship_friend_from_user_id_f229f783",["fromUser",])
@Index("friendship_friend_from_user_id_to_user_id_5aa078c0_uniq",["fromUser","toUser",],{unique:true})
@Index("friendship_friend_to_user_id_0de15f5e",["toUser",])
export class friendship_friend {

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
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFriends,{  nullable:false, })
    @JoinColumn({ name:'from_user_id'})
    fromUser:auth_user | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFriends2,{  nullable:false, })
    @JoinColumn({ name:'to_user_id'})
    toUser:auth_user | null;

}
