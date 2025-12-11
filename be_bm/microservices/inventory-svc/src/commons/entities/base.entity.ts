import {
  Column,
} from 'typeorm';

/**
 * Base Entity với các fields chung cho tất cả entities
 * Tuân thủ Oracle 12c naming constraints (<= 32 chars cho column names)
 */
export abstract class BaseEntity {
  // Changed from @PrimaryGeneratedColumn to @Column to avoid RETURNING clause
  // ID will be generated manually in repository
  @Column({ 
    type: 'varchar2', 
    length: 36, // UUID length
    name: 'ID',
    primary: true,
    // Removed generated to avoid RETURNING clause issues with Oracle thin mode
    // Values will be generated explicitly in repository
  })
  id: string;

  @Column({ 
    type: 'timestamp', 
    precision: 6, // TIMESTAMP(6) in Oracle
    name: 'CREATED_AT', // 10 chars - OK
    nullable: false,
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
  })
  createdAt: Date;

  @Column({ 
    type: 'timestamp', 
    precision: 6, // TIMESTAMP(6) in Oracle
    name: 'UPDATED_AT', // 10 chars - OK
    nullable: false,
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
  })
  updatedAt: Date;

  @Column({ 
    type: 'timestamp', 
    precision: 6, // TIMESTAMP(6) in Oracle
    name: 'DELETED_AT', // 10 chars - OK
    nullable: true,
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
  })
  deletedAt: Date | null;
  
  @Column({ 
    type: 'number', 
    precision: 10,
    scale: 0,
    name: 'VERSION', // 7 chars - OK
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
    nullable: false
  })
  version: number;

  @Column({ 
    type: 'varchar2', 
    length: 36, // UUID length
    name: 'CREATED_BY', // 10 chars - OK
    nullable: true,
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
    comment: 'User ID who created the record' 
  })
  createdBy: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 36, // UUID length
    name: 'UPDATED_BY', // 10 chars - OK
    nullable: true,
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
    comment: 'User ID who last updated the record' 
  })
  updatedBy: string | null;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_ACTIVE', // 9 chars - OK
    // Removed default to avoid RETURNING clause issues with Oracle thin mode
    // Values will be set explicitly in repository
    comment: 'Active flag: 1 = active, 0 = inactive' 
  })
  isActive: number; // Oracle: use number(1,0) for boolean
}

