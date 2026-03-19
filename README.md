<p align="center">
  <h1 align="center">🛡️ GigShield AI</h1>
  <p align="center"><b>Protecting Gig Workers' Income, One Hex at a Time</b></p>
  <p align="center">
    <img src="https://img.shields.io/badge/Platform-Swiggy%20%7C%20Zomato-orange?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Powered%20By-H3%20Geospatial%20%7C%20AI-blue?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Model-Parametric%20Insurance-green?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  </p>
</p>

---

## 📌 What is GigShield AI?

**GigShield AI** is an AI-powered **parametric income protection platform** built exclusively
for gig delivery workers on platforms like **Swiggy** and **Zomato**.

Gig workers have zero control over external disruptions — yet they bear **100% of the
financial consequences**, often losing **20–30% of their weekly earnings** due to events like:

| Disruption | Impact |
|---|---|
| 🌧️ Heavy rain & floods | Delivery zones become unreachable |
| 🌫️ Severe AQI spikes | Workers unable to operate safely |
| 🚧 Traffic & road blockages | Routes cut off, deliveries delayed |
| 🚨 Curfews, strikes & shutdowns | Entire zones go dark overnight |

> **GigShield AI flips this equation** — disruptions are detected in real time, worker
> impact is verified at zone level, and compensation is triggered automatically.
> No paperwork. No waiting. No disputes.

---

## 🧠 Core Innovation

GigShield AI is built on three proprietary technologies that together form a system
no traditional insurer can replicate.

---

### 🔷 H3 Geospatial Intelligence

Every city is divided into a precise grid of **hexagonal micro-zones** using
[Uber's H3 spatial indexing system](https://h3geo.org/).

All incoming signals — from weather feeds, government APIs, delivery platforms,
and worker GPS — are mapped onto the **exact same hexagonal grid**. This means
a disruption in hex cell `8a2a1072b59ffff` can be instantly cross-referenced
against which workers were active in that cell at that moment.
```
City Grid (H3 Hexagons)
┌──────────────────────────────────────┐
│  🔵 Normal zone   🔴 Disrupted zone  │
│                                      │
│   ⬡ ⬡ ⬡ 🔴 🔴 ⬡ ⬡                  │
│  ⬡ ⬡ 🔴 🔴 🔴 🔴 ⬡                  │
│   ⬡ ⬡ 🔴[👷]🔴 ⬡ ⬡   ← Worker hit  │
│  ⬡ ⬡ ⬡ 🔴 🔴 ⬡ ⬡                   │
│   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡                   │
└──────────────────────────────────────┘
```

**Signals mapped into H3:**
- 📍 Worker GPS location (live)
- ⛈️ Weather & AQI readings
- 🚦 Traffic & road blockage data
- 📦 Delivery activity & completion rates
- 🏛️ Government zone restrictions

---

### 🔷 Parametric Trigger Model

GigShield AI does **not** work like traditional insurance where a worker files a
claim and waits weeks for approval. Instead, payouts fire **automatically** the
moment two conditions are simultaneously true:
```
Trigger condition:

  disruption_detected_in_zone == TRUE
              AND
  worker_active_in_zone == TRUE
              ↓
  ✅ Payout triggered automatically
```

No claim forms. No phone calls. No adjuster. The system fires the moment the
parameters are met — exactly like a parametric insurance model should.

---

### 🔷 AI Verification Layer

Before any payout clears, a **5-signal AI verification check** runs in parallel
to ensure precision and prevent fraud:

| Signal | What it checks |
|---|---|
| ✅ Active status | Was the worker logged in and working during the disruption? |
| ✅ H3 zone presence | Does GPS confirm the worker was inside the affected hexagon? |
| ✅ Route impact score | Was the worker's delivery route demonstrably disrupted? |
| ✅ Activity drop | Did delivery completion rate fall below the threshold? |
| ✅ Peer-zone anomaly | Do other workers in the same hex corroborate the disruption? |

> All five signals must agree. This eliminates false claims, prevents
> over-compensation, and ensures every payout is precise and defensible.

---

## ⚡ How It Works — End to End
```
Step 1 — Signal ingestion
   Weather APIs + AQI + Govt feeds + News + Platform APIs
                        ↓
Step 2 — H3 mapping
   Every signal is plotted into the hexagonal city grid
                        ↓
Step 3 — Zone overlap detection
   Worker GPS zone cross-referenced with disruption zone
                        ↓
Step 4 — AI verification (5-point check)
   Active status · H3 presence · Route impact · Activity drop · Peer anomaly
                        ↓
Step 5 — Parametric trigger fires
   Payout approved automatically — no manual review
                        ↓
Step 6 — Disbursement
   Wallet credit or direct bank transfer — within minutes
```

---

## 💡 Why GigShield AI Wins

| Traditional Insurance | HexSure AI |
|---|---|
| City-level risk assessment | Hex-cell-level precision |
| Manual claim filing | Zero-touch automatic trigger |
| Days or weeks to payout | Minutes to payout |
| Opaque approval process | Fully auditable AI decision |
| One-size premium | Dynamic AI-priced weekly premium |
| Reactive to claims | Proactive disruption detection |

---

## 👷 Who It's Built For

GigShield AI is designed for the **last-mile delivery worker** — someone who:

- Earns per delivery, with no fixed salary or safety net
- Works through rain, smoke, and road chaos because stopping means zero income
- Has no access to traditional insurance products
- Needs protection that is **instant, fair, and automatic**

> *"I lost ₹1,800 last Tuesday because of the waterlogging near Kurla.
> No one compensated me. It just disappeared."*
> — Delivery partner, Mumbai

GigShield AI exists so that Tuesday never goes uncompensated again.

---

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
