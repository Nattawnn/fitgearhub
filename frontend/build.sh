#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
npm ci

# Build the app
npm run build

# Optional: Copy any static assets you need in production
# cp -a public/. .next/static/ 