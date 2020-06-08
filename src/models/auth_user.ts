import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, Generated } from 'typeorm';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { AccountEmailaddresss } from './account_emailaddress';
import { Profile } from './users_profile';

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
