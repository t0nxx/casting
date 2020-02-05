import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {socialaccount_socialapp_sites} from "./socialaccount_socialapp_sites";


@Entity("django_site" ,{schema:"public" } )
@Index("django_site_domain_a2e37b91_like",["domain",])
@Index("django_site_domain_a2e37b91_uniq",["domain",],{unique:true})
export class django_site {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:false,
        unique: true,
        length:100,
        name:"domain"
        })
    domain:string;
        

    @Column("character varying",{ 
        nullable:false,
        length:50,
        name:"name"
        })
    name:string;
        

   
    @OneToMany(()=>socialaccount_socialapp_sites, (socialaccount_socialapp_sites: socialaccount_socialapp_sites)=>socialaccount_socialapp_sites.site)
    socialaccountSocialappSitess:socialaccount_socialapp_sites[];
    
}
