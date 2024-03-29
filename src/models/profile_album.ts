import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Profile } from "./users_profile";
import { ActivityAttachment } from "./activity_attachment";

@Entity("profile_album")

export class ProfileAlbum {

    @PrimaryGeneratedColumn()
    id: number;


    @CreateDateColumn()
    publish_date: Date;


    @Column()
    album_name: string;


    @ManyToOne(type => Profile, p => p.albums, { onDelete: 'CASCADE' })
    profile: Profile;



    @OneToMany(type => ActivityAttachment, ac => ac.album, { onDelete: 'CASCADE' })
    activity_attachment: ActivityAttachment[];

}
