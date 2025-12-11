import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base.entity';

/**
 * AuthToken Entity - Lưu refresh tokens
 * Table: AUTH_TOKENS (10 chars - OK)
 * Service Prefix: AUTH
 */
@Entity('AUTH_TOKENS')
@Index('IDX_AUTH_TOKENS_USER_ID', ['userId'])
@Index('IDX_AUTH_TOKENS_EXPIRES_AT', ['expiresAt'])
export class AuthToken extends BaseEntity {
  @Column({ 
    type: 'varchar2', 
    length: 36, 
    name: 'USER_ID', // 7 chars - OK
    nullable: false,
    comment: 'Foreign key to USR_USERS.ID' 
  })
  userId: string;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'REFRESH_TOKEN', // 13 chars - OK
    nullable: false,
    unique: true,
    comment: 'JWT refresh token' 
  })
  refreshToken: string;

  @Column({ 
    type: 'varchar2', 
    length: 100, 
    name: 'DEVICE_ID', // 9 chars - OK
    nullable: true,
    comment: 'Device identifier' 
  })
  deviceId: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 255, 
    name: 'IP_ADDRESS', // 10 chars - OK
    nullable: true,
    comment: 'IP address of the client' 
  })
  ipAddress: string | null;

  @Column({ 
    type: 'varchar2', 
    length: 500, 
    name: 'USER_AGENT', // 10 chars - OK
    nullable: true,
    comment: 'User agent string' 
  })
  userAgent: string | null;

  @Column({ 
    type: 'timestamp', 
    precision: 6,
    name: 'EXPIRES_AT', // 10 chars - OK
    nullable: false,
    comment: 'Token expiration timestamp' 
  })
  expiresAt: Date;

  @Column({ 
    type: 'number', 
    precision: 1,
    scale: 0,
    name: 'IS_REVOKED', // 10 chars - OK
    nullable: false,
    default: 0,
    comment: 'Revoked flag: 0 = active, 1 = revoked' 
  })
  isRevoked: number;
}

