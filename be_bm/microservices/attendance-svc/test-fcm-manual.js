const admin = require('firebase-admin');
const path = require('path');

// ==========================================
// CẤU HÌNH TEST
// ==========================================

// 1. Điền đường dẫn tuyệt đối đến file JSON credential của Firebase
// (User đã cung cấp path này)
const SERVICE_ACCOUNT_PATH = 'd:\\bmaibe\\be_bm\\microservices\\attendance-svc\\config\\firebase\\service-account.json';

// 2. Điền Token của thiết bị (lấy từ log hoặc DB của user 1844)
const TARGET_TOKEN = 'dvUhi51pQzS9vZuAXeLo4J:APA91bHlfoq0mRciv5EjFRW-OhShKjXFliBg0JRVE4j0pta_VIJWymvao0ILiRyTW9bBwTpeQFlX0uWR2WbBqDQoAFW6YjiWjInz0AEoq3tqNtAuRA9GYD4';

// ==========================================

async function sendTestNotification() {
    console.log('🚀 Bắt đầu test gửi Notification...');

    try {
        console.log(`📂 Loading Credential từ: ${SERVICE_ACCOUNT_PATH}`);
        // Check file exists
        const fs = require('fs');
        if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
            throw new Error(`Không tìm thấy file credential tại: ${SERVICE_ACCOUNT_PATH}`);
        }

        const serviceAccount = require(SERVICE_ACCOUNT_PATH);

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('✅ Firebase Admin Initialized');
        }

        const message = {
            token: TARGET_TOKEN,
            notification: {
                title: '✅ Bạn đã chấm công thành công',
                body: `Chính Hãng, Bảo Hành 12 Tháng — Đa Dạng Dòng Máy Phục Vụ Mọi Quy Mô, Lĩnh Vực: Siêu Thị, Cửa Hàng, Nhà Thuốc, Sản Xuất. Delfi Technologies Chuyên Cung Cấp Thiết Bị Mã Vạch Uy Tín Chất Lượng Tại VN. Liên Hệ Ngay.Bạn đã chấm công lúc 08:30 ngày 07/01/2026 tại Máy Cổng Chính.`,
            },
            data: {
                type: 'ATTENDANCE_CREATED',
                attendanceId: 'a6f86174-bbb2-4edb-910b-cab9388c8f7e',
                recordId: 'a6f86174-bbb2-4edb-910b-cab9388c8f7e',
                eventType: 'IN',
                time: '2026-01-07T08:45:23+07:00',
                deviceName: 'Máy Nhà Q',
            },
        };

        console.log('📤 Đang gửi message...');
        console.log(JSON.stringify(message, null, 2));

        const response = await admin.messaging().send(message);
        console.log('🎉 Gửi thành công! Message ID:', response);

    } catch (error) {
        console.error('❌ Gửi thất bại:', error);
    }
}

sendTestNotification();
