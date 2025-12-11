# Push Notification for Attendance Events - Implementation Plan

## 📋 Overview

Implement push notification system to send real-time alerts to mobile app when employees check in/out at time attendance machines.

## 🎯 Requirements

### Functional Requirements
1. **Real-time Notification**: Send push notification immediately after attendance record is saved to database
2. **Personalized Messages**: Notify specific employee about their own attendance event
3. **Event Details**: Include timestamp, location (device), event type (IN/OUT)
4. **Delivery Guarantee**: Ensure notifications are sent even if app is closed
5. **Multi-device Support**: Support multiple devices per employee

### Non-functional Requirements
- **Performance**: Send notification within 1 second after database save
- **Reliability**: 99% delivery rate
- **Scalability**: Support 1000+ concurrent notifications
- **Security**: Only send to authenticated devices

## 🏗️ Architecture Options

### Option 1: Event-Driven with Firebase Cloud Messaging (FCM) ✅ Recommended

```
Attendance Record Saved
    ↓
Event Emitter (NestJS)
    ↓
Notification Service
    ↓
Firebase Cloud Messaging (FCM)
    ↓
Mobile App (iOS/Android)
```

**Pros:**
- ✅ Free for unlimited notifications
- ✅ High reliability (Google infrastructure)
- ✅ Support iOS + Android
- ✅ Built-in retry mechanism
- ✅ Topic-based & device-based messaging

**Cons:**
- ⚠️ Requires Firebase setup
- ⚠️ Need to manage device tokens

### Option 2: OneSignal (Alternative)

**Pros:**
- ✅ Easier setup than FCM
- ✅ Free tier: 10,000 subscribers
- ✅ Web dashboard for testing
- ✅ Segmentation & scheduling

**Cons:**
- ⚠️ Limited free tier
- ⚠️ External dependency

### Option 3: WebSocket (Real-time only)

**Pros:**
- ✅ Instant delivery
- ✅ No external service

**Cons:**
- ❌ Only works when app is open
- ❌ Not true push notification
- ❌ Battery drain

## 📐 Recommended Architecture: Event-Driven + FCM

```
┌─────────────────────────────────────────────────────────┐
│              Attendance Service                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  CreateAttendanceRecordHandler                          │
│    ├─ Save to Database ✅                               │
│    └─ Emit Event: "attendance.created"                  │
│                    ↓                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  AttendanceEventListener                         │  │
│  │  - Listen to "attendance.created"                │  │
│  │  - Extract employee info                         │  │
│  │  - Call NotificationService                      │  │
│  └──────────────────────────────────────────────────┘  │
│                    ↓                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  NotificationService                             │  │
│  │  - Get employee device tokens (from users-svc)   │  │
│  │  - Build notification payload                    │  │
│  │  - Send via FCM                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                    ↓                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  FCM Provider                                    │  │
│  │  - Firebase Admin SDK                            │  │
│  │  - Send to device tokens                         │  │
│  │  - Handle errors & retries                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                    ↓
         Firebase Cloud Messaging
                    ↓
         Mobile App (iOS/Android)
```

## 🔧 Implementation Steps

### Step 1: Setup Firebase Project

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project: "HIS-Attendance"
   - Enable Cloud Messaging

2. **Download Service Account Key**
   - Project Settings → Service Accounts
   - Generate new private key
   - Save as `firebase-adminsdk.json`

3. **Add to .env**
   ```bash
   FIREBASE_PROJECT_ID=his-attendance
   FIREBASE_PRIVATE_KEY_PATH=/path/to/firebase-adminsdk.json
   ```

### Step 2: Install Dependencies

```bash
cd microservices/attendance-svc
npm install firebase-admin @nestjs/event-emitter
```

### Step 3: Create Notification Module

**File Structure:**
```
src/
├── notification/
│   ├── notification.module.ts
│   ├── services/
│   │   ├── notification.service.ts
│   │   └── fcm.provider.ts
│   ├── listeners/
│   │   └── attendance-event.listener.ts
│   ├── dto/
│   │   └── send-notification.dto.ts
│   └── interfaces/
│       └── notification-payload.interface.ts
```

### Step 4: Implement FCM Provider

