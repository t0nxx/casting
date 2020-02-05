import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {talent_categories} from "./talent_categories";
import {company} from "./company";


@Entity("company_tags" ,{schema:"public" } )
@Index("company_tags_category_id_ed89aef0",["category",])
@Index("company_tags_company_id_15da15ae",["company",])
export class company_tags {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

   
    @ManyToOne(()=>talent_categories, (talent_categories: talent_categories)=>talent_categories.companyTagss,{  nullable:false, })
    @JoinColumn({ name:'category_id'})
    category:talent_categories | null;


   
    @ManyToOne(()=>company, (company: company)=>company.companyTagss,{  nullable:false, })
    @JoinColumn({ name:'company_id'})
    company:company | null;

}
