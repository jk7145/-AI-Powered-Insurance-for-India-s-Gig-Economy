HexSure AI - Protecting Gig Workers’ Income — One Hex at a Time.

India’s platform-based delivery partners working with services such as Swiggy, Zomato, Zepto, Amazon, and Dunzo are a critical part of the country’s fast-growing digital economy. However, their earnings are highly vulnerable to external disruptions such as extreme weather, severe pollution, floods, curfews, strikes, or sudden zone closures, which can reduce their working hours and lead to significant income loss. In many cases, delivery workers may lose 20–30% of their expected earnings during such events, yet they currently have no structured income protection mechanism to safeguard their daily wages. When disruptions occur, gig workers bear the full financial burden despite having no control over these conditions.

This project focuses on building an AI-powered parametric income protection platform specifically designed for delivery partners, where compensation is triggered automatically when verified external disruptions reduce their earning opportunity. The system will operate on a simple weekly pricing model aligned with the earning cycle of gig workers, and will use AI-driven risk assessment, geospatial verification using H3 zone indexing, intelligent fraud detection, and automated payout mechanisms to ensure that only genuinely affected workers receive compensation. By combining hyper-local disruption detection, worker activity validation, and route feasibility analysis, the platform aims to create a fair, transparent, and scalable income safety net for the gig workforce while maintaining sustainability for the insurance provider.

To address the income instability faced by delivery partners during uncontrollable external disruptions, we propose HexSure AI, an AI-powered parametric weekly income protection platform built specifically for gig workers in food delivery ecosystems such as Swiggy, Zomato. The core idea is to move beyond generic city-level disruption alerts and build a system that can verify, at a hyper-local zone level, whether a specific worker was genuinely affected enough to lose earning opportunity. To achieve this, our solution uses H3 hexagonal geospatial indexing as the spatial backbone of the platform. Instead of working only with raw GPS coordinates, the city is divided into H3 zones, and all major signals — worker location pings, disruption zones, route accessibility, traffic slowdown, order activity, and peer movement patterns — are mapped into the same hex-grid structure. This allows the system to determine not just whether rain, flooding, a strike, or a closure happened somewhere in the city, but whether it occurred in the worker’s actual operating zone, whether the worker was active during that time, whether nearby routes were blocked, and whether earning activity in that zone genuinely dropped.

Our solution uses a trigger-based parametric model where compensation is initiated when predefined, verifiable disruption conditions are met. The main triggers used in our system are: government curfew or strike alerts, heavy rain, flood or waterlogging, severe AQI, traffic or corridor inaccessibility, and sudden market or zone closures, with optional support for platform dispatch outages if simulated in the hackathon environment. These triggers are ranked using a priority hierarchy, where stronger, hard-stop events such as curfews or official strikes are treated as the highest-priority payout triggers, followed by severe environmental disruptions like floods and heavy rain, and then partial-efficiency disruptions such as AQI or mobility slowdown. This ensures the model remains explainable, avoids double counting, and enables simple, transparent payout rules. The platform continuously ingests external data from sources such as Weather APIs, AQI APIs, traffic APIs, public alerts, and simulated order activity feeds, as also encouraged by the challenge requirements.

On the worker and platform side, the system uses a controlled set of activity and earnings signals that would realistically come from a delivery partner app ecosystem such as Swiggy or Zomato, or be simulated for the hackathon. These include worker profile details, average weekly earnings, historical earnings pattern, active shift status, online/offline timestamps, GPS location pings, pickup/drop operating zone, order acceptance count, order completion count, cancellations, idle time, and route movement patterns. From the platform side, we assume access to or simulate order feed data, dispatch activity, merchant zone availability, and zone-level delivery demand. This data is not used to insure the worker’s vehicle or health; instead, it is used only to verify whether the worker’s income opportunity was materially affected, which is exactly aligned with the challenge’s requirement of covering loss of income only.

Architecturally, as shown in our system design, the worker interacts through a mobile app where they onboard, share profile and earnings information, receive a premium quote recommendation, activate weekly protection, and view a dashboard showing protected income, risk alerts, and payout updates. The system routes all data through an API Gateway into services such as Policy Service, Premium Pricing Engine, Claim Verification Engine, and Trigger Evaluation Engine. At the center of the solution is the H3 Geospatial Engine, which receives live worker location streams along with external disruption feeds and converts them into H3 cells for zone-level comparison. Around this engine sit supporting intelligence modules such as a Zone Risk Engine, Route Feasibility Analyzer, and Worker Impact Scoring Engine, which together decide whether the disruption actually reduced the worker’s earning ability. AI models then assist in disruption prediction, fraud detection, premium recommendation, and claim approval, while core services handle disruption detection, worker impact verification, fraud checks, claim automation, wallet updates, and payout simulation. The final outcome is a platform that is not just automated, but also spatially aware, worker-specific, fraud-resistant, and practically aligned to weekly gig earning cycles.

