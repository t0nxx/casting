import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {comments} from "./comments";


@Entity("comment_mention" ,{schema:"public" } )
@Index("comment_mention_auth_user_id_35c6200a",["authUser",])
@Index("comment_mention_comment_id_34094d5b",["comment",])
export class comment_mention {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"publish_date"
        })
    publish_date:Date;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.commentMentions,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;


   
    @ManyToOne(()=>comments, (comments: comments)=>comments.commentMentions,{  nullable:false, })
    @JoinColumn({ name:'comment_id'})
    comment:comments | null;

}
