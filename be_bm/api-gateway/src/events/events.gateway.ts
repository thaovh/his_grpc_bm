import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject, Observable } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { RedisStreamService } from './redis-stream.service';

export interface InpatientExpMestSyncedEvent {
  expMestId: number;
  expMestCode: string;
  userId: string;
  timestamp: number;
  data?: any; // Đầy đủ thông tin như object trong response của API GET /api/integration/exp-mests/inpatient
}

export interface InpatientExpMestSttUpdatedEvent {
  expMestId: number;
  expMestCode: string;
  oldSttId: number | null;
  newSttId: number;
  timestamp: number;
  data?: any; // Đầy đủ thông tin như object trong response của API GET /api/integration/exp-mests/inpatient
}

export interface InpatientExpMestMedicinesExportedEvent {
  expMestId: number;
  expMestCode: string;
  userId: string;
  timestamp: number;
  data?: any; // Đầy đủ thông tin summary như response của API GET /api/inventory/inpatient-exp-mests/{expMestId}/summary
}

@Injectable()
export class EventsGateway {
  private readonly eventSubject = new Subject<any>();

  constructor(
    private readonly logger: PinoLogger,
    private readonly redisStreamService: RedisStreamService,
  ) {
    this.logger.setContext(EventsGateway.name);
  }

  /**
   * Get event stream Observable for SSE
   */
  getEventStream(): Observable<any> {
    return this.eventSubject.asObservable();
  }

  /**
   * Handle inpatient exp mest synced event
   */
  @OnEvent('inpatient.exp-mest.synced')
  async handleInpatientExpMestSynced(payload: InpatientExpMestSyncedEvent) {
    await this.publishEvent('INPATIENT_EXP_MEST_SYNCED', payload);
  }

  /**
   * Handle inpatient exp mest status updated event
   */
  @OnEvent('inpatient.exp-mest.stt-updated')
  async handleExpMestSttUpdated(payload: InpatientExpMestSttUpdatedEvent) {
    await this.publishEvent('INPATIENT_EXP_MEST_STT_UPDATED', payload);
  }

  /**
   * Handle inpatient exp mest medicines exported event
   */
  @OnEvent('inpatient.exp-mest.medicines.exported')
  async handleInpatientExpMestMedicinesExported(payload: InpatientExpMestMedicinesExportedEvent) {
    await this.publishEvent('INPATIENT_EXP_MEST_MEDICINES_EXPORTED', payload);
  }

  @OnEvent('cabinet.exp-mest.synced')
  async handleCabinetExpMestSynced(payload: any) {
    await this.publishEvent('CABINET_EXP_MEST_SYNCED', payload);
  }

  /**
   * Handle other exp mest medicines exported event
   */
  @OnEvent('exp-mest-other.medicines.exported')
  async handleExpMestOtherMedicinesExported(payload: any) {
    await this.publishEvent('EXP_MEST_OTHER_MEDICINES_EXPORTED', payload);
  }

  /**
   * Handle other exp mest status updated event
   */
  @OnEvent('exp-mest-other.stt-updated')
  async handleExpMestOtherSttUpdated(payload: any) {
    await this.publishEvent('EXP_MEST_OTHER_STT_UPDATED', payload);
  }

  /**
   * Publish event to both Redis Stream and in-memory Subject
   * Dual-publishing ensures:
   * - Redis Stream: Persistence and replay capability
   * - In-memory Subject: Real-time delivery to active SSE connections
   */
  private async publishEvent(type: string, data: any): Promise<void> {
    try {
      // 1. Publish to Redis Stream for persistence
      let eventId: string;
      if (this.redisStreamService.isConnected()) {
        eventId = await this.redisStreamService.publish({ type, data });
        this.logger.debug('Event published to Redis Stream', { eventId, type });
      } else {
        // Fallback: generate event ID even if Redis is down
        eventId = `fallback-${Date.now()}`;
        this.logger.warn('Redis not connected, using fallback event ID', { eventId, type });
      }

      // 2. Emit to in-memory Subject for active SSE connections
      const eventData = {
        id: eventId,
        type,
        data,
      };

      this.eventSubject.next(eventData);
      this.logger.debug('Event emitted to in-memory Subject', { eventId, type });
    } catch (error) {
      this.logger.error('Failed to publish event', {
        error: error.message,
        type,
      });

      // Still emit to in-memory even if Redis fails
      this.eventSubject.next({
        id: `error-${Date.now()}`,
        type,
        data,
      });
    }
  }
}

