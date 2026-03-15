# HireBoard

A production-grade job board platform built with modern web technologies.

## Features
- JWT authentication with refresh token rotation
- Full-text job search powered by Elasticsearch
- Real-time notifications via WebSockets
- Employer subscriptions via Stripe
- Async email delivery via Kafka + BullMQ

## Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS
- **Backend:** Node.js, Express
- **Databases:** PostgreSQL, Redis, Elasticsearch
- **Messaging:** Kafka, BullMQ
- **Payments:** Stripe
- **Real-time:** Socket.io

## Running locally
\`\`\`bash
docker-compose up -d     # start infrastructure
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
\`\`\`