# 🛡️ decentratelimiter

A blazing-fast, distributed API gateway service combining **IP-based rate limiting** with **Redis Pub/Sub messaging**, designed for **decentralized microservices** and horizontally scaled environments.

> Built using **Node.js**, **Express**, and **Redis** — this service acts as a smart throttle and real-time event broadcaster across multiple server nodes.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Redis](https://img.shields.io/badge/Redis-PubSub-red?logo=redis)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/build-stable-brightgreen)

---

## 🚀 Features

- 🔁 **Decentralized** Pub/Sub architecture using Redis
- 🔐 **IP-based rate limiting** with configurable expiry windows
- 🌍 Supports multiple instances & ports (for distributed deployment)
- 📡 Real-time event broadcasting using Redis channels
- 💨 No external state dependencies (Redis handles sync)
- ☁️ Compatible with Redis Cloud, Render, EC2, and more

---

## 🧱 Tech Stack

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [ioredis](https://github.com/luin/ioredis)
- [Redis Pub/Sub](https://redis.io/docs/interact/pubsub/)
- Dummy external API: [https://dummyjson.com/users](https://dummyjson.com/users)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/decentratelimiter.git
cd decentratelimiter
```
### 2. Install dependencies
```bash
npm install

```
### 3. Configure Redis
In server.js:
```bash
const redis = new Redis('redis://default:<password>@<host>:<port>');

```
Or via environment variable:
```bash
REDIS_URL=redis://default:<password>@<host>:<port> node server.js

```
---
### 🏃 Running the App
Single Instance
```bash
node server.js


```
Multiple Distributed Nodes
```bash
PORT=3001 node server.js
PORT=3002 node server.js
PORT=3003 node server.js

```
All instances share the same Redis Pub/Sub channel and stay in sync.

🌐 API Usage
---
Endpoint
```bash
PORT=3001 node server.js
PORT=3002 node server.js
PORT=3003 node server.js

```
Fetches a user from dummy API

Applies Redis-based IP rate limit (default: 15 seconds)

Publishes a USER_FETCHED event to Redis channel

Example Request
```bash
curl http://localhost:3000/1


```
Success Response
```bash
Emily from API
```
Redis Message Broadcasted
```bash
{
  "event": "USER_FETCHED",
  "id": "1",
  "name": "Emily",
  "ip": "::1"
}

```
If Rate Limit Exceeded
```bash
{
  "error": "Rate limit exceeded. Try again later."
}

```
---
🕸️ Pub/Sub Architecture
---
```bash
          ┌────────────┐
          │  Client    │
          └────┬───────┘
               │
         [GET /:id]
               │
   ┌───────────▼────────────┐
   │ Express App (Node.js)  │
   │ - IP Rate Limiting     │
   │ - Fetch User from API  │
   │ - Publish Event        │
   └───────────┬────────────┘
               │
         Redis Pub/Sub
               │
     ┌─────────▼─────────┐
     │ All Subscribed    │
     │ Express Nodes     │
     │ Log or Handle     │
     └───────────────────┘


```
---
👨‍💻 Author
---
    Built with ❤ by Akash Ranjan Bhardwaj

