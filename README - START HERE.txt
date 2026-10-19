DUNAMIS LIFE MINISTRIES — V6.0.1 STREAMING FIX

This build fixes the LiveKit token error: Cannot convert TrackSource camera to string.

DUNAMIS LIFE MINISTRIES — STREAMING SYSTEM V6

WHAT V6 ADDS
- Real WebRTC room connection using LiveKit.
- Admin broadcaster can publish phone/computer camera + microphone.
- Members are subscribe-only viewers: they do not publish camera/mic.
- Live video plays inside the Dunamis Live page.
- Bible, service notebook, Amen and prayer tools remain on the same page.
- Viewer connection count.

FIRST SETUP
1. Create a LiveKit Cloud project (or deploy your own LiveKit server).
2. Double-click RUN APP.bat once. It creates and opens .env.
3. Put your LIVEKIT_URL, LIVEKIT_API_KEY and LIVEKIT_API_SECRET into .env and save.
4. Double-click RUN APP.bat again.

IMPORTANT FOR PHONE TESTING
Camera/microphone access on a phone browser normally requires HTTPS. localhost is trusted on the PC itself, but another phone opening your PC's LAN IP is not a production deployment. To test across real phones, deploy the frontend + token server behind HTTPS.

SECURITY
The LiveKit API secret stays in server.mjs/.env and is never sent to the browser. Viewer tokens cannot publish. The demo app's current Admin PIN is still local/demo access; before public launch, connect proper server-side administrator authentication so only authorized media-team users can request broadcaster tokens.

ROOM
Default room: dunamis-main-service
