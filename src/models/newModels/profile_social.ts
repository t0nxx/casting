import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile_social_networks')
export class ProfileSocialNetworks {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    network: string;

    @Column({ nullable: true })
    url: string;

}
