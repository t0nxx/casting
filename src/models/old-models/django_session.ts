import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";


@Entity("django_session" ,{schema:"public" } )
@Index("django_session_expire_date_a5c62663",["expire_date",])
@Index("django_session_session_key_c0390e0f_like",["session_key",])
export class django_session {

    @Column("character varying",{ 
        nullable:false,
        primary:true,
        length:40,
        name:"session_key"
        })
    session_key:string;
        

    @Column("text",{ 
        nullable:false,
        name:"session_data"
        })
    session_data:string;
        

    @Column("timestamp with time zone",{ 
        nullable:false,
        name:"expire_date"
        })
    expire_date:Date;
        
}
