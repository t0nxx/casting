import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {socialaccount_socialaccount} from "./socialaccount_socialaccount";
import {socialaccount_socialapp} from "./socialaccount_socialapp";


@Entity("socialaccount_socialtoken" ,{schema:"public" } )
@Index("socialaccount_socialtoken_account_id_951f210e",["account",])
@Index("socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq",["account","app",],{unique:true})
@Index("socialaccount_socialtoken_app_id_636a42d7",["app",])
export class socialaccount_socialtoken {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("text",{ 
        nullable:false,
        name:"token"
        })
    token:string;
        

    @Column("text",{ 
        nullable:false,
        name:"token_secret"
        })
    token_secret:string;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"expires_at"
        })
    expires_at:Date | null;
        

   
    @ManyToOne(()=>socialaccount_socialaccount, (socialaccount_socialaccount: socialaccount_socialaccount)=>socialaccount_socialaccount.socialaccountSocialtokens,{  nullable:false, })
    @JoinColumn({ name:'account_id'})
    account:socialaccount_socialaccount | null;


   
    @ManyToOne(()=>socialaccount_socialapp, (socialaccount_socialapp: socialaccount_socialapp)=>socialaccount_socialapp.socialaccountSocialtokens,{  nullable:false, })
    @JoinColumn({ name:'app_id'})
    app:socialaccount_socialapp | null;

}
