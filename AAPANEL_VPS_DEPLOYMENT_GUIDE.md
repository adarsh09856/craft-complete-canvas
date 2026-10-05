# aaPanel VPS Production Deployment Guide: Golden Takin Holidays

This guide explains how to install and host **Golden Takin Holidays** directly inside aaPanel without any Docker complexity.

---

## 1. Database Credentials (Configured in aaPanel)

| Setting | Value |
| :--- | :--- |
| **Database Name** | `travelgold` |
| **Username** | `travelgold` |
| **Password** | `travelgold` |
| **Host** | `127.0.0.1` |
| **Port** | `5432` |
| **Connection URL** | `postgresql://travelgold:travelgold@127.0.0.1:5432/travelgold` |

---

## 2. Step 1: Clone Repository on your VPS

Connect via SSH as `root` to your server:

```bash
cd /www/wwwroot

# Clone the repository
git clone https://github.com/adarsh09856/craft-complete-canvas.git goldentakin
cd goldentakin
```

---

## 3. Step 2: Run the Automated Installer

Make executable and run:

```bash
chmod +x install.sh deploy.sh
./install.sh
```

### What this automatically does:
1. Writes the production `.env` with your `travelgold` database credentials.
2. Automatically imports the complete database schema and tour itineraries (`database/init.sql` & `database/seed.sql`) into the `travelgold` PostgreSQL database.
3. Installs dependencies and builds the standalone production server (`.output/server/index.mjs`).

---

## 4. Step 3: Add Website in aaPanel (30 Seconds)

1. Open your aaPanel Dashboard &rarr; **Website** &rarr; **Node project** tab.
2. Click **Add Node project**:
   - **Path**: `/www/wwwroot/goldentakin`
   - **Run Opt**: `node .output/server/index.mjs`
   - **Port**: `3001`
   - **Domain name**: Your domain (e.g., `goldentakinholidays.bt`)
3. Click **Submit**.
4. In the project settings &rarr; **SSL** tab &rarr; Enable **Let's Encrypt** and toggle **Force HTTPS**.

🎉 **Your travel portal is now live at `https://goldentakinholidays.bt`!**

---

## 5. How to Deploy Future Updates

Whenever you push updates to GitHub, simply run:

```bash
cd /www/wwwroot/goldentakin
./deploy.sh
```

This single command:
- Pulls the latest git commits.
- Builds the updated production bundle.
- Restarts your website with zero downtime.
