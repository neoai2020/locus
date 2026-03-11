# Deploying Locus to DigitalOcean VPS

## Prerequisites
- DigitalOcean Droplet (Ubuntu 22.04 recommended)
- Domain: locusaiaccess.com pointed to your droplet IP
- Node.js 18+ installed on the server

## Step 1: SSH into your VPS

```bash
ssh root@your-droplet-ip
```

## Step 2: Install Node.js (if not installed)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Step 3: Install PM2 (Process Manager)

```bash
npm install -g pm2
```

## Step 4: Install Nginx

```bash
sudo apt update
sudo apt install nginx -y
```

## Step 5: Clone/Upload Your Project

```bash
cd /var/www
git clone your-repo-url locus
# OR upload via scp/sftp

cd locus
npm install
```

## Step 6: Set Up Environment Variables

Create `.env.local` file:

```bash
nano .env.local
```

Add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key
```

## Step 7: Build the Application

```bash
npm run build
```

## Step 8: Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 9: Configure Nginx

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/locusaiaccess.com
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name locusaiaccess.com www.locusaiaccess.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/locusaiaccess.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 10: Set Up SSL with Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d locusaiaccess.com -d www.locusaiaccess.com
```

## Step 11: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Quick Commands

### View logs
```bash
pm2 logs locus
```

### Restart app
```bash
pm2 restart locus
```

### Update deployment
```bash
cd /var/www/locus
git pull
npm install
npm run build
pm2 restart locus
```

---

## Domain DNS Settings

Point your domain to your DigitalOcean droplet:

| Type | Name | Value |
|------|------|-------|
| A | @ | your-droplet-ip |
| A | www | your-droplet-ip |

---

## Important URLs

### Main Pages
- Landing: https://locusaiaccess.com
- Login: https://locusaiaccess.com/login
- Signup: https://locusaiaccess.com/signup
- Dashboard: https://locusaiaccess.com/dashboard

### Upsell Unlock Pages (Secret Links)
- 10X Mode: https://locusaiaccess.com/unlock/10x
- Infinite: https://locusaiaccess.com/unlock/infinite
- Automation: https://locusaiaccess.com/unlock/automation
- Done-For-You: https://locusaiaccess.com/unlock/dfy

---

## Troubleshooting

### App not starting
```bash
pm2 logs locus --lines 100
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate renewal
```bash
sudo certbot renew --dry-run
```
