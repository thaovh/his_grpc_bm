import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../commons/entities/base.entity';

/**
 * Export Status Entity - Trạng thái phiếu xuất
 * Table: MST_EXPORT_STATUS (19 chars - OK)
 * Service Prefix: MST
 */
@Entity('MST_EXPORT_STATUS')
@Index('IDX_MST_EXP_STT_SORT', ['sortOrder'])
export class ExportStatus extends BaseEntity {
  @Column({
    type: 'varchar2',
    length: 50,
    name: 'CODE', // 4 chars - OK
    unique: true,
    nullable: false,
    comment: 'Mã loại trạng thái'
  })
  code: string;

  @Column({
    type: 'varchar2',
    length: 255,
    name: 'NAME', // 4 chars - OK
    nullable: false,
    comment: 'Tên loại trạng thái'
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

