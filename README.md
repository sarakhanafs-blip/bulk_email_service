# 🚀 Freight Project – Deployment & Setup Guide

This document explains how to set up and run the Freight Project on your infrastructure.

---

## 📦 1. Database Setup (on your server)

The database runs in a **Docker container** for portability.

### Steps:
1. Install **Docker** and **Docker Compose** on your server.  
   - [Install Docker](https://docs.docker.com/engine/install/)  
   - [Install Docker Compose](https://docs.docker.com/compose/install/)  

2. Copy the provided `docker-compose.yml` file to your server.

3. Start the database:
   ```bash
   docker-compose up -d
   ```

4. (Optional) Import the initial database schema/data:
   ```bash
   docker exec -i freight-db mysql -u root -p < dump.sql
   ```

5. Ensure the database port (`3306` for MySQL / `5432` for Postgres) is open **only for trusted IPs** (e.g., Vercel).

---

## 🌐 2. Application Deployment (Vercel)

The application frontend + backend APIs are deployed via **Vercel**.

### Steps:
1. Go to [Vercel](https://vercel.com/) and create an account (if not already).
2. Import the project repository from GitHub.
3. Configure **Environment Variables** in Vercel project settings:

   ```env
   DATABASE_URL="mysql://USER:PASSWORD@SERVER_IP:3306/DATABASE_NAME"
   SMTP_HOST="smtp.clientdomain.com"
   SMTP_PORT=587
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   EMAIL_FROM="noreply@clientdomain.com"
   ```

   Replace `USER`, `PASSWORD`, `SERVER_IP`, and `DATABASE_NAME` with your actual database details.

4. Deploy the project – Vercel will automatically build and serve the app.

---

## 🔄 3. Database Migrations

If the schema changes, run Prisma migrations:

```bash
npx prisma migrate deploy
```

Make sure your `.env` has the correct `DATABASE_URL` before running this.

---

## 📧 4. Email Configuration

The system uses your SMTP server to send emails. Ensure:
- The provided `SMTP_USER` and `SMTP_PASS` are correct.
- Outgoing mail is allowed from your server.
- SPF/DKIM/DMARC records are properly configured for your domain.

---

## 🛠 5. Maintenance

- **Updating the app**: Push new code to GitHub → Vercel redeploys automatically.
- **Updating the DB**: Database runs on your server; data remains persistent even if the app is redeployed.
- **Logs**: Check Vercel dashboard for app logs. Use `docker logs freight-db` for DB logs.

---

## 📂 Deliverables You Have
- `docker-compose.yml` → To run the database.
- `dump.sql` → Initial database schema/data.
- `.env.example` → Sample environment file.
- GitHub repo → Application source code.

---

## ✅ That’s it!
Your system will now run with:
- **Database** on your server
- **Application** on Vercel
- **Emails** via your SMTP provider
