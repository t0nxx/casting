import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Activity } from './activity';
import { Profile } from './users_profile';

@Entity('comments')
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type : 'text' , nullable : true})
    comment: string;

    @CreateDateColumn()
    publish_date: Date;

    @ManyToOne(type => Activity, a => a.activity_Comments, { onDelete: 'CASCADE' })
    activity: Activity;

    @ManyToOne(type => Profile, p => p.activity_Comments, { onDelete: 'CASCADE' })
    profile: Profile;

    @ManyToMany(type => Profile, p => p.comment_mentions)
    @JoinTable()
    commentMention: Profile[];

    @ManyToOne(type => Comment, c => c.thread, { onDelete: 'CASCADE' })
    @JoinColumn()
    thread: Comment;

    @Column({ default: 0 })
    comments_count: number;

    // @ManyToOne(() => auth_user, (auth_user: auth_user) => auth_user.commentss, { nullable: false, })
    // @JoinColumn({ name: 'auth_user_id' })
    // authUser: auth_user | null;

    // @ManyToOne(() => comments, (comments: comments) => comments.commentss, {})
    // @JoinColumn({ name: 'thread_id' })
    // thread: comments | null;

    // @OneToMany(() => comment_mention, (comment_mention: comment_mention) => comment_mention.comment)
    // commentMentions: comment_mention[];

    // @OneToMany(() => comments, (comments: comments) => comments.thread)
    // commentss: comments[];

}
