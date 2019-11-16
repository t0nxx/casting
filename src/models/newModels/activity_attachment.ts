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

    @Column()
    path: string;

    @Column()
    type: string;

    @ManyToOne(type => Activity, a => a.activity_attachment, { onDelete: 'CASCADE' })
    activity: Activity;

    @ManyToOne(type => Profile, p => p.activity_attachment, { onDelete: 'CASCADE' })
    profile: Profile;

    // @ManyToOne(() => profile_album, (profile_album: profile_album) => profile_album.activityAttachments, {})
    // @JoinColumn({ name: 'album_id' })
    // album: profile_album | null;

    // @Column("character varying", {
    //     nullable: false,
    //     length: 150,
    //     name: "path_json"
    // })
    // path_json: string;

}
