import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {account_emailaddress} from "./account_emailaddress";
import {activity} from "./activity";
import {activity_attachment} from "./activity_attachment";
import {activity_bookmark} from "./activity_bookmark";
import {activity_control} from "./activity_control";
import {activity_ignore} from "./activity_ignore";
import {activity_mention} from "./activity_mention";
import {activity_report} from "./activity_report";
import {activity_social_actions} from "./activity_social_actions";
import {auth_user_groups} from "./auth_user_groups";
import {auth_user_user_permissions} from "./auth_user_user_permissions";
import {authtoken_token} from "./authtoken_token";
import {comment_mention} from "./comment_mention";
import {comments} from "./comments";
import {django_admin_log} from "./django_admin_log";
import {friendship_block} from "./friendship_block";
import {friendship_follow} from "./friendship_follow";
import {friendship_friend} from "./friendship_friend";
import {friendship_friendshiprequest} from "./friendship_friendshiprequest";
import {notify_notification} from "./notify_notification";
import {socialaccount_socialaccount} from "./socialaccount_socialaccount";
import {users_profile} from "./users_profile";


@Entity("auth_user" ,{schema:"public" } )
@Index("auth_user_username_6821ab7c_like",["username",])
@Index("auth_user_username_key",["username",],{unique:true})
export class auth_user {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:128,
        name:"password"
        })
    password:string;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"last_login"
        })
    last_login:Date | null;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_superuser"
        })
    is_superuser:boolean;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:150,
        name:"username"
        })
    username:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:30,
        name:"first_name"
        })
    first_name:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:150,
        name:"last_name"
        })
    last_name:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:254,
        name:"email"
        })
    email:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_staff"
        })
    is_staff:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"is_active"
        })
    is_active:boolean;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"date_joined"
        })
    date_joined:Date;
        

   
    @OneToMany(()=>account_emailaddress, (account_emailaddress: account_emailaddress)=>account_emailaddress.user)
    accountEmailaddresss:account_emailaddress[];
    

   
    @OneToMany(()=>activity, (activity: activity)=>activity.authUser)
    activitys:activity[];
    

   
    @OneToMany(()=>activity_attachment, (activity_attachment: activity_attachment)=>activity_attachment.authUser)
    activityAttachments:activity_attachment[];
    

   
    @OneToMany(()=>activity_bookmark, (activity_bookmark: activity_bookmark)=>activity_bookmark.authUser)
    activityBookmarks:activity_bookmark[];
    

   
    @OneToMany(()=>activity_control, (activity_control: activity_control)=>activity_control.authUser)
    activityControls:activity_control[];
    

   
    @OneToMany(()=>activity_ignore, (activity_ignore: activity_ignore)=>activity_ignore.authUser)
    activityIgnores:activity_ignore[];
    

   
    @OneToMany(()=>activity_mention, (activity_mention: activity_mention)=>activity_mention.authUser)
    activityMentions:activity_mention[];
    

   
    @OneToMany(()=>activity_report, (activity_report: activity_report)=>activity_report.authUser)
    activityReports:activity_report[];
    

   
    @OneToMany(()=>activity_social_actions, (activity_social_actions: activity_social_actions)=>activity_social_actions.authUser)
    activitySocialActionss:activity_social_actions[];
    

   
    @OneToMany(()=>auth_user_groups, (auth_user_groups: auth_user_groups)=>auth_user_groups.user)
    authUserGroupss:auth_user_groups[];
    

   
    @OneToMany(()=>auth_user_user_permissions, (auth_user_user_permissions: auth_user_user_permissions)=>auth_user_user_permissions.user)
    authUserUserPermissionss:auth_user_user_permissions[];
    

   
    @OneToOne(()=>authtoken_token, (authtoken_token: authtoken_token)=>authtoken_token.user)
    authtokenToken:authtoken_token | null;


   
    @OneToMany(()=>comment_mention, (comment_mention: comment_mention)=>comment_mention.authUser)
    commentMentions:comment_mention[];
    

   
    @OneToMany(()=>comments, (comments: comments)=>comments.authUser)
    commentss:comments[];
    

   
    @OneToMany(()=>django_admin_log, (django_admin_log: django_admin_log)=>django_admin_log.user)
    djangoAdminLogs:django_admin_log[];
    

   
    @OneToMany(()=>friendship_block, (friendship_block: friendship_block)=>friendship_block.blocked)
    friendshipBlocks:friendship_block[];
    

   
    @OneToMany(()=>friendship_block, (friendship_block: friendship_block)=>friendship_block.blocker)
    friendshipBlocks2:friendship_block[];
    

   
    @OneToMany(()=>friendship_follow, (friendship_follow: friendship_follow)=>friendship_follow.followee)
    friendshipFollows:friendship_follow[];
    

   
    @OneToMany(()=>friendship_follow, (friendship_follow: friendship_follow)=>friendship_follow.follower)
    friendshipFollows2:friendship_follow[];
    

   
    @OneToMany(()=>friendship_friend, (friendship_friend: friendship_friend)=>friendship_friend.fromUser)
    friendshipFriends:friendship_friend[];
    

   
    @OneToMany(()=>friendship_friend, (friendship_friend: friendship_friend)=>friendship_friend.toUser)
    friendshipFriends2:friendship_friend[];
    

   
    @OneToMany(()=>friendship_friendshiprequest, (friendship_friendshiprequest: friendship_friendshiprequest)=>friendship_friendshiprequest.fromUser)
    friendshipFriendshiprequests:friendship_friendshiprequest[];
    

   
    @OneToMany(()=>friendship_friendshiprequest, (friendship_friendshiprequest: friendship_friendshiprequest)=>friendship_friendshiprequest.toUser)
    friendshipFriendshiprequests2:friendship_friendshiprequest[];
    

   
    @OneToMany(()=>notify_notification, (notify_notification: notify_notification)=>notify_notification.recipient)
    notifyNotifications:notify_notification[];
    

   
    @OneToMany(()=>socialaccount_socialaccount, (socialaccount_socialaccount: socialaccount_socialaccount)=>socialaccount_socialaccount.user)
    socialaccountSocialaccounts:socialaccount_socialaccount[];
    

   
    @OneToMany(()=>users_profile, (users_profile: users_profile)=>users_profile.authUser)
    usersProfiles:users_profile[];
    
}
