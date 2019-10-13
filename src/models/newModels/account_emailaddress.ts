import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './auth_user';

@Entity('account_emailaddress')
export class AccountEmailaddresss {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    email: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ default: false })
    primary: boolean;

    @Column({ default: 'noKey' })
    ConfirmKey: string;

    @ManyToOne(() => User, user => user.accountEmailaddresss)
    user: User;
}
