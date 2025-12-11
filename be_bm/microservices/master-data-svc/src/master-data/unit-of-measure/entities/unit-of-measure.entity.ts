import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

/**
 * Unit of Measure Entity - Đơn vị tính
 * Table: MST_UNIT_OF_MEASURE (20 chars - OK)
 * Service Prefix: MST
 */
@Entity('MST_UNIT_OF_MEASURE')
@Index('IDX_MST_UOM_SORT', ['sortOrder'])
export class UnitOfMeasure extends BaseEntity {
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'CODE', // 4 chars - OK
    unique: true,
    nullable: false,
    comment: 'Mã đơn vị tính'
  })
  code: string;

  @Column({
    type: 'varchar2',
    length: 255,
    name: 'NAME', // 4 chars - OK
    nullable: false,
    comment: 'Tên đơn vị tính'
  })
  name: string;

  @Column({
    type: 'number',
    precision: 10,
    scale: 0,
    name: 'SORT_ORDER', // 10 chars - OK
    nullable: false,
    default: 0,
    comment: 'Thứ tự sắp xếp'
  })
  sortOrder: number;
}

