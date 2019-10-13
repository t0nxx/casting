import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";


@Entity("friendship_block" ,{schema:"public" } )
@Index("friendship_block_blocked_id_75e16cd7",["blocked",])
@Index("friendship_block_blocker_id_blocked_id_e24c5fca_uniq",["blocked","blocker",],{unique:true})
@Index("friendship_block_blocker_id_94707a64",["blocker",])
export class friendship_block {

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
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipBlocks,{  nullable:false, })
    @JoinColumn({ name:'blocked_id'})
    blocked:auth_user | null;


   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.friendshipBlocks2,{  nullable:false, })
    @JoinColumn({ name:'blocker_id'})
    blocker:auth_user | null;

}
