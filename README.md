# AI-Based Human Disease Screening Platform

A modern At-Home Volatile Organic Compound (VOC) Breath Biosensor Screening Platform built with React, TypeScript, and Tailwind CSS.

## 🚀 How to Run on Localhost

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)

### Step 1: Install Dependencies
Open your terminal in this extracted project folder and run:
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Open your browser and navigate to:
```
http://localhost:3000
```
(or the port shown in your terminal, e.g. `http://localhost:5173`)

---

## 📋 Features Included
- **Patient Authentication & Data Isolation**: Secure username/password login ensuring each patient's home screening history is private.
- **20-Channel VOC Breath Biosensor Matrix**: Real-time slider and numeric inputs for VOC 1 through VOC 20 with live spectrum curve visualizer.
- **Multi-Disease AI Diagnostic Engine**:
  - Diabetes Mellitus Risk
  - Chronic Kidney Disease (Renal Risk)
  - Asthma & Respiratory Airway Inflammation
  - Liver Cirrhosis / Hepatic Dysfunction Risk
  - Gastric & GI Inflammation Risk
  - Cardiovascular / Oxidative Stress
  - Healthy Physiological Baseline
- **One-Click Diagnostic Profiles**: Easily demonstrate and test different disease signatures.
- **Private Test History**: Automatically logs screenings per patient with risk stratification and delete management.
