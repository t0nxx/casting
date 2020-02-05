import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {socialaccount_socialapp_sites} from "./socialaccount_socialapp_sites";
import {socialaccount_socialtoken} from "./socialaccount_socialtoken";


@Entity("socialaccount_socialapp" ,{schema:"public" } )
export class socialaccount_socialapp {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        length:30,
        name:"provider"
        })
    provider:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:40,
        name:"name"
        })
    name:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:191,
        name:"client_id"
        })
    client_id:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:191,
        name:"secret"
        })
    secret:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:191,
        name:"key"
        })
    key:string;
        

   
    @OneToMany(()=>socialaccount_socialapp_sites, (socialaccount_socialapp_sites: socialaccount_socialapp_sites)=>socialaccount_socialapp_sites.socialapp)
    socialaccountSocialappSitess:socialaccount_socialapp_sites[];
    

   
    @OneToMany(()=>socialaccount_socialtoken, (socialaccount_socialtoken: socialaccount_socialtoken)=>socialaccount_socialtoken.app)
    socialaccountSocialtokens:socialaccount_socialtoken[];
    
}
