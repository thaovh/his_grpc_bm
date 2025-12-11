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

  // HIS Employee fields - Thông tin nghề nghiệp
  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'DIPLOMA', // 7 chars - OK
    nullable: true,
    comment: 'Diploma/Certificate' 
  })
  diploma: string | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_DOCTOR', // 9 chars - OK
    nullable: true,
    default: 0,
    comment: 'Is Doctor (0/1)' 
  })
  isDoctor: number | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_NURSE', // 8 chars - OK
    nullable: true,
    default: 0,
    comment: 'Is Nurse (0/1)' 
  })
  isNurse: number | null;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'TITLE', // 5 chars - OK
    nullable: true,
    comment: 'Job Title' 
  })
  title: string | null;

  @Column({ 
    type: 'number', 
    precision: 19,
    scale: 0,
    name: 'CAREER_TITLE_ID', // 15 chars - OK
    nullable: true,
    comment: 'Career Title ID' 
  })
  careerTitleId: number | null;

  // HIS Employee fields - Thông tin tổ chức
  @Column({ 
    type: 'number', 
    precision: 19,
    scale: 0,
    name: 'DEPARTMENT_ID', // 13 chars - OK
    nullable: true,
    comment: 'Department ID' 
  })
  departmentId: number | null;

  @Column({ 
    type: 'number', 
    precision: 19,
    scale: 0,
    name: 'BRANCH_ID', // 9 chars - OK
    nullable: true,
    comment: 'Branch ID' 
  })
  branchId: number | null;

  @Column({ 
    type: 'varchar2', 
    length: 1000, 
    name: 'DEFAULT_MEDI_STOCK_IDS', // 22 chars - OK
    nullable: true,
    comment: 'Default Medical Stock IDs (JSON string)' 
  })
  defaultMediStockIds: string | null;

  // HIS Employee fields - Thông tin cá nhân
  @Column({ 
    type: 'number', 
    precision: 19,
    scale: 0,
    name: 'GENDER_ID', // 9 chars - OK
    nullable: true,
    comment: 'Gender ID' 
  })
  genderId: number | null;

  @Column({ 
    type: 'varchar2', 
    length: 50, 
    name: 'ETHNIC_CODE', // 11 chars - OK
    nullable: true,
    comment: 'Ethnic Code' 
  })
  ethnicCode: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 50, 
    name: 'IDENTIFICATION_NUMBER', // 22 chars - OK
    nullable: true,
    comment: 'Identification Number (CMND/CCCD)' 
  })
  identificationNumber: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 50, 
    name: 'SOCIAL_INSURANCE_NUMBER', // 25 chars - OK
    nullable: true,
    comment: 'Social Insurance Number' 
  })
  socialInsuranceNumber: string | null;

  // HIS Employee fields - Bằng cấp
  @Column({ 
    type: 'date', 
    name: 'DIPLOMA_DATE', // 12 chars - OK
    nullable: true,
    comment: 'Diploma Date' 
  })
  diplomaDate: Date | null;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'DIPLOMA_PLACE', // 13 chars - OK
    nullable: true,
    comment: 'Diploma Place' 
  })
  diplomaPlace: string | null;

  // HIS Employee fields - Cấu hình
  @Column({ 
    type: 'number', 
    precision: 10,
    scale: 0,
    name: 'MAX_SERVICE_REQ_PER_DAY', // 22 chars - OK
    nullable: true,
    comment: 'Max Service Requests Per Day' 
  })
  maxServiceReqPerDay: number | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'DO_NOT_ALLOW_SIMULTANEITY', // 25 chars - OK
    nullable: true,
    default: 0,
    comment: 'Do Not Allow Simultaneity (0/1)' 
  })
  doNotAllowSimultaneity: number | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_ADMIN', // 8 chars - OK
    nullable: true,
    default: 0,
    comment: 'Is Admin (0/1)' 
  })
  isAdmin: number | null;

  // One-to-One relationship với User (inverse side)
  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'USER_ID' })
  user: User;
}

