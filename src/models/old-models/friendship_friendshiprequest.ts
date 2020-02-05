import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";


@Entity("friendship_friendshiprequest" ,{schema:"public" } )
@Index("friendship_friendshiprequest_from_user_id_bbaf16e8",["fromUser",])
@Index("friendship_friendshipreq_from_user_id_to_user_id_003053a1_uniq",["fromUser","toUser",],{unique:true})
@Index("friendship_friendshiprequest_to_user_id_51d5a5a2",["toUser",])
export class friendship_friendshiprequest {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:false,
        name:"message"
        })
    message:string;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created"
        })
    created:Date;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"rejected"
        })
    rejected:Date | null;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"viewed"
        })
    viewed:Date | null;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFriendshiprequests,{  nullable:false, })
    @JoinColumn({ name:'from_user_id'})
    fromUser:auth_user | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipFriendshiprequests2,{  nullable:false, })
    @JoinColumn({ name:'to_user_id'})
    toUser:auth_user | null;

}
