import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { userContextStorage } from '../interceptors/user-context.interceptor';
import { BaseEntity } from '../entities/base.entity';

/**
 * Audit Subscriber để tự động set createdBy, updatedBy, createdAt, updatedAt
 */
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
  beforeInsert(event: InsertEvent<BaseEntity>): void {
    const entity = event.entity;
    const now = new Date();
    const userContext = userContextStorage.getStore();

    if (!entity.createdAt) {
      entity.createdAt = now;
    }
    if (!entity.updatedAt) {
      entity.updatedAt = now;
    }
    if (!entity.version) {
      entity.version = 1;
    }
    if (userContext?.userId && !entity.createdBy) {
      entity.createdBy = userContext.userId;
    }
    if (userContext?.userId && !entity.updatedBy) {
      entity.updatedBy = userContext.userId;
    }
    if (entity.isActive === undefined || entity.isActive === null) {
      entity.isActive = 1;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>): void {
    const entity = event.entity;
    const now = new Date();
    const userContext = userContextStorage.getStore();

    if (entity) {
      entity.updatedAt = now;
      if (userContext?.userId) {
        entity.updatedBy = userContext.userId;
      }
      if (entity.version !== undefined) {
        entity.version = (entity.version || 0) + 1;
      }
    }
  }
}

