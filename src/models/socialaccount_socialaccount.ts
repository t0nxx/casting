import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {socialaccount_socialtoken} from "./socialaccount_socialtoken";


@Entity("socialaccount_socialaccount" ,{schema:"public" } )
@Index("socialaccount_socialaccount_provider_uid_fc810c6e_uniq",["provider","uid",],{unique:true})
@Index("socialaccount_socialaccount_user_id_8146e70c",["user",])
export class socialaccount_socialaccount {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:30,
        name:"provider"
        })
    provider:string;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:191,
        name:"uid"
        })
    uid:string;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"last_login"
        })
    last_login:Date;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"date_joined"
        })
    date_joined:Date;
        

    @Column("text",{ 
        nullable:false,
        name:"extra_data"
        })
    extra_data:string;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.socialaccountSocialaccounts,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;


   
    @OneToMany(()=>socialaccount_socialtoken, (socialaccount_socialtoken: socialaccount_socialtoken)=>socialaccount_socialtoken.account)
    socialaccountSocialtokens:socialaccount_socialtoken[];
    
}
