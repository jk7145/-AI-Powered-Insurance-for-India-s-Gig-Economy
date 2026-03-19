🚀 GigShield AI – Protecting Gig Workers’ Income, One Hex at a Time
📌 Overview

GigShield AI is an AI-powered parametric income protection platform designed specifically for gig delivery workers operating on platforms like Swiggy and Zomato.

Gig workers face unpredictable income loss due to external disruptions such as:

🌧️ Heavy rain & floods

🌫️ Severe air pollution (AQI spikes)

🚧 Traffic congestion & road blockages

🚨 Government curfews, strikes, and zone shutdowns

Despite having no control over these events, workers bear 100% of the financial impact, often losing 20–30% of their weekly earnings.

👉 GigShield AI solves this by offering a hyper-local, AI-driven, parametric insurance system that:

Detects disruptions in real time

Verifies worker impact at zone level

Automatically triggers compensation

Ensures fair, transparent payouts


# 🛡️ GigShield — System Architecture

> A microservices-based insurance platform protecting gig workers from income disruption.

---

## 🏗️ Architecture Overview

GigShield is built across **9 layered microservices**, each responsible for a distinct domain — from real-time signal ingestion to hyper-local geospatial matching, ML-driven pricing, and instant payouts.

---

## 1️⃣ Client Layer — GigShield Mobile App

The only touchpoint gig workers interact with. Built for delivery workers on platforms like Swiggy and Zomato.

**Features:**
- User onboarding & authentication
- Link Swiggy / Zomato accounts
- View weekly premium & coverage plans
- Receive real-time disruption alerts
- Track claims & payout status

---

## 2️⃣ External Data Ingestion Layer

Continuously pulls real-world disruption signals from multiple sources.

| Source | Data Collected |
|---|---|
| 🌦️ Weather APIs | Rain, storms, extreme weather |
| 🌫️ AQI APIs | Air quality, pollution levels |
| 🏛️ Government APIs | Curfews, restrictions, lockdowns |
| 📰 News feeds | Floods, disasters, civic events |
| 📈 Market signals | Demand disruptions |
| 🚴 Delivery platform APIs | Earnings, GPS, ride history, activity |

---

## 3️⃣ Data Processing Layer

Transforms raw signals into clean, normalised, query-ready streams.

**Components:**
- **Ingestion service** — receives all incoming data feeds
- **Normalisation pipeline** — brings every signal to a common schema
- **Event streaming (Message Queue)** — decouples producers from consumers
- **Data lake / analytics DB** — stores everything for analytics and model training

---

## 4️⃣ Geospatial Trigger Engine (H3-Based)

The core differentiator. Uses Uber's H3 hexagonal grid to detect disruptions at a hyper-local level.

**Capabilities:**
- Maps all data signals into H3 hexagonal cells
- Matches worker GPS zones against disruption zones
- Activates payout trigger if zone overlap is confirmed
- Operates at street-level granularity — not just city-wide

---

## 5️⃣ Machine Learning Layer

Two purpose-built models serving distinct roles.

### 🤖 A. Premium Prediction Engine
- Forecasts disruption probability for the coming week
- Computes a dynamic, risk-adjusted weekly premium per worker

### 🤖 B. Claim Trigger Model
- Evaluates whether a worker qualifies for a payout
- Inputs: GPS location data, delivery activity, H3 zone match
- Outputs: eligibility decision with confidence score

---

## 6️⃣ Claim Verification System

Multi-signal anti-fraud validation. All five checks must pass before a claim is approved.

| Check | Description |
|---|---|
| ✅ Active during disruption | Worker was logged in and working |
| ✅ Present in H3 zone | GPS confirms presence in affected hexagon |
| ✅ Route disruption impact | Delivery route was demonstrably affected |
| ✅ Activity drop detection | Measurable fall in delivery completion rate |
| ✅ Peer-zone anomaly | Corroborated by patterns from workers in same zone |

---

## 7️⃣ Payout System

Fast, auditable disbursement to gig workers once a claim is verified.

**Features:**
- Payment gateway integration
- Wallet-based payouts
- Direct bank transfers
- Full transaction ledger for compliance & auditability

---

## 8️⃣ Storage Systems

Purpose-isolated databases — each service only touches its own data domain.

| Store | Purpose |
|---|---|
| 👤 User database | Identity, preferences, onboarding |
| 🚴 Ride & earnings DB | Historical delivery & income data |
| 🗺️ Geo-trigger DB | H3 zone events and disruption logs |
| 🧠 ML feature store | Training features for both ML models |
| 📋 Claims database | All claim events and verification results |
| 💸 Transactions DB | Payout records and financial ledger |

---

## 9️⃣ Infrastructure Layer

Cloud-native, event-driven, and fully observable.

**Components:**
- ☁️ **Cloud deployment** — auto-scaling microservices
- 🔀 **API Gateway** — routing, rate limiting, auth middleware
- 📨 **Message queues** — async processing between services
- ⏰ **Scheduled jobs** — weekly premium recalculation per worker
- 📊 **Monitoring & logging** — full observability across all services

---

## 🔄 Data Flow Summary
```
Mobile App
    ↓
External Signals (Weather, AQI, Govt, News, Platform APIs)
    ↓
Data Processing (Ingest → Normalise → Stream → Store)
    ↓
H3 Geospatial Engine (Zone match → Trigger)
    ↓
ML Layer (Premium Pricing + Claim Evaluation)
    ↓
Claim Verification (5-point fraud check)
    ↓
Payout System (Wallet / Bank Transfer)
    ↓
Storage (Isolated DBs per domain)
    ↓
Infrastructure (Cloud + Gateway + Queues + Monitoring)
    ↓ (feedback)
Mobile App ← Payout status & claim updates
```

---

## 🧱 Tech Stack Highlights

| Concern | Approach |
|---|---|
| Geospatial indexing | Uber H3 hexagonal grid |
| ML pricing | Disruption probability forecasting |
| Fraud prevention | 5-signal claim verification |
| Data pipeline | Event streaming via message queue |
| Storage | Domain-isolated microservice DBs |
| Deployment | Cloud-native, auto-scaling |
