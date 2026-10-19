import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();

const app = express();

// Allow requests from the Dunamis website
app.use(cors());

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    configured: Boolean(
      process.env.LIVEKIT_URL &&
      process.env.LIVEKIT_API_KEY &&
      process.env.LIVEKIT_API_SECRET
    ),
  });
});

// Create LiveKit token
app.post('/api/token', async (req, res) => {
  try {
    const {
      identity,
      role = 'viewer',
      roomName = 'dunamis-main-service',
    } = req.body || {};

    if (!identity) {
      return res.status(400).json({
        error: 'Missing participant identity.',
      });
    }

    const {
      LIVEKIT_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
    } = process.env;

    if (
      !LIVEKIT_URL ||
      !LIVEKIT_API_KEY ||
      !LIVEKIT_API_SECRET
    ) {
      return res.status(503).json({
        error: 'LiveKit server is not configured.',
      });
    }

    const broadcaster = role === 'broadcaster';

    const accessToken = new AccessToken(
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      {
        identity,
        name: broadcaster
          ? 'Dunamis Media Team'
          : 'Dunamis Member',
        ttl: '6h',
      }
    );

    accessToken.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: broadcaster,
      canSubscribe: true,
      canPublishData: broadcaster,
    });

    const token = await accessToken.toJwt();

    return res.json({
      token,
      serverUrl: LIVEKIT_URL,
      roomName,
    });
  } catch (error) {
    console.error('Token generation error:', error);

    return res.status(500).json({
      error: 'Could not create streaming token.',
    });
  }
});

// Render uses process.env.PORT.
// Local PC can continue using TOKEN_SERVER_PORT or port 3001.
const port = Number(
  process.env.PORT ||
  process.env.TOKEN_SERVER_PORT ||
  3001
);

app.listen(port, '0.0.0.0', () => {
  console.log(`Dunamis token server running on port ${port}`);
});
