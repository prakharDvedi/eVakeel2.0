#!/bin/bash

# eVakeel Azure VM Setup Script
# Installs Node.js, Python 3.10, Nginx, PM2, and configures the environment.

set -e  # Exit on error

echo ">>> Updating System..."
sudo apt update && sudo apt upgrade -y

echo ">>> Installing Dependencies (Python, Nginx, Git, Build Tools)..."
sudo apt install -y python3 python3-pip python3-venv nginx git curl build-essential libssl-dev

echo ">>> Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo ">>> Installing Global Node Packages (PM2)..."
sudo npm install -g pm2

echo ">>> Configuring Nginx Reverse Proxy..."
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo tee /etc/nginx/sites-available/evakeel > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    # Frontend (Static Files)
    location / {
        root /home/azureuser/eVakeel/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API (Node.js running on Port 5050)
    location /api {
        proxy_pass http://localhost:5050;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable config
sudo ln -s /etc/nginx/sites-available/evakeel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo ">>> Setup Complete!"
echo "Next Steps:"
echo "1. Clone your repo to /home/azureuser/eVakeel"
echo "2. Backend: npm install, set .env, and start with PM2"
echo "3. Python: pip install -r requirements.txt and start with PM2"
echo "4. Frontend: npm install && npm run build"
