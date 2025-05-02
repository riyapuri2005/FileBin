#!/bin/bash

CLONE_DIR="/opt/filebin"
NGINX_CONF_PATH="/etc/nginx/nginx.conf"
SYSTEMD_SERVICE_PATH="/etc/systemd/system/filebin.service"

echo "Updating and upgrading system..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing required packages..."
sudo apt-get install -y nginx python3-pip python3-venv ufw

echo "Configuring UFW firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw enable
sudo ufw reload

echo "Creating nginx.conf"
sudo tee $NGINX_CONF_PATH > /dev/null <<EOL
user filebin-server;
worker_processes 2;
worker_rlimit_nofile 2048;


events {
    use epoll;
    worker_connections 25000;
    multi_accept on;
}


http {
    default_type application/octet-stream;

    keepalive_timeout 300;
    keepalive_requests 1000;

    server_tokens off;

    aio threads;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    client_body_buffer_size 128k;
    large_client_header_buffers 4 16k;
    client_max_body_size 1G;

    reset_timedout_connection on;

    gzip off;

    include /etc/nginx/mime.types;
	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;

    server {
        listen 80;
        server_name _;

        add_header X-Frame-Options SAMEORIGIN always;
        add_header X-Content-Type-Options nosniff always;
        add_header Referrer-Policy no-referrer-when-downgrade;

        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, X-Requested-With, Accept";


        location /api {
            proxy_pass http://127.0.0.1:80;
            proxy_http_version 1.1;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_read_timeout 300s;
            proxy_send_timeout 300s;

            proxy_buffering on;
            proxy_redirect off;

            if ($is_valid_request = 0) {
                return 403;
            }
            if ($request_method = OPTIONS) {
                add_header Content-Length 0;
                add_header Content-Type text/plain;
                return 204;
            }
        }

        location / {
            root /;
            index index.html;
        }
    }
}
EOL

echo "Setting up Python environment..."
cd $CLONE_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Creating systemd service..."
sudo tee $SYSTEMD_SERVICE_PATH > /dev/null <<EOL
[Unit]
Description=FastAPI App using Gunicorn and Uvicorn
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=$CLONE_DIR/backend
ExecStart=$CLONE_DIR/backend/venv/bin/gunicorn -w 2 -k uvicorn.workers.UvicornWorker server:base_app
Restart=always
Environment="PATH=$CLONE_DIR/backend/venv/bin"

[Install]
WantedBy=multi-user.target
EOL

echo "Enabling and starting the service..."
sudo systemctl daemon-reload
sudo systemctl enable filebin.service
sudo systemctl start filebin.service

echo "Restarting NGINX..."
sudo systemctl restart nginx
