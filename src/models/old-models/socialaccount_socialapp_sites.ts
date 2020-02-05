import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {socialaccount_socialapp} from "./socialaccount_socialapp";
import {django_site} from "./django_site";


@Entity("socialaccount_socialapp_sites" ,{schema:"public" } )
@Index("socialaccount_socialapp_sites_site_id_2579dee5",["site",])
@Index("socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq",["site","socialapp",],{unique:true})
@Index("socialaccount_socialapp_sites_socialapp_id_97fb6e7d",["socialapp",])
export class socialaccount_socialapp_sites {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>socialaccount_socialapp, (socialaccount_socialapp: socialaccount_socialapp)=>socialaccount_socialapp.socialaccountSocialappSitess,{  nullable:false, })
    @JoinColumn({ name:'socialapp_id'})
    socialapp:socialaccount_socialapp | null;


   
    @ManyToOne(()=>django_site, (django_site: django_site)=>django_site.socialaccountSocialappSitess,{  nullable:false, })
    @JoinColumn({ name:'site_id'})
    site:django_site | null;

}
