import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {auth_user} from "./auth_user";
import {build_lookup} from "./build_lookup";
import {ethnicities_lookup} from "./ethnicities_lookup";
import {eye_lookup} from "./eye_lookup";
import {hair_lookup} from "./hair_lookup";
import {height_range_lookup} from "./height_range_lookup";
import {weight_range_lookup} from "./weight_range_lookup";
import {company} from "./company";
import {job_applicants} from "./job_applicants";
import {job_schedules} from "./job_schedules";
import {job_shortlisted} from "./job_shortlisted";
import {profile_album} from "./profile_album";
import {profile_hobbies} from "./profile_hobbies";
import {profile_settings} from "./profile_settings";
import {profile_social_networks} from "./profile_social_networks";
import {profile_training} from "./profile_training";
import {profile_viewers} from "./profile_viewers";
import {users_profile_categories} from "./users_profile_categories";


@Entity("users_profile" ,{schema:"public" } )
@Index("users_profile_auth_user_id_6e00984f",["authUser",])
@Index("users_profile_build_id_5c61d7f6",["build",])
@Index("users_profile_ethnicity_id_f8c974d4",["ethnicity",])
@Index("users_profile_eye_id_0cae2b23",["eye",])
@Index("users_profile_hair_id_21319060",["hair",])
@Index("users_profile_height_id_f83e4305",["height",])
@Index("users_profile_phone_key",["phone",],{unique:true})
@Index("users_profile_phone_0ff15728_like",["phone",])
@Index("users_profile_slug_809f9137",["slug",])
@Index("users_profile_slug_809f9137_like",["slug",])
@Index("users_profile_weight_id_fabe992c",["weight",])
export class users_profile {

    @PrimaryGeneratedColumn({
        type:"integer", 
        name:"id"
        })
    id:number;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"avatar"
        })
    avatar:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"cover"
        })
    cover:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:50,
        name:"gender"
        })
    gender:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        length:150,
        name:"location"
        })
    location:string | null;
        

    @Column("text",{ 
        nullable:true,
        name:"about"
        })
    about:string | null;
        

    @Column("character varying",{ 
        nullable:true,
        unique: true,
        length:50,
        name:"phone"
        })
    phone:string | null;
        

    @Column("character varying",{ 
        nullable:false,
        length:50,
        name:"slug"
        })
    slug:string;
        

    @Column("integer",{ 
        nullable:true,
        name:"age_from"
        })
    age_from:number | null;
        

   
    @ManyToOne(()=>auth_user, (auth_user: auth_user)=>auth_user.usersProfiles,{  nullable:false, })
    @JoinColumn({ name:'auth_user_id'})
    authUser:auth_user | null;


   
    @ManyToOne(()=>build_lookup, (build_lookup: build_lookup)=>build_lookup.usersProfiles,{  })
    @JoinColumn({ name:'build_id'})
    build:build_lookup | null;


   
    @ManyToOne(()=>ethnicities_lookup, (ethnicities_lookup: ethnicities_lookup)=>ethnicities_lookup.usersProfiles,{  })
    @JoinColumn({ name:'ethnicity_id'})
    ethnicity:ethnicities_lookup | null;


   
    @ManyToOne(()=>eye_lookup, (eye_lookup: eye_lookup)=>eye_lookup.usersProfiles,{  })
    @JoinColumn({ name:'eye_id'})
    eye:eye_lookup | null;


   
    @ManyToOne(()=>hair_lookup, (hair_lookup: hair_lookup)=>hair_lookup.usersProfiles,{  })
    @JoinColumn({ name:'hair_id'})
    hair:hair_lookup | null;


   
    @ManyToOne(()=>height_range_lookup, (height_range_lookup: height_range_lookup)=>height_range_lookup.usersProfiles,{  })
    @JoinColumn({ name:'height_id'})
    height:height_range_lookup | null;


   
    @ManyToOne(()=>weight_range_lookup, (weight_range_lookup: weight_range_lookup)=>weight_range_lookup.usersProfiles,{  })
    @JoinColumn({ name:'weight_id'})
    weight:weight_range_lookup | null;


    @Column("integer",{ 
        nullable:true,
        name:"age_to"
        })
    age_to:number | null;
        

   
    @OneToMany(()=>company, (company: company)=>company.profile)
    companys:company[];
    

   
    @OneToMany(()=>job_applicants, (job_applicants: job_applicants)=>job_applicants.profile)
    jobApplicantss:job_applicants[];
    

   
    @OneToMany(()=>job_schedules, (job_schedules: job_schedules)=>job_schedules.profile)
    jobScheduless:job_schedules[];
    

   
    @OneToMany(()=>job_shortlisted, (job_shortlisted: job_shortlisted)=>job_shortlisted.profile)
    jobShortlisteds:job_shortlisted[];
    

   
    @OneToMany(()=>profile_album, (profile_album: profile_album)=>profile_album.userProfile)
    profileAlbums:profile_album[];
    

   
    @OneToMany(()=>profile_hobbies, (profile_hobbies: profile_hobbies)=>profile_hobbies.userProfile)
    profileHobbiess:profile_hobbies[];
    

   
    @OneToMany(()=>profile_settings, (profile_settings: profile_settings)=>profile_settings.userProfile)
    profileSettingss:profile_settings[];
    

   
    @OneToMany(()=>profile_social_networks, (profile_social_networks: profile_social_networks)=>profile_social_networks.userProfile)
    profileSocialNetworkss:profile_social_networks[];
    

   
    @OneToMany(()=>profile_training, (profile_training: profile_training)=>profile_training.userProfile)
    profileTrainings:profile_training[];
    

   
    @OneToMany(()=>profile_viewers, (profile_viewers: profile_viewers)=>profile_viewers.userProfile)
    profileViewerss:profile_viewers[];
    

   
    @OneToMany(()=>profile_viewers, (profile_viewers: profile_viewers)=>profile_viewers.visitorProfile)
    profileViewerss2:profile_viewers[];
    

   
    @OneToMany(()=>users_profile_categories, (users_profile_categories: users_profile_categories)=>users_profile_categories.userProfile)
    usersProfileCategoriess:users_profile_categories[];
    
}