What makes this solution especially strong is that it does not pay simply because an event occurred in the city. It pays only when multiple conditions align: the worker was active, the worker’s H3 zone was affected, the route or serviceability of that zone was impaired, and order or earning patterns show meaningful loss. This makes the platform significantly more credible than a generic weather insurance concept. In short, our proposed solution is an H3-driven, trigger-based, AI-assisted weekly income protection system that creates a fair and scalable safety net for delivery workers while maintaining transparency, business viability, and low-friction automated claims.

Our approach introduces a hyper-local, data-driven parametric income protection system specifically tailored for gig delivery workers, going far beyond traditional weather-based insurance models. Most existing parametric insurance solutions operate at a city or regional level, where payouts are triggered simply when a disruption such as heavy rain or extreme weather occurs in a broad area. However, such approaches lack precision and often fail to determine whether an individual worker was actually affected in their operational zone. Our solution addresses this gap by using H3 hexagonal geospatial indexing, which divides a city into uniform hexagonal cells and allows disruptions, worker movements, route accessibility, and demand patterns to be analyzed at a much finer spatial resolution. By mapping all relevant signals—including worker GPS pings, disruption zones, traffic slowdown, and delivery activity—onto the same hexagonal grid, the system can determine exactly which micro-zones are impacted and whether the worker was actively operating in those zones during the disruption.

Another novel aspect of our solution is the combination of trigger-based parametric insurance with worker-specific verification logic. Instead of paying out simply when a trigger occurs (e.g., rain in the city), the system evaluates whether the worker was online, operating in an affected H3 zone, and experienced a real drop in earning opportunity. This is achieved through a combination of route feasibility analysis, peer-zone anomaly detection, and worker impact scoring. For example, if a flood alert appears in a zone but the worker was operating in a neighboring cell with accessible routes and normal delivery activity, the system will correctly identify that the worker was not impacted and avoid unnecessary payouts. Conversely, if multiple riders in the same H3 cell show a significant drop in movement speed or delivery completion rates, the system can infer a genuine disruption affecting earning capacity.

Our solution also introduces a priority-based trigger framework, where disruptions are ranked based on severity and likelihood of income loss. Hard-stop events such as curfews or strikes trigger the highest payout tier, followed by severe environmental events like floods or heavy rain, and then partial disruption events such as severe AQI or traffic slowdown. This hierarchy ensures transparency and avoids overlapping claims when multiple triggers occur simultaneously. Additionally, the system integrates AI-powered models for disruption prediction, premium recommendation, fraud detection, and claim approval, enabling dynamic weekly pricing and automated payout processing. Combined with wallet-based rewards and no-claim incentives, the platform ensures that workers perceive value in the protection even when no disruption occurs.

By combining H3 spatial intelligence, trigger-based parametric automation, worker activity validation, route-aware impact analysis, and AI-driven pricing, our approach transforms traditional insurance into a precision-based income protection system for the gig economy. This makes the platform more accurate, scalable, and fair than generic disruption insurance models, while also ensuring that compensation reaches workers who genuinely lose earning opportunity during external disruptions.



Here is a **clean Feature List section** you can directly put in your README / Idea Document. I’ve organized it into **clear product modules with short explanations**, which judges usually prefer.

---

# Key Features of the Proposed Platform

Our platform introduces a set of **AI-driven, geospatially aware, and worker-centric features** designed to provide reliable weekly income protection for gig delivery workers. These features combine **parametric trigger detection, H3-based zone intelligence, worker activity verification, and automated payout mechanisms**.

---

# 1. AI-Based Premium Calculation

The platform dynamically calculates a **weekly premium** tailored to each delivery worker.

Instead of charging a fixed price for everyone, the system evaluates:

* worker’s **average weekly income**
* **operating zone risk** (based on historical disruptions)
* **working hours and shift pattern**
* **historical disruption probability**
* **coverage level selected**

Using these inputs, an AI-driven pricing engine estimates the **expected probability of disruption** and determines a fair weekly premium.

Example logic:

```
Premium = (Disruption Probability × Coverage Amount)
          + Platform Fee
          - Safety Discount
```

Workers operating in **historically safe zones may receive discounted premiums**, while higher-risk zones may have slightly higher protection fees.

---

# 2. Income-Based Coverage Plans

Workers are automatically categorized into **income bands** using a rolling average of their earnings.

Example bands:

* ₹4k–₹6k/week
* ₹6k–₹8k/week
* ₹8k–₹10k/week
* ₹10k–₹12k/week

Each worker can choose between **three protection tiers**:

### Basic Plan

Lower premium with limited coverage.

### Standard Plan

Balanced premium and coverage.

### Plus Plan

Higher protection with higher payout limits.

This ensures **fair protection relative to worker income**, preventing overcompensation and fraud.

---

# 3. H3 Zone Intelligence Engine

The platform divides the city into **H3 hexagonal geospatial cells**, which serve as the spatial backbone of the system.

All important signals are mapped into these cells:

* worker location pings
* disruption events
* route accessibility
* traffic slowdown
* delivery demand
* peer rider movement

This allows the system to verify disruptions at a **micro-zone level instead of city-wide assumptions**.

For example:
If heavy rain occurs only in **two H3 cells**, payouts are evaluated only for workers operating in those cells.

