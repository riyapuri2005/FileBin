## System updates ##
sudo apt-get update -y
sudo apt-get upgrade -y


## Setup UFW ##
sudo apt-get install ufw -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw reload


## NGINX ##
sudo apt-get install nginx -y
######### write changes to nginx.conf



## Git Clone backend







systemctl daemon-reload





