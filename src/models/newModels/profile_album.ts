import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { Profile } from "./users_profile";

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
    // @ManyToOne(() => users_profile, (users_profile: users_profile) => users_profile.profileAlbums, { nullable: false, })
    // @JoinColumn({ name: 'user_profile_id' })
    // userProfile: users_profile | null;



    // @OneToMany(() => activity_attachment, (activity_attachment: activity_attachment) => activity_attachment.album)
    // activityAttachments: activity_attachment[];

}
