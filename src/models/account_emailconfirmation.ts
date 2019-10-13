import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {account_emailaddress} from "./account_emailaddress";


@Entity("account_emailconfirmation" ,{schema:"public" } )
@Index("account_emailconfirmation_email_address_id_5b7f8c58",["emailAddress",])
@Index("account_emailconfirmation_key_f43612bd_like",["key",])
@Index("account_emailconfirmation_key_key",["key",],{unique:true})
export class account_emailconfirmation {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created"
        })
    created:Date;
        

    @Column("timestamp with time zone",{ 
        nullable:true,
        name:"sent"
        })
    sent:Date | null;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:64,
        name:"key"
        })
    key:string;
        

   
    @ManyToOne(()=>account_emailaddress, (account_emailaddress: account_emailaddress)=>account_emailaddress.accountEmailconfirmations,{  nullable:false, })
    @JoinColumn({ name:'email_address_id'})
    emailAddress:account_emailaddress | null;

}