This significantly improves **precision, fairness, and fraud resistance**.

---

# 4. Trigger-Based Parametric Insurance Engine

The platform monitors **external disruption triggers** in real time.

Supported triggers include:

### Environmental Triggers

* heavy rain
* flooding / waterlogging
* severe AQI
* extreme heat

### Social Triggers

* government curfew
* strikes / bandh
* zone closures

### Mobility Triggers

* road blockage
* inaccessible delivery corridors
* severe traffic slowdown

Triggers are organized in a **priority hierarchy** so the system processes the most severe disruption first.

Example:

Tier 1 – Curfew / Strike
Tier 2 – Flood / Heavy Rain
Tier 3 – AQI / Heat / Slowdown

This prevents overlapping payouts and keeps the system explainable.

---

# 5. Worker Impact Verification Engine

The system verifies whether a worker was **actually affected** before approving any payout.

Verification checks include:

* Was the worker **online during the disruption window**?
* Was the worker operating inside the **affected H3 zone**?
* Did the worker’s **route intersect disruption zones**?
* Did **delivery activity drop** compared to historical averages?
* Did **peer riders in the same zone experience slowdown**?

This ensures that payouts are made **only when genuine income loss occurs**.

---

# 6. Route Feasibility Analyzer

One of the most innovative features of the system is the **Route Feasibility Engine**.

If a disruption occurs, the system evaluates:

* whether the worker’s **delivery route intersects disrupted H3 cells**
* whether **alternate routes exist**
* whether **delivery movement speed dropped significantly**

If the worker successfully rerouted and continued deliveries normally, the system may **deny payout**, preventing unnecessary claims.

This makes the model far more realistic than traditional disruption insurance.

---

# 7. Peer-Zone Anomaly Detection

To validate disruptions more reliably, the system analyzes **peer activity in the same H3 cell**.

For example:

If **90% of riders in the same zone experience a 60–70% drop in delivery velocity**, the system can infer a genuine disruption event.

This approach helps confirm:

* flooding
* strikes
* traffic paralysis
* major zone closures

It also strengthens fraud detection by comparing worker behavior with **zone-wide patterns**.

---

# 8. Fraud Detection Engine

The platform includes intelligent fraud detection to prevent abuse.

The system detects:

* GPS spoofing
* suspicious location jumps
* duplicate claims
* impossible route movement
* repeated abnormal claims
* workers appearing online only during disruption windows
* mismatch between worker claim and peer-zone signals

Suspicious cases are flagged for **manual review by the admin dashboard**.

---

# 9. Automated Claim Processing

The system follows a **zero-touch claims model**.

When a disruption trigger occurs:

1. The trigger is validated.
2. Worker activity is checked.
3. H3 zone overlap is verified.
4. impact scoring is calculated.
5. claim eligibility is determined automatically.

If all conditions are satisfied, the system **auto-creates the claim and approves the payout**.

This eliminates paperwork and speeds up compensation.

---

# 10. Instant Payout System

Approved claims trigger an **instant payout simulation** through a mock payment gateway.

Supported integrations for the hackathon:

* Razorpay sandbox
* Stripe test mode
* simulated UPI payout

Workers receive their compensation directly into a **digital wallet or bank-linked account**.

---

# 11. Protection Wallet and Rewards System

To ensure workers feel value even when no disruption occurs, the platform includes a **wallet-based reward system**.

A portion of the premium contributes to a **protection wallet**.

Benefits include:

* premium discounts
* coverage upgrades
* reward credits
* optional withdrawals after a period

This reduces the perception that the premium is “wasted”.

---

# 12. Worker Dashboard

The worker mobile app provides a simple dashboard showing:

* weekly protected income
* active coverage plan
* premium paid
* disruption alerts
* payout history
* wallet rewards
* risk alerts for weather or mobility disruptions

This makes the system transparent and easy to understand.

---

# 13. Admin / Insurer Dashboard

The admin panel provides operational and risk analytics including:

* disruption heatmap by H3 zones
* claim monitoring dashboard
* fraud alerts
* premium vs payout ratio
* zone-level risk scores
* predictive disruption analytics
* worker protection coverage metrics

This helps insurers monitor the sustainability of the system.

---

# 14. Predictive Disruption Analytics

AI models analyze historical data to estimate **future disruption risk**.

Inputs include:

* weather forecasts
* flood history
* pollution patterns
* strike frequency
* traffic congestion trends

These predictions help:

* optimize premiums
* recommend coverage
* forecast claims for the upcoming week.

---

# Summary

The platform integrates **AI risk modeling, H3-based geospatial intelligence, trigger-based parametric insurance, worker activity verification, fraud detection, and automated payouts** to create a comprehensive income protection system for gig delivery workers.

By combining **zone-level disruption detection with worker-specific impact verification**, the solution ensures that compensation is **accurate, fair, and scalable**, while maintaining transparency for both workers and insurers.

---

If you want, I can also give you the **next section that judges LOVE in hackathon READMEs:**

**“System Workflow – Step by Step (Worker → Trigger → Verification → Payout)”**

That will perfectly match the **architecture diagram you shared.**
