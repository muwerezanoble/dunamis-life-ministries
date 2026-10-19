import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AccessToken } from 'livekit-server-sdk';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req,res) => res.json({ok:true, configured:Boolean(process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET)}));

app.post('/api/token', async (req,res) => {
  try {
    const { identity, role='viewer', roomName='dunamis-main-service' } = req.body || {};
    if (!identity) return res.status(400).json({error:'Missing participant identity.'});
    const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, ADMIN_STREAM_KEY } = process.env;
    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) return res.status(503).json({error:'LiveKit is not configured. Add LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET to .env.'});

    // Production note: broadcaster tokens must be protected by your real admin authentication.
    // Optional ADMIN_STREAM_KEY can be enforced when a production admin login is connected.
    const broadcaster = role === 'broadcaster';
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity, name: broadcaster ? 'Dunamis Media Team' : 'Dunamis Member', ttl: '6h' });
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: broadcaster,
      canSubscribe: true,
      canPublishData: broadcaster,
    });
    const token = await at.toJwt();
    res.json({ token, serverUrl: LIVEKIT_URL, roomName });
  } catch (e) {
    console.error(e);
    res.status(500).json({error:'Could not create streaming token.'});
  }
});

const port = Number(process.env.TOKEN_SERVER_PORT || 3001);
app.listen(port, () => console.log(`Dunamis token server running on http://localhost:${port}`));
