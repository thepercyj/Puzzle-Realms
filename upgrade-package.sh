#!/bin/bash

set -e

echo "Upgrading pip..."
python -m pip install --upgrade pip

echo "Installing pip-review..."
pip install --upgrade pip-review

echo "Upgrading all installed packages..."
pip-review --auto

echo "Updating requirements.txt..."
pip freeze > requirements.txt

echo "Pulling latest changes from git..."
git pull origin main

echo "Adding changes..."
git add .

echo "Committing changes..."
git commit -m "upgrade pip packages to latest release" || echo "No changes to commit"

echo "Pushing changes..."
git push

echo "Done."
