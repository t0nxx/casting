import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";


@Entity("authtoken_token" ,{schema:"public" } )
@Index("authtoken_token_key_10f0b77e_like",["key",])
@Index("authtoken_token_user_id_key",["user",],{unique:true})
export class authtoken_token {

    @Column("character varying",{ 
        nullable:false,
        primary:true,
        length:40,
        name:"key"
        })
    key:string;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"created"
        })
    created:Date;
        

   
    @OneToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.authtokenToken,{  nullable:false, })
    @JoinColumn({ name:'user_id'})
    user:auth_user | null;

}
