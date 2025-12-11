import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { userContextStorage } from '../interceptors/user-context.interceptor';

/**
 * Entity Subscriber để tự động gán createdBy/updatedBy
 * Lấy user ID từ AsyncLocalStorage context
 */
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<BaseEntity> {
  /**
   * Lấy current user ID từ AsyncLocalStorage context
   * Context được set bởi UserContextInterceptor
   */
  private getCurrentUserId(): string | null {
    const store = userContextStorage.getStore();
    return store?.userId || null;
  }

  /**
   * Before insert: Set createdBy và updatedBy
   */
  beforeInsert(event: InsertEvent<BaseEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.createdBy = userId;
      event.entity.updatedBy = userId; // Also set on create
    }
  }

  /**
   * Before update: Set updatedBy
   */
  beforeUpdate(event: UpdateEvent<BaseEntity>): void {
    const userId = this.getCurrentUserId();
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }
}

