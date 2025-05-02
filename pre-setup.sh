#!/bin/bash

REPO_URL="https://github.com/riyapuri2005/FileBin.git"
CLONE_DIR="/opt/filebin"

echo "Updating and upgrading system..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing required packages..."
sudo apt-get install -y git

echo "Cloning the repository..."
sudo git clone $REPO_URL $CLONE_DIR

echo "Fetching rest scripts"
cd $CLONE_DIR
sudo chmod +x setup.sh
sudo ./setup.sh
