#!/bin/bash

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
sudo tee "$NGINX_CONF_PATH" > /dev/null < /opt/filebin/other/nginx.conf

echo "Setting up Python environment..."
sudo python3 -m venv /opt/filebin/backend/venv

sudo /opt/filebin/backend/venv/bin/pip install --upgrade pip
sudo /opt/filebin/backend/venv/bin/pip install -r requirements.txt

echo "Creating systemd service..."
sudo tee "$SYSTEMD_SERVICE_PATH" > /dev/null < /opt/filebin/other/filebin.service

echo "Enabling and starting the service..."
sudo systemctl daemon-reload
sudo systemctl enable filebin.service
sudo systemctl start filebin.service

echo "Restarting NGINX..."
sudo systemctl restart nginx
