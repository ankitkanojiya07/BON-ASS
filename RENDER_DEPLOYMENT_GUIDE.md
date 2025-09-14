# Deploying BON Rewards Backend to Render

This guide will walk you through deploying your BON Rewards Backend to Render.com, a modern cloud platform for hosting web applications.

## Prerequisites

- [x] GitHub repository with your code (already done)
- [ ] MongoDB Atlas account (for cloud database)
- [ ] Render.com account (free tier available)

## Step 1: Set Up MongoDB Atlas (Cloud Database)

Since Render doesn't provide MongoDB hosting, you'll need to use MongoDB Atlas (free tier available).

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project called "BON Rewards"

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (free tier)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "bon-rewards-cluster")
5. Click "Create Cluster"

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and secure password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials
6. Add your database name at the end: `/bon-rewards`

Final connection string example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/bon-rewards?retryWrites=true&w=majority
```

## Step 2: Deploy to Render

### 2.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### 2.2 Create New Web Service
1. Click "New +" button in Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository: `ankitkanojiya07/BON-ASS`
4. Configure the service:

**Basic Settings:**
- **Name**: `bon-rewards-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `project` (if your code is in a subdirectory)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Pricing:**
- Select "Free" tier for testing (has limitations)
- Or "Starter" ($7/month) for production use

### 2.3 Set Environment Variables
In the Render dashboard, scroll down to "Environment Variables" and add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1.5 |

**Important**: Make sure your MongoDB URI is correct and includes the database name!

### 2.4 Deploy
1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your application (`npm start`)
3. Wait for deployment to complete (usually 2-5 minutes)

## Step 3: Verify Deployment

### 3.1 Check Service Status
1. In Render dashboard, check that your service shows "Live"
2. Click on your service URL (something like `https://bon-rewards-backend.onrender.com`)

### 3.2 Test API Endpoints
Test these endpoints in your browser or with curl:

**Health Check:**
```
GET https://your-app-name.onrender.com/api/health
```

**Welcome Endpoint:**
```
GET https://your-app-name.onrender.com/
```

**Create a User (using curl):**
```bash
curl -X POST https://your-app-name.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

## Step 4: Update Your Code (Optional)

### 4.1 Add Render-specific Improvements

You might want to add these improvements to your code:

**Enhanced CORS Configuration:**
```javascript
// In src/app.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

**Better Error Handling:**
```javascript
// In src/config/database.js
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      console.error('Please check your MONGODB_URI environment variable');
    }
    process.exit(1);
  }
};
```

## Step 5: Set Up Auto-Deploy (Optional)

Render can automatically deploy when you push to GitHub:

1. In your Render service settings
2. Enable "Auto-Deploy" 
3. Select branch: `main`
4. Now every push to main branch will trigger a new deployment

## Troubleshooting

### Common Issues:

**1. Application Not Starting**
- Check logs in Render dashboard
- Verify `npm start` command works locally
- Ensure all dependencies are in `package.json`

**2. Database Connection Errors**
- Verify MongoDB Atlas connection string
- Check MongoDB Atlas network access settings
- Ensure database user has correct permissions

**3. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies install successfully
- Review build logs in Render dashboard

**4. Free Tier Limitations**
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleeping takes 30+ seconds
- Consider upgrading to Starter plan for production

### Checking Logs:
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. Monitor real-time logs for errors

## Production Considerations

### Security:
- Use strong passwords for MongoDB Atlas
- Consider adding API authentication
- Set up proper CORS origins (not wildcard)
- Use HTTPS only (Render provides this automatically)

### Performance:
- Upgrade to paid Render plan for better performance
- Consider MongoDB Atlas paid tier for better database performance
- Add caching layer if needed
- Monitor application performance

### Monitoring:
- Set up uptime monitoring
- Monitor database performance in MongoDB Atlas
- Set up error tracking (e.g., Sentry)

## Support

If you encounter issues:
1. Check Render documentation: https://render.com/docs
2. Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
3. Review application logs in Render dashboard
4. Check GitHub repository issues

## Your Deployed Application

Once deployed successfully, your API will be available at:
```
https://your-app-name.onrender.com
```

All your API endpoints will work with this new URL:
- `POST https://your-app-name.onrender.com/api/users`
- `GET https://your-app-name.onrender.com/api/users/:id`
- `POST https://your-app-name.onrender.com/api/bills/:id/pay`
- And all other endpoints from your API documentation

Remember to update any frontend applications or API clients to use the new Render URL instead of `localhost:3000`.