**File:** `src/notification/services/fcm.provider.ts`

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FCMProvider implements OnModuleInit {
    private app: admin.app.App;

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        const serviceAccount = require(
            this.configService.get('FIREBASE_PRIVATE_KEY_PATH')
        );

        this.app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: this.configService.get('FIREBASE_PROJECT_ID'),
        });
    }

    async sendToDevice(token: string, payload: any): Promise<string> {
        const message = {
            token,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
        };

        return await admin.messaging().send(message);
    }

    async sendToMultipleDevices(tokens: string[], payload: any): Promise<any> {
        const message = {
            tokens,
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
        };

        return await admin.messaging().sendMulticast(message);
    }
}
```

### Step 5: Implement Notification Service

**File:** `src/notification/services/notification.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { FCMProvider } from './fcm.provider';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);
    private usersService: any; // gRPC client

    constructor(
        private readonly fcmProvider: FCMProvider,
        @Inject('USERS_PACKAGE') private usersClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.usersService = this.usersClient.getService('UsersService');
    }

    async sendAttendanceNotification(
        employeeCode: string,
        eventType: string,
        eventTimestamp: Date,
        deviceId: string,
    ): Promise<void> {
        try {
            // Get employee device tokens from users-svc
            const tokens = await this.getEmployeeDeviceTokens(employeeCode);

            if (!tokens || tokens.length === 0) {
                this.logger.warn(`No device tokens found for employee: ${employeeCode}`);
                return;
            }

            // Build notification payload
            const payload = {
                title: this.getNotificationTitle(eventType),
                body: this.getNotificationBody(eventType, eventTimestamp, deviceId),
                data: {
                    type: 'attendance',
                    employeeCode,
                    eventType,
                    timestamp: eventTimestamp.toISOString(),
                    deviceId,
                },
            };

            // Send notification
            const result = await this.fcmProvider.sendToMultipleDevices(tokens, payload);
            
            this.logger.log(
                `Sent notification to ${tokens.length} devices for employee: ${employeeCode}. ` +
                `Success: ${result.successCount}, Failed: ${result.failureCount}`
            );
        } catch (error) {
            this.logger.error(`Failed to send notification for employee: ${employeeCode}`, error);
        }
    }

    private async getEmployeeDeviceTokens(employeeCode: string): Promise<string[]> {
        try {
            // Call users-svc via gRPC to get device tokens
            const response = await this.usersService.getDeviceTokens({ employeeCode }).toPromise();
            return response.tokens || [];
        } catch (error) {
            this.logger.error(`Failed to get device tokens for ${employeeCode}`, error);
            return [];
        }
    }

    private getNotificationTitle(eventType: string): string {
        const titles = {
            IN: '✅ Chấm công vào',
            OUT: '👋 Chấm công ra',
            BREAK_START: '☕ Bắt đầu nghỉ',
            BREAK_END: '💼 Kết thúc nghỉ',
        };
        return titles[eventType] || '📋 Chấm công';
    }

    private getNotificationBody(eventType: string, timestamp: Date, deviceId: string): string {
        const time = timestamp.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        return `Bạn đã chấm công lúc ${time} tại ${deviceId}`;
    }
}
```

### Step 6: Create Event Listener

**File:** `src/notification/listeners/attendance-event.listener.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';

export class AttendanceCreatedEvent {
    constructor(
        public readonly employeeCode: string,
        public readonly eventType: string,
        public readonly eventTimestamp: Date,
        public readonly deviceId: string,
        public readonly recordId: string,
    ) {}
}

@Injectable()
export class AttendanceEventListener {
    private readonly logger = new Logger(AttendanceEventListener.name);

    constructor(private readonly notificationService: NotificationService) {}

    @OnEvent('attendance.created')
    async handleAttendanceCreated(event: AttendanceCreatedEvent) {
        this.logger.log(`Handling attendance.created event for employee: ${event.employeeCode}`);

        // Send notification asynchronously (don't block)
        this.notificationService
            .sendAttendanceNotification(
                event.employeeCode,
                event.eventType,
                event.eventTimestamp,
                event.deviceId,
            )
            .catch((error) => {
                this.logger.error('Failed to send notification', error);
            });
    }
}
```

### Step 7: Update Command Handler to Emit Event

**File:** `src/attendance/commands/handlers/create-attendance.handler.ts`

```typescript
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AttendanceCreatedEvent } from '../../../notification/listeners/attendance-event.listener';

@CommandHandler(CreateAttendanceRecordCommand)
export class CreateAttendanceRecordHandler {
    constructor(
        private readonly repository: AttendanceRepository,
        private readonly eventEmitter: EventEmitter2, // Add this
    ) {}

