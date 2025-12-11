const Redis = require('ioredis');

const redis = new Redis({
    host: '192.168.68.209',
    port: 6379,
    password: 't123456',
    db: 0,
});

async function checkQueue() {
    try {
        // Get queue length
        const length = await redis.llen('attendance:events:queue');
        console.log(`\n=== Redis Queue Status ===`);
        console.log(`Queue length: ${length}`);

        if (length > 0) {
            // Get first event (without removing)
            const events = await redis.lrange('attendance:events:queue', 0, 2);
            console.log(`\n=== Latest Events (showing ${Math.min(3, events.length)}) ===`);
            events.forEach((event, index) => {
                console.log(`\n--- Event ${index + 1} ---`);
                const parsed = JSON.parse(event);
                console.log(JSON.stringify(parsed, null, 2));
            });
        } else {
            console.log('\nQueue is empty - events are being processed immediately!');
        }

        redis.disconnect();
    } catch (error) {
        console.error('Error:', error);
        redis.disconnect();
    }
}

checkQueue();
