import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {company} from "./company";
import {activity_attachment} from "./activity_attachment";
import {activity_bookmark} from "./activity_bookmark";
import {activity_control} from "./activity_control";
import {activity_ignore} from "./activity_ignore";
import {activity_mention} from "./activity_mention";
import {activity_report} from "./activity_report";
import {activity_social_actions} from "./activity_social_actions";
import {comments} from "./comments";


@Entity("activity" ,{schema:"public" } )
@Index("activity_auth_user_id_faff7f0e",["authUser",])
@Index("activity_company_id_484a766d",["company",])
@Index("activity_original_activity_974d22b8",["originalActivity",])
export class activity {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:true,
        name:"content"
        })
    content:string | null;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"publish_date"
        })
    publish_date:Date;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_blocked"
        })
    is_blocked:boolean;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"action"
        })
    action:string | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_active"
        })
    is_active:boolean;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.activitys,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;


   
    @ManyToOne(()=>company, (company: company)=>company.activitys,{  })
    @JoinColumn({ name:'company_id'})
    company:company | null;


   
    @ManyToOne(()=>activity, (activity: activity)=>activity.activitys,{  })
    @JoinColumn({ name:'original_activity'})
    originalActivity:activity | null;


   
    @OneToMany(()=>activity, (activity: activity)=>activity.originalActivity)
    activitys:activity[];
    

   
    @OneToMany(()=>activity_attachment, (activity_attachment: activity_attachment)=>activity_attachment.activity)
    activityAttachments:activity_attachment[];
    

   
    @OneToMany(()=>activity_bookmark, (activity_bookmark: activity_bookmark)=>activity_bookmark.activity)
    activityBookmarks:activity_bookmark[];
    

   
    @OneToMany(()=>activity_control, (activity_control: activity_control)=>activity_control.activity)
    activityControls:activity_control[];
    

   
    @OneToMany(()=>activity_ignore, (activity_ignore: activity_ignore)=>activity_ignore.activity)
    activityIgnores:activity_ignore[];
    

   
    @OneToMany(()=>activity_mention, (activity_mention: activity_mention)=>activity_mention.activity)
    activityMentions:activity_mention[];
    

   
    @OneToMany(()=>activity_report, (activity_report: activity_report)=>activity_report.activity)
    activityReports:activity_report[];
    

   
    @OneToMany(()=>activity_social_actions, (activity_social_actions: activity_social_actions)=>activity_social_actions.activity)
    activitySocialActionss:activity_social_actions[];
    

   
    @OneToMany(()=>comments, (comments: comments)=>comments.activity)
    commentss:comments[];
    
}
