import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {account_emailconfirmation} from "./account_emailconfirmation";


@Entity("account_emailaddress" ,{schema:"public" } )
@Index("account_emailaddress_email_key",["email",],{unique:true})
@Index("account_emailaddress_email_03be32b2_like",["email",])
@Index("account_emailaddress_user_id_2c513194",["user",])
export class account_emailaddress {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:254,
        name:"email"
        })
    email:string;
        

    @Column("boolean",{ 
        nullable:false,
        name:"verified"
        })
    verified:boolean;
        

    @Column("boolean",{ 
        nullable:false,
        name:"primary"
        })
    primary:boolean;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.accountEmailaddresss,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;


   
    @OneToMany(()=>account_emailconfirmation, (account_emailconfirmation: account_emailconfirmation)=>account_emailconfirmation.emailAddress)
    accountEmailconfirmations:account_emailconfirmation[];
    
}
