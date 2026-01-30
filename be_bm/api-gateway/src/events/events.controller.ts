import { Controller, Get, Res, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EventsGateway } from './events.gateway';
import { RedisStreamService } from './redis-stream.service';
import { PinoLogger } from 'nestjs-pino';
import { convertDatesToISO } from '../common/utils/date-converter.util';
import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skipTransform';
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly redisStreamService: RedisStreamService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EventsController.name);
  }

  @Get('stream')
  @Resource('events')
  @SkipTransform()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Server-Sent Events stream for real-time notifications',
    description: 'Subscribe to receive real-time notifications when inpatient exp mests are synced, updated, or medicines are exported. Use topics query param to filter events. Supports Last-Event-ID header for event replay.'
  })
  @ApiQuery({
    name: 'topics',
    required: false,
    type: String,
    description: 'Comma-separated event topics to subscribe. Available topics: "inpatient-exp-mest-synced", "inpatient-exp-mest-stt-updated", "inpatient-exp-mest-medicines-exported", "exp-mest-other-stt-updated", "exp-mest-other-medicines-exported". Example: "inpatient-exp-mest-synced,exp-mest-other-medicines-exported"',
  })
  @ApiHeader({
    name: 'Last-Event-ID',
    required: false,
    description: 'Last received event ID for event replay. Format: timestamp-sequence (e.g., "1736832000000-0")',
  })
  async streamEvents(
    @Req() req: Request,
    @Res() res: Response,
    @Query('topics') topics?: string,
  ): Promise<void> {
    // Get Last-Event-ID from header for event replay
    const lastEventId = req.headers['last-event-id'] as string;

    this.logger.info('EventsController#streamEvents.start', { topics, lastEventId });

    // Set SSE headers explicitly and flush them immediately
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    // Helper to send data with SSE format (with event ID)
    const sendSSE = (data: any, eventId?: string) => {
      try {
        const transformedData = convertDatesToISO(data);
        let chunk = '';

        // Add event ID if provided
        if (eventId) {
          chunk += `id: ${eventId}\n`;
        }

        chunk += `data: ${JSON.stringify(transformedData)}\n\n`;
        res.write(chunk);

        // Manual flush if available (express/compression)
        if (typeof (res as any).flush === 'function') {
          (res as any).flush();
        }
      } catch (err) {
        this.logger.error('EventsController#streamEvents.writeError', { error: err.message });
      }
    };

    // 1. Send initial connection
    sendSSE({
      type: 'CONNECTED',
      message: 'Event stream connected',
      timestamp: Date.now(),
    });

    // 2. Replay missed events if Last-Event-ID is provided
    if (lastEventId && this.redisStreamService.isConnected()) {
      try {
        const missedEvents = await this.redisStreamService.readFrom(lastEventId, 100);

        this.logger.info('EventsController#streamEvents.replay', {
          lastEventId,
          missedEventsCount: missedEvents.length,
        });

        // Filter by topics if specified
        const topicList = topics
          ? topics.split(',').map(t => t.trim().toLowerCase().replace(/\./g, '-'))
          : [];

        for (const event of missedEvents) {
          if (topicList.length > 0) {
            const eventType = event.type.toLowerCase().replace(/_/g, '-').replace(/\./g, '-');
            if (!topicList.includes(eventType)) continue;
          }

          sendSSE({
            type: event.type,
            data: event.data,
            timestamp: event.timestamp,
          }, event.id);
        }
      } catch (error) {
        this.logger.error('EventsController#streamEvents.replayError', {
          error: error.message,
          lastEventId,
        });
      }
    }

    // 3. Setup subscription for new events
    const topicList = topics
      ? topics.split(',').map(t => t.trim().toLowerCase().replace(/\./g, '-'))
      : [];

    const subscription = this.eventsGateway.getEventStream().subscribe({
      next: (event) => {
        // [DEBUG-SSE] Trace incoming event
        const debugEventType = event.type;
        // const debugTopicList = topicList; 

        if (topicList.length > 0) {
          const eventType = event.type.toLowerCase().replace(/_/g, '-').replace(/\./g, '-');

          if (!topicList.includes(eventType)) {
            // console.log(`[DEBUG-SSE] Event filtered out. Type: ${eventType}, Topics: ${topicList.join(',')}`); 
            return;
          }
          console.log(`[DEBUG-SSE] Event MATCHED. Type: ${eventType}, Client Topics: ${topicList.join(',')}`);
        } else {
          console.log(`[DEBUG-SSE] Event broadcasting (no filter). Type: ${event.type}`);
        }

        // Send event with ID
        console.log(`[DEBUG-SSE] Writing to response for client. Event ID: ${event.id}`);
        sendSSE({
          type: event.type,
          data: event.data,
        }, event.id);
      },
      error: (err) => {
        this.logger.error('EventsController#streamEvents.streamError', { error: err.message });
        res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
      }
    });

    // 4. Setup heartbeat
    const heartbeatInterval = setInterval(() => {
      sendSSE({ type: 'HEARTBEAT', timestamp: Date.now() });
    }, 30000);

    // 5. Cleanup on close
    res.on('close', () => {
      this.logger.info('EventsController#streamEvents.closed');
      subscription.unsubscribe();
      clearInterval(heartbeatInterval);
      res.end();
    });
  }
}
