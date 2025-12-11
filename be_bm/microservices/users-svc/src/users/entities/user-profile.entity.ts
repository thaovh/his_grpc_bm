import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';
import { User } from './user.entity';

/**
 * UserProfile Entity - Thông tin profile của user
 * Table: USR_USER_PROFILES (17 chars - OK)
 * Service Prefix: USR
 */
@Entity('USR_USER_PROFILES')
export class UserProfile extends BaseEntity {
  @Column({ 
    type: 'varchar2', 
    length: 36, 
    name: 'USER_ID', // 7 chars - OK
    // unique: true, // Removed - @OneToOne with @JoinColumn already creates unique constraint
    comment: 'Reference to User ID' 
  })
  userId: string;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'FIRST_NAME', // 10 chars - OK
    nullable: true,
    comment: 'First name' 
  })
  firstName: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'LAST_NAME', // 9 chars - OK
    nullable: true,
    comment: 'Last name' 
  })
  lastName: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 20, 
    name: 'PHONE', // 5 chars - OK
    nullable: true,
    comment: 'Phone number' 
  })
  phone: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'AVATAR_URL', // 10 chars - OK
    nullable: true,
    comment: 'Avatar image URL' 
  })
  avatarUrl: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'BIO', // 3 chars - OK
    nullable: true,
    comment: 'User biography' 
  })
  bio: string | null;

  @Column({ 
    type: 'date', 
    name: 'DATE_OF_BIRTH', // 14 chars - OK
    nullable: true,
    comment: 'Date of birth' 
  })
  dateOfBirth: Date | null;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'ADDRESS', // 7 chars - OK
    nullable: true,
    comment: 'Address' 
  })
  address: string | null;

  // One-to-One relationship với User (inverse side)
  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'USER_ID' })
  user: User;
}

