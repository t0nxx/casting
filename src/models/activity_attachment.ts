import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId, CreateDateColumn } from "typeorm";
import { Activity } from "./activity";
import { ProfileAlbum } from './profile_album';
import { Profile } from "./users_profile";

export enum AttachmentEnum {
    VIEDO = 'VIDEO',
    AUDIO = 'AUDIO',
    IMG = 'IMG',

}

@Entity("activity_attachment")
export class ActivityAttachment {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    publish_date: Date;

    @Column('text')
    path: string;

    @Column()
    type: string;

    @ManyToOne(type => Activity, a => a.activity_attachment, { onDelete: 'CASCADE' })
    activity: Activity;

    @ManyToOne(type => Profile, p => p.activity_attachment, { onDelete: 'CASCADE' })
    profile: Profile;


    @ManyToOne(type => ProfileAlbum, p => p.activity_attachment, { onDelete: 'CASCADE' })
    album: ProfileAlbum;

    @Column({ nullable: true })
    album_id: number;

}
