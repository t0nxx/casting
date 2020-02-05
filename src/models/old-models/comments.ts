import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {activity} from "./activity";
import {auth_user} from "./auth_user";
import {comment_mention} from "./comment_mention";


@Entity("comments" ,{schema:"public" } )
@Index("comments_activity_id_bc3e877f",["activity",])
@Index("comments_auth_user_id_e9f0858b",["authUser",])
@Index("comments_thread_id_8f492724",["thread",])
export class comments {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:false,
        name:"comment"
        })
    comment:string;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"publish_date"
        })
    publish_date:Date;
        

   
    @ManyToOne(()=>activity, (activity: activity)=>activity.commentss,{  nullable:false, })
    @JoinColumn({ name:'activity_id'})
    activity:activity | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.commentss,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;


   
    @ManyToOne(()=>comments, (comments: comments)=>comments.commentss,{  })
    @JoinColumn({ name:'thread_id'})
    thread:comments | null;


   
    @OneToMany(()=>comment_mention, (comment_mention: comment_mention)=>comment_mention.comment)
    commentMentions:comment_mention[];
    

   
    @OneToMany(()=>comments, (comments: comments)=>comments.thread)
    commentss:comments[];
    
}
