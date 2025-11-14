# Meta (Facebook) Ad Account Balance Viewer

A Next.js dashboard application that displays Meta (Facebook) ad accounts and their balances using the Meta Graph API.

## Setup Instructions

### 1. Clone and Install

```bash
git clone ...
cd fb-balance-viewer
npm install
```

### 2. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting Your Meta Access Token

### Step 1: Create a Meta Developer App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app → "Business" type
3. Add the "Marketing API" product
4. Use the Graph API Explorer to generate tokens for your app (step 2)

### Step 2: Graph API Explorer

1. Go to [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your Meta app from the dropdown
3. User or Page: select user token
4. Add required permissions:
   - `ads_read` - Read ad account data
   - `ads_management` - Manage ad accounts
5. Click "Generate Access Token" and Copy the generated token
6. Paste it into the app's token input field

## API Endpoints

### POST `/api/validate-token`
Validates a Meta access token.

**Request:**
```json
{
  "token": "your_access_token_here"
}
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "name": "User Name"
  }
}
```

### GET `/api/accounts`
Fetches ad accounts for the authenticated user.

**Headers:**
```
Authorization: Bearer your_access_token_here
```

**Response:**
```json
{
  "data": [
    {
      "id": "account_id",
      "name": "Account Name",
      "currency": "USD",
      "balance": 12345,
      "account_status": 1,
      "timezone_name": "America/New_York"
    }
  ]
}
```

## Technical Details

### Tech Stack
- **Next.js 16** - React framework with App Router
- **React 19** - Frontend library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling and responsive design

### Meta API Integration
- Uses Graph API v24.0
- Fetches `/me/adaccounts` endpoint
- Fields: `name,currency,balance,account_status,timezone_name`

## Security Considerations

- Tokens are stored client-side with basic encryption
- No server-side storage of tokens

## Troubleshooting

### Common Issues

1. **"Invalid Token" Error**
   - Verify token has correct permissions (`ads_read`, `ads_management`)
   - Check if token has expired
   - Ensure Meta app has Marketing API enabled

2. **"No Accounts Found"**
   - Verify the user has ad accounts associated
   - Check if user has proper access to ad accounts

## Support

For issues related to:
- **Meta API**: Check [Meta Developer Docs](https://developers.facebook.com/docs/marketing-api/)
- **Next.js**: See [Next.js Documentation](https://nextjs.org/docs)
