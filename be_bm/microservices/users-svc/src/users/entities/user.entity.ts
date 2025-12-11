import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { UserProfile } from './user-profile.entity';

/**
 * User Entity - Dùng cho authentication và login
 * Table: USR_USERS (9 chars - OK)
 * Service Prefix: USR
 */
@Entity('USR_USERS')
export class User extends BaseEntity {
  // Login fields
  @Column({ 
    type: 'varchar2', 
    length: 100, 
    name: 'USERNAME', // 8 chars - OK
    unique: true,
    comment: 'Username for login' 
  })
  username: string;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'EMAIL', // 5 chars - OK
    unique: true,
    comment: 'Email address for login' 
  })
  email: string;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'PASSWORD_HASH', // 13 chars - OK
    comment: 'Hashed password' 
  })
  passwordHash: string;

  @Column({ 
    type: 'number', 
    precision: 19,
    scale: 0,
    name: 'ACS_ID', // 6 chars - OK
    nullable: true,
    unique: true,
    comment: 'ACS System ID' 
  })
  acsId: number | null;

  // One-to-One relationship với UserProfile (inverse side - foreign key ở UserProfile)
  @OneToOne(() => UserProfile, profile => profile.user, { 
    cascade: true,
    eager: false // Lazy load profile
  })
  profile: UserProfile | null;
}

