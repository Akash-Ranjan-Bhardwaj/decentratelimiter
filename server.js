import express from 'express';
import Redis from 'ioredis';

const app = express();
const port = 3000;
//add envs redis url
// Redis connection
const redis = new Redis(PROCESS.ENV.REDIS_URL);

// Separate subscriber connection
const subscriber = new Redis(PROCESS.ENV.REDIS_URL);

// Channel name
const CHANNEL = 'user-events';

// Rate limit duration
const rateLimitWindow = 15;

app.set('trust proxy', true);

// Subscribe to channel
subscriber.subscribe(CHANNEL, () => {
  console.log(`🔔 Subscribed to ${CHANNEL}`);
});

subscriber.on('message', (channel, message) => {
  console.log(`📩 [${channel}] Received: ${message}`);
});

app.get('/:id', async (req, res) => {
  const ip = req.ip;
  const key = `rate_limit:${ip}`;

  try {
    const isLimited = await redis.get(key);
    if (isLimited) {
      return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    }

    await redis.set(key, 1, 'EX', rateLimitWindow);

    const { id } = req.params;
    const response = await fetch('https://dummyjson.com/users');
    const jsonData = await response.json();

    const user = jsonData.users[parseInt(id)];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Publish event
    const event = JSON.stringify({ event: 'USER_FETCHED', id, name: user.firstName, ip });
    await redis.publish(CHANNEL, event);

    res.send(`${user.firstName} from API`);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
