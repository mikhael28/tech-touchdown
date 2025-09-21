# Twilio WebRTC Audio Chat Setup Guide

This guide will walk you through setting up Twilio's Voice API for the WebRTC audio chat integration in your Tech Touchdown application.

## Prerequisites

- A Twilio account (free tier is sufficient for development)
- Node.js and npm installed
- Your Tech Touchdown application setup

## Step 1: Create a Twilio Account

1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your phone number when prompted
4. Complete the account verification process

## Step 2: Get Your Account Credentials

1. Navigate to the [Twilio Console Dashboard](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token** in the dashboard
3. Copy these values - you'll need them for environment variables

## Step 3: Create API Key and Secret

1. In the Twilio Console, navigate to **Settings** > **API Keys**
2. Click **Create API Key**
3. Choose **Standard** as the key type
4. Give it a friendly name (e.g., "Tech Touchdown Voice Chat")
5. Copy the **SID** (this is your API Key) and **Secret** immediately
   - ⚠️ **Important**: The secret is only shown once, so save it now!

## Step 4: Create a TwiML Application

1. Navigate to **Develop** > **Voice** > **TwiML Apps**
2. Click **Create new TwiML App**
3. Fill in the details:
   - **Friendly Name**: `Tech Touchdown Audio Chat`
   - **Voice Request URL**: `https://your-domain.com/api/twiml/voice`
     - For local development: `http://localhost:3001/api/twiml/voice`
     - For production: Replace with your actual domain
   - **Voice Request Method**: `HTTP POST`
   - **Status Callback URL**: `https://your-domain.com/api/twiml/conference-status` (optional)
4. Click **Save**
5. Copy the **Application SID** - you'll need this for environment variables

## Step 5: Configure Environment Variables

Create or update your `.env` file in the `node-service` directory with the following variables:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_API_KEY=your_api_key_sid_here
TWILIO_API_SECRET=your_api_secret_here
TWILIO_TWIML_APP_SID=your_twiml_app_sid_here

# Existing environment variables...
# PORT=3001
# FRONTEND_URL=http://localhost:3000
# ... other variables
```

### Environment Variable Descriptions

- **TWILIO_ACCOUNT_SID**: Your main Twilio account identifier
- **TWILIO_AUTH_TOKEN**: Your account's authentication token
- **TWILIO_API_KEY**: The API Key SID you created
- **TWILIO_API_SECRET**: The API Key Secret you created
- **TWILIO_TWIML_APP_SID**: The TwiML Application SID for voice calls

## Step 6: Update TwiML Application URLs (For Production)

When deploying to production, update your TwiML Application URLs:

1. Go back to **Develop** > **Voice** > **TwiML Apps**
2. Click on your "Tech Touchdown Audio Chat" application
3. Update the URLs to your production domain:
   - **Voice Request URL**: `https://your-production-domain.com/api/twiml/voice`
   - **Status Callback URL**: `https://your-production-domain.com/api/twiml/conference-status`
4. Save the changes

## Step 7: Test Your Setup

1. Start your backend server:

   ```bash
   cd node-service
   npm run dev
   ```

2. Start your frontend:

   ```bash
   cd react-vite
   npm run dev
   ```

3. Navigate to a game chat in your application
4. Try joining the voice chat - you should see the connection status change to "Connected"

## Troubleshooting

### Common Issues

1. **"Missing required Twilio configuration" error**

   - Check that all environment variables are set correctly
   - Restart your server after updating `.env` file

2. **"Device error" or "Call error" messages**

   - Verify your TwiML Application URL is accessible
   - Check browser permissions for microphone access
   - Ensure you're using HTTPS in production (required for WebRTC)

3. **Access token errors**
   - Verify your API Key and Secret are correct
   - Check that your Account SID matches your account

### Browser Requirements

- **HTTPS Required**: WebRTC requires HTTPS in production
- **Microphone Permission**: Users must grant microphone access
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

### Local Development with HTTPS

For local HTTPS development (recommended for testing):

1. Use tools like `ngrok` to create a secure tunnel:

   ```bash
   ngrok http 3001
   ```

2. Update your TwiML Application URL to use the ngrok HTTPS URL

## Security Considerations

1. **Environment Variables**: Never commit your `.env` file to version control
2. **Token Expiry**: Access tokens expire after 1 hour by default
3. **Domain Validation**: Consider implementing domain validation for production
4. **Rate Limiting**: Implement rate limiting on your token endpoint

## Production Deployment Checklist

- [ ] All environment variables configured on your server
- [ ] TwiML Application URLs updated to production domain
- [ ] HTTPS certificate installed and working
- [ ] Firewall rules allow WebRTC traffic (UDP ports 10000-20000)
- [ ] Domain validation implemented (optional but recommended)

## Usage Limits

### Free Tier Limits (as of 2025)

- **Voice Minutes**: $15 credit (approximately 150 minutes in the US)
- **Concurrent Calls**: Up to 2 concurrent calls
- **TwiML Applications**: Unlimited

### Scaling Considerations

- Upgrade to a paid plan for higher usage
- Consider implementing user limits per conference
- Monitor usage via Twilio Console

## Support

- **Twilio Documentation**: [https://www.twilio.com/docs/voice](https://www.twilio.com/docs/voice)
- **Twilio Console**: [https://console.twilio.com/](https://console.twilio.com/)
- **Twilio Support**: Available through the console for paid accounts

## API Endpoints Created

Your application now includes these new endpoints:

- `POST /api/twilio/access-token` - Generate access tokens for clients
- `POST /api/twilio/conference/join` - Join a specific conference room
- `POST /api/twiml/voice` - TwiML endpoint for voice calls
- `POST /api/twiml/conference-status` - Conference status callbacks
- `GET /api/twiml/health` - Health check for TwiML endpoints
