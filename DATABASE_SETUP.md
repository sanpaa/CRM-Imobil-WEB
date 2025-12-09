# 🗄️ Database Setup Guide - Supabase Configuration

This guide will help you set up Supabase for the CRM Imobil application.

## 🔴 Current Status: Offline Mode

If you see these messages when starting the server:

```
⚠️  SUPABASE NOT CONFIGURED - RUNNING IN OFFLINE MODE
Database: ⚠️  OFFLINE MODE (read-only)
```

Or when trying to create/edit properties:

```
Database not available. Property cannot be created in offline mode. 
Please configure SUPABASE_URL and SUPABASE_KEY environment variables.
```

Or when uploading images:

```
Erro ao fazer upload das imagens. Continuando com URLs fornecidas.
```

**This means you're running in read-only mode.** Follow the steps below to enable full functionality.

---

## ✅ Step-by-Step Supabase Setup

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with GitHub, Google, or email

### 2. Create a New Project

1. Click **"New Project"**
2. Fill in project details:
   - **Name**: `crm-imobil` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to your location
3. Click **"Create new project"**
4. Wait 2-3 minutes for project setup

### 3. Get Your Credentials

1. Go to **Settings** (⚙️ icon in sidebar)
2. Click **"API"**
3. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### 4. Configure Environment Variables

1. In your project root, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update:
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Replace with YOUR actual values from step 3

### 5. Create the Database Table

1. In Supabase, go to **"Table Editor"**
2. Click **"Create a new table"**
3. Configure:
   - **Name**: `properties`
   - Enable **RLS (Row Level Security)**: ❌ Disable for now (or configure policies)
4. Add columns:

| Column Name | Type | Default | Extra |
|------------|------|---------|-------|
| id | uuid | gen_random_uuid() | Primary Key |
| title | text | - | - |
| description | text | - | - |
| type | text | - | - |
| price | numeric | - | - |
| bedrooms | int4 | 0 | - |
| bathrooms | int4 | 0 | - |
| area | numeric | - | - |
| parking | int4 | 0 | - |
| image_url | text | - | - |
| image_urls | text[] | - | - |
| street | text | - | - |
| neighborhood | text | - | - |
| city | text | - | - |
| state | text | - | - |
| zip_code | text | - | - |
| latitude | numeric | - | - |
| longitude | numeric | - | - |
| contact | text | - | - |
| featured | boolean | false | - |
| sold | boolean | false | - |
| created_at | timestamptz | now() | - |
| updated_at | timestamptz | now() | - |

5. Click **"Save"**

### 6. Create Storage Bucket for Images

1. In Supabase, go to **"Storage"**
2. Click **"Create a new bucket"**
3. Configure:
   - **Name**: `property-images` (EXACTLY this name!)
   - **Public bucket**: ✅ **YES** (very important!)
4. Click **"Create bucket"**

### 7. Configure Storage Policy (Optional - For Public Access)

1. Click on your `property-images` bucket
2. Go to **"Policies"**
3. Click **"New Policy"**
4. Create a policy for public access:
   - **Policy name**: `Public Access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **USING expression**: `true`
5. Repeat for `INSERT` operation if you want public uploads

### 8. Restart Your Server

```bash
npm run dev
```

You should now see:
```
✅ Supabase configured successfully
Database: ✅ Supabase connected
```

---

## 🧪 Testing Your Setup

### Test 1: Create a Property
1. Go to http://localhost:3000/admin/login
2. Login with admin credentials
3. Click **"Novo Imóvel"**
4. Fill the form and save
5. ✅ If successful, your database is working!

### Test 2: Upload an Image
1. In the property form, select an image file
2. Click save
3. ✅ If the image appears, your storage is working!

---

## 🔧 Troubleshooting

### Still getting "Database not available" error?

**Check:**
1. ✅ `.env` file exists in project root
2. ✅ `SUPABASE_URL` and `SUPABASE_KEY` are set correctly (no spaces)
3. ✅ Server was restarted after updating `.env`
4. ✅ Table `properties` exists in Supabase

**Verify with:**
```bash
# Check if .env exists
cat .env

# Restart server
npm run dev
```

### Image uploads failing?

**Check:**
1. ✅ Bucket named `property-images` exists
2. ✅ Bucket is set to **PUBLIC**
3. ✅ Storage policies allow public access
4. ✅ File size is under 5MB

### Connection errors?

**Check:**
1. ✅ Internet connection is working
2. ✅ Supabase project is active (not paused)
3. ✅ Credentials are correct (copy-paste to avoid typos)

---

## 💡 Alternative: Continue in Offline Mode

If you prefer not to use Supabase right now:

1. The app will work in **read-only mode**
2. You can browse existing properties from `data/properties.json`
3. You **cannot** create, edit, or delete properties
4. You **cannot** upload images

To enable full functionality later, follow steps 1-8 above.

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🆘 Need Help?

If you're still having issues:
1. Check the server console for detailed error messages
2. Verify your Supabase project is active
3. Double-check all credentials
4. Ensure the database table and storage bucket are created correctly

