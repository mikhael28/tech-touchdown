# WebRTC Server Deployment Guide

## Current Issue: "Disconnected" Message

The "disconnected" message you're seeing is due to **WebRTC requiring HTTPS in production environments**. Your backend is working correctly, but browsers block WebRTC connections over HTTP for security reasons.

## Quick Fix for Local Testing

### Option 1: Use ngrok for HTTPS (Recommended)

1. **Start your backend server**:

   ```bash
   cd node-service
   npm run dev
   ```

2. **In a new terminal, create HTTPS tunnel**:

   ```bash
   ngrok http 3001
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update TwiML Application**:

   - Go to [Twilio Console > Voice > TwiML Apps](https://console.twilio.com/us1/develop/voice/manage/twiml-apps)
   - Click on your "Tech Touchdown Audio Chat" app
   - Update **Voice Request URL** to: `https://abc123.ngrok.io/api/twiml/voice`
   - Save changes

5. **Update frontend environment**:
   Create `.env.local` in `react-vite` directory:

   ```bash
   VITE_BACKEND_URL=https://abc123.ngrok.io
   ```

6. **Restart your frontend**:
   ```bash
   cd react-vite
   npm run dev
   ```

## Production Deployment Options

### Option 1: Deploy to Vercel (Recommended)

1. **Deploy Backend to Vercel**:

   ```bash
   cd node-service
   npx vercel --prod
   ```

2. **Deploy Frontend to Vercel**:

   ```bash
   cd react-vite
   npx vercel --prod
   ```

3. **Update TwiML Application URLs**:

   - Voice Request URL: `https://your-backend.vercel.app/api/twiml/voice`
   - Status Callback URL: `https://your-backend.vercel.app/api/twiml/conference-status`

4. **Set Environment Variables in Vercel**:
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all Twilio variables from your `.env` file

### Option 2: Deploy to Railway

1. **Connect your repository to Railway**
2. **Set environment variables** in Railway dashboard
3. **Update TwiML URLs** to your Railway domain

### Option 3: Deploy to DigitalOcean App Platform

1. **Create new app** from GitHub repository
2. **Configure build settings**:
   - Backend: `node-service` directory
   - Frontend: `react-vite` directory
3. **Set environment variables**
4. **Update TwiML URLs**

## Environment Configuration

### Backend (.env)

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=your_api_key_sid_here
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=your_twiml_app_sid_here

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local)

```bash
# Backend API URL
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Testing Your Deployment

1. **Test Backend Health**:

   ```bash
   curl https://your-backend-domain.com/health
   ```

2. **Test Access Token Generation**:

   ```bash
   curl -X POST https://your-backend-domain.com/api/twilio/access-token \
     -H "Content-Type: application/json" \
     -d '{"identity": "test-user", "roomName": "test-room"}'
   ```

3. **Test TwiML Endpoint**:
   ```bash
   curl -X POST https://your-backend-domain.com/api/twiml/voice \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "To=conference:test-room"
   ```

## Troubleshooting

### Common Issues

1. **"Missing required Twilio configuration"**

   - Check all environment variables are set
   - Restart your server after updating .env

2. **"Device error" or "Call error"**

   - Verify TwiML Application URL is accessible
   - Check browser microphone permissions
   - Ensure HTTPS is working

3. **CORS errors**
   - Update FRONTEND_URL in backend .env
   - Check CORS configuration in server.ts

### Browser Requirements

- **HTTPS Required**: WebRTC requires HTTPS in production
- **Microphone Permission**: Users must grant microphone access
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **Token Expiry**: Access tokens expire after 1 hour
3. **Domain Validation**: Consider implementing domain validation
4. **Rate Limiting**: Implement rate limiting on token endpoint

## Monitoring and Scaling

### Twilio Console Monitoring

- Monitor usage in [Twilio Console](https://console.twilio.com/)
- Check call logs and errors
- Monitor API usage and costs

### Scaling Considerations

- Free tier: 2 concurrent calls, $15 credit
- Upgrade to paid plan for higher usage
- Consider implementing user limits per conference

## Next Steps

1. **Choose deployment option** (Vercel recommended)
2. **Deploy backend** with environment variables
3. **Deploy frontend** with backend URL
4. **Update TwiML Application** URLs
5. **Test WebRTC functionality**
6. **Monitor usage** and scale as needed

Your WebRTC server is already properly configured - it just needs to be deployed with HTTPS to work correctly!
