# MongoDB Integration Setup Guide

## 🎯 What's New?

Your QR Tree app now has **automatic syncing** between:
- **IndexedDB** (local, offline storage)
- **MongoDB** (cloud database)

### How It Works (Transparent to User):

1. **Adding a Tree:**
   - Saves to IndexedDB immediately ✅
   - If online: Auto-syncs to MongoDB in background 🔄
   - If offline: Will sync when back online ⏳

2. **Viewing a Tree:**
   - Checks IndexedDB first (fast, works offline) 🏃
   - If not found + online: Fetches from MongoDB 🌐
   - Auto-saves MongoDB data to IndexedDB for offline use 💾

3. **Updating Tree (QR code):**
   - Updates IndexedDB ✅
   - If online: Auto-updates MongoDB 🔄

## 🚀 Setup Instructions

### 1. Create MongoDB Atlas Account (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a new cluster (M0 Free tier)
4. Wait for cluster to deploy (~5 minutes)

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `myFirstDatabase` with `qr_tree`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/qr_tree?retryWrites=true&w=majority
```

### 3. Add to Environment Variables

**Local Development:**
1. Open `.env.local`
2. Add your MongoDB URI:
```env
MONGODB_URI=mongodb+srv://your-connection-string-here
```

**Vercel Deployment:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add new variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB connection string
   - Save
4. Redeploy: `git push origin main`

### 4. Setup Network Access

In MongoDB Atlas:
1. Security → Network Access
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, limit to specific IPs

### 5. Test the Integration

```bash
npm run build
npm start
```

Then:
1. Add a tree → Check console for "[Sync] Saved to MongoDB"
2. Check MongoDB Atlas → Browse Collections → See your tree
3. Clear IndexedDB (DevTools → Application → IndexedDB → Delete)
4. Scan QR code → Should fetch from MongoDB and save locally

## 📋 API Routes Created

### GET /api/trees
- Fetches all trees from MongoDB
- Returns: `{ success: true, data: Tree[] }`

### POST /api/trees
- Creates new tree in MongoDB
- Auto-assigns tree_id
- Returns: `{ success: true, data: Tree }`

### GET /api/trees/[id]
- Fetches single tree by tree_id
- Returns: `{ success: true, data: Tree }`

### PUT /api/trees/[id]
- Updates tree in MongoDB
- Returns: `{ success: true, data: Tree }`

### DELETE /api/trees/[id]
- Deletes tree from MongoDB
- Returns: `{ success: true, data: Tree }`

## 🔄 Sync Logic

### Scenario 1: Add Tree Online
```
User adds tree → IndexedDB ✅ → MongoDB ✅ (background)
```

### Scenario 2: Add Tree Offline
```
User adds tree → IndexedDB ✅ → MongoDB ⏳ (pending)
Goes online → Auto-syncs to MongoDB ✅
```

### Scenario 3: Scan QR Code (Tree in Local)
```
Scan QR → IndexedDB found ✅ → Show tree
Background → Update MongoDB ✅
```

### Scenario 4: Scan QR Code (Not in Local, Online)
```
Scan QR → IndexedDB empty → Fetch MongoDB ✅
Save to IndexedDB ✅ → Show tree (works offline next time)
```

### Scenario 5: Scan QR Code (Not in Local, Offline)
```
Scan QR → IndexedDB empty → MongoDB unavailable
Show error: "Add tree locally first"
```

## 🎨 Console Logs

Watch the magic happen:
```
[Sync] Looking for tree with ID: 1
[Sync] Total trees in IndexedDB: 3
[Sync] Found in IndexedDB: Banyan Tree
[Sync] Background sync to MongoDB: Success
```

Or:
```
[Sync] Not in IndexedDB, checking MongoDB...
[Sync] Found in MongoDB, saving to IndexedDB: Neem Tree
```

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Check MONGODB_URI in .env.local
- Verify password in connection string
- Check Network Access in Atlas

### "Tree not syncing to MongoDB"
- Open browser console
- Look for [Sync] logs
- Check if online: `navigator.onLine`

### "Tree found in MongoDB but not showing"
- Clear cache and reload
- Check IndexedDB: DevTools → Application → IndexedDB
- Verify tree_id matches

## 📱 Mobile Testing

1. **Online Test:**
   - Add tree on mobile
   - Check MongoDB Atlas → Browse Collections
   - Should see tree there

2. **Offline Test:**
   - Turn on airplane mode
   - Add tree → Saves to IndexedDB
   - Turn off airplane mode
   - Watch console for sync

3. **Cross-Device Test:**
   - Add tree on Device A
   - Scan QR on Device B (online)
   - Should fetch from MongoDB and work offline after

## 🎯 Benefits

✅ **Offline First:** Works without internet
✅ **Auto-Sync:** No user action needed
✅ **Cross-Device:** Share trees via MongoDB
✅ **Fast:** IndexedDB cache for instant loading
✅ **Reliable:** Falls back gracefully
✅ **Transparent:** User doesn't see the complexity

## 🔐 Security Notes

- Connection string contains password - keep in .env.local
- Never commit .env.local to git (already in .gitignore)
- Use environment variables in Vercel
- Consider enabling MongoDB authentication for production

## 📊 Files Created

- `lib/mongodb.ts` - Database connection handler
- `models/Tree.ts` - Mongoose schema
- `app/api/trees/route.ts` - GET all, POST new
- `app/api/trees/[id]/route.ts` - GET, PUT, DELETE single
- `utils/syncService.ts` - Sync helper functions (optional advanced use)

## 🚀 Deploy to Vercel

```bash
# Add MongoDB URI to Vercel
git add .
git commit -m "Add MongoDB sync"
git push origin main
```

Then in Vercel:
1. Project Settings → Environment Variables
2. Add `MONGODB_URI`
3. Redeploy

Your app now syncs across all devices! 🎉
