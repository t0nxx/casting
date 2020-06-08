import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, Generated } from 'typeorm';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { AccountEmailaddresss } from './account_emailaddress';
import { Profile } from './users_profile';
// import {account_emailaddress} from "./account_emailaddress";
// import {activity} from "./activity";
// import {activity_attachment} from "./activity_attachment";
// import {activity_bookmark} from "./activity_bookmark";
// import {activity_control} from "./activity_control";
// import {activity_ignore} from "./activity_ignore";
// import {activity_mention} from "./activity_mention";
// import {activity_report} from "./activity_report";
// import {activity_social_actions} from "./activity_social_actions";
// import {auth_user_groups} from "./auth_user_groups";
// import {auth_user_user_permissions} from "./auth_user_user_permissions";
// import {authtoken_token} from "./authtoken_token";
// import {comment_mention} from "./comment_mention";
// import {comments} from "./comments";
// import {django_admin_log} from "./django_admin_log";
// import {friendship_block} from "./friendship_block";
// import {friendship_follow} from "./friendship_follow";
// import {friendship_friend} from "./friendship_friend";
// import {friendship_friendshiprequest} from "./friendship_friendshiprequest";
// import {notify_notification} from "./notify_notification";
// import {socialaccount_socialaccount} from "./socialaccount_socialaccount";
// import {users_profile} from "./users_profile";


@Entity('auth_user')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: 'user name is required' })
    @Column({ nullable: false, unique: true })
    username: string;

    @IsNotEmpty({ message: 'first name is required' })
    @Column({ nullable: false })
    first_name: string;

    @IsNotEmpty({ message: 'last name is required' })
    @Column({ nullable: false })
    last_name: string;

    @IsNotEmpty({ message: 'email is required' })
    @IsEmail()
    @Column({ nullable: false })
    email: string;


    @Column({ nullable: false })
    password: string;

    /**
     * password1 and password2 just for registration , the only saved to db is password
     */
    @IsNotEmpty({ message: 'password1 is required' })
    password1: string;

    @IsNotEmpty({ message: 'password2 is required' })
    password2: string;

    @Column('longtext')
    about: string;

    @Column({ default: 'noResetPass' })
    resetPassCode: string;

    @Column()
    @Generated('uuid')
    activationCode: string;

    @Column({ default: false })
    isAdmin: boolean;


    @Column({ default: false })
    is_active: boolean;

    @Column({ default: null })
    social_site: string;

    @Column({ default: null })
    social_site_id: string;


    @CreateDateColumn()
    date_joined: Date;


    @OneToMany(() => AccountEmailaddresss, account => account.user, { onDelete: 'CASCADE' })
    accountEmailaddresss: AccountEmailaddresss[];

    @OneToMany(type => Profile, profile => profile.user, { onDelete: 'CASCADE' })
    profiles: Profile[];

}
