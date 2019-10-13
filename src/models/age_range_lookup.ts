import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("age_range_lookup" ,{schema:"public" } )
@Index("age_range_lookup_name_key",["name",],{unique:true})
@Index("age_range_lookup_name_999887a7_like",["name",])
export class age_range_lookup {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        unique: true,
        length:50,
        name:"name"
        })
    name:string | null;
        
}
