Good decision.

We’ll make it:

• Clean
• Professional
• Around ~150 lines
• Not bloated
• Interview-ready

You can copy this directly into `README.md`.

---

# 🔖 Markd — Smart Bookmark Manager

A secure, real-time bookmark manager built with **Next.js (App Router)** and **Supabase**.

This project demonstrates authentication, database security using Row Level Security (RLS), and real-time synchronization across sessions.

---

## 🌐 Live Demo

(Add your Vercel deployment link here)

```
https://your-vercel-url.vercel.app
```

---

## 🛠 Tech Stack

### Frontend

* Next.js 14 (App Router)
* React
* TypeScript
* Tailwind CSS

### Backend (Supabase)

* PostgreSQL
* Google OAuth Authentication
* Row Level Security (RLS)
* Realtime Subscriptions

### Deployment

* Vercel

---

## ✨ Features

* 🔐 Login with Google (OAuth)
* 🧑 Private bookmarks per user
* ➕ Add bookmarks (title + URL)
* ❌ Delete bookmarks
* ⚡ Real-time sync across tabs
* 🛡 Protected dashboard route
* 🌙 Clean responsive UI (Tailwind)

---

## 🔐 Authentication Flow

Authentication is handled using Supabase’s built-in OAuth integration.

### Login

```ts
supabase.auth.signInWithOAuth({
  provider: "google"
})
```

### Flow

1. User clicks **Login with Google**
2. Supabase redirects to Google OAuth
3. Google authenticates the user
4. Supabase handles the callback automatically
5. Session is stored securely
6. Dashboard checks session using:

```ts
supabase.auth.getUser()
```

No custom OAuth callback route was created. Supabase manages it internally.

---

## 🛡 Protected Dashboard

Route protection is implemented client-side:

```ts
const { data } = await supabase.auth.getUser()

if (!data.user) {
  router.push("/")
}
```

Only authenticated users can access the dashboard.

---

## 🗄 Database Design

**Table:** `bookmarks`

| Column     | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | UUID (PK) | Bookmark ID        |
| user_id    | UUID      | Owner (auth.users) |
| title      | TEXT      | Bookmark title     |
| url        | TEXT      | Bookmark URL       |
| created_at | TIMESTAMP | Created time       |

---

## 🔒 Row Level Security (RLS)

RLS is enabled on the `bookmarks` table.

### Policies

* SELECT → `auth.uid() = user_id`
* INSERT → `auth.uid() = user_id`
* DELETE → `auth.uid() = user_id`

### Why This Matters

* Users can only access their own data
* Direct API manipulation cannot bypass security
* Security enforced at database level

---

## ⚡ Realtime Implementation

Realtime replication is enabled for the `bookmarks` table.

When:

* A bookmark is added
* A bookmark is deleted

All active sessions update automatically without refresh.

Tested using two browser tabs.

---

## 🚀 Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Shreyansh0shah/smart-bookmark-app



### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create Environment File

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧱 Supabase Setup

### Create Table

```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enable RLS

```sql
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
```

### Policies

```sql
CREATE POLICY "Users can select own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);
```

### Enable Realtime

Supabase Dashboard → Database → Replication → Enable for `bookmarks`.

---

## 🔑 Google OAuth Setup

1. Create OAuth client in Google Cloud
2. Add redirect URI:

```
https://your-project-id.supabase.co/auth/v1/callback
```

3. Add Client ID & Secret in Supabase → Auth → Providers → Google
4. Set Site URL in Supabase settings

---

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

After deployment:

* Update redirect URLs in Google Cloud
* Update Site URL in Supabase

---

## 🧠 Key Learnings

* Implemented OAuth authentication
* Enforced database-level security using RLS
* Built real-time synchronization
* Protected client-side routes
* Deployed production-ready Next.js app

---

## 👨‍💻 Author

**Shreyansh Shah**

---

## 🏁 Summary

This project demonstrates:

* Modern authentication flow
* Secure multi-user data isolation
* Real-time updates
* Full-stack deployment workflow

Built using Next.js and Supabase with focus on security and scalability.

---

✅ Clean
✅ Professional
✅ ~150 lines
✅ Not overloaded

Now tell me:

Do we push to GitHub now?
