#!/bin/bash

echo "Updating and upgrading system..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing required packages..."
sudo apt-get install -y git

echo "Cloning the repository..."
sudo git clone https://github.com/riyapuri2005/FileBin.git /opt/filebin

echo "Fetching other scripts"
sudo chmod +x /opt/filebin/other/post-setup.sh
sudo /opt/filebin/other/post-setup.sh