    async execute(command: CreateAttendanceRecordCommand): Promise<AttendanceRecord> {
        // ... existing code to save record ...

        const record = await this.repository.save(newRecord);

        // Emit event for notification
        this.eventEmitter.emit(
            'attendance.created',
            new AttendanceCreatedEvent(
                record.employeeCode,
                record.eventType,
                record.eventTimestamp,
                record.deviceId,
                record.id,
            ),
        );

        return record;
    }
}
```

### Step 8: Update App Module

**File:** `src/app.module.ts`

```typescript
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [
        // ... existing imports ...
        EventEmitterModule.forRoot(),
        NotificationModule,
    ],
})
export class AppModule {}
```

### Step 9: Add Device Token Management to users-svc

**New gRPC Method in users-svc:**

```protobuf
// users.proto
service UsersService {
    // ... existing methods ...
    rpc GetDeviceTokens(GetDeviceTokensRequest) returns (GetDeviceTokensResponse);
    rpc SaveDeviceToken(SaveDeviceTokenRequest) returns (SaveDeviceTokenResponse);
    rpc RemoveDeviceToken(RemoveDeviceTokenRequest) returns (RemoveDeviceTokenResponse);
}

message GetDeviceTokensRequest {
    string employeeCode = 1;
}

message GetDeviceTokensResponse {
    repeated string tokens = 1;
}
```

### Step 10: Mobile App Integration

**iOS/Android:**
1. Install Firebase SDK
2. Get FCM token on app launch
3. Send token to backend via API
4. Handle incoming notifications

**Example (React Native):**
```javascript
import messaging from '@react-native-firebase/messaging';

// Get FCM token
const token = await messaging().getToken();

// Send to backend
await api.post('/users/device-tokens', { token });

// Handle notifications
messaging().onMessage(async (remoteMessage) => {
    console.log('Notification received:', remoteMessage);
    // Show in-app notification
});
```

## 📊 Data Flow

```
1. Employee chấm công
   ↓
2. Webhook → Redis → Event Processor
   ↓
3. CreateAttendanceRecordHandler
   ├─ Save to ATT_RECORDS ✅
   └─ Emit "attendance.created" event
       ↓
4. AttendanceEventListener
   ├─ Receive event
   └─ Call NotificationService
       ↓
5. NotificationService
   ├─ Get device tokens from users-svc (gRPC)
   ├─ Build notification payload
   └─ Send via FCM
       ↓
6. Firebase Cloud Messaging
   └─ Deliver to mobile devices
       ↓
7. Mobile App
   └─ Show notification
```

## 🧪 Testing Strategy

### Unit Tests
- NotificationService: Mock FCM provider
- AttendanceEventListener: Mock NotificationService
- FCMProvider: Mock Firebase Admin SDK

### Integration Tests
- End-to-end: Create attendance → Verify notification sent
- FCM: Test with real Firebase project (dev environment)

### Manual Testing
1. Use Firebase Console to send test notification
2. Test with real device tokens
3. Verify notification delivery

## 🔒 Security Considerations

1. **Device Token Validation**: Verify tokens before storing
2. **Rate Limiting**: Prevent notification spam
3. **Data Privacy**: Don't include sensitive data in notifications
4. **Authentication**: Only authenticated users can register tokens

## 📈 Monitoring & Logging

```typescript
// Log notification events
logger.log(`Notification sent: ${employeeCode} - ${eventType}`);
logger.error(`Notification failed: ${employeeCode}`, error);

// Metrics to track
- Notifications sent per day
- Delivery success rate
- Average delivery time
- Failed notifications (with reasons)
```

## 🚀 Deployment Checklist

- [ ] Create Firebase project
- [ ] Download service account key
- [ ] Add Firebase credentials to .env
- [ ] Install dependencies
- [ ] Implement NotificationModule
- [ ] Update Command Handler to emit events
- [ ] Add device token management to users-svc
- [ ] Test with dev Firebase project
- [ ] Integrate with mobile app
- [ ] Deploy to staging
- [ ] End-to-end testing
- [ ] Deploy to production

## 📝 Summary

**Effort Estimate:** 3-5 days
- Day 1: Firebase setup + FCM Provider
- Day 2: Notification Service + Event Listener
- Day 3: users-svc device token management
- Day 4: Mobile app integration
- Day 5: Testing & deployment

**Dependencies:**
- Firebase project setup
- users-svc updates for device tokens
- Mobile app Firebase SDK integration

**Benefits:**
- ✅ Real-time attendance notifications
- ✅ Improved employee experience
- ✅ Audit trail for attendance events
- ✅ Foundation for future notifications
