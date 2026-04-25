# Electra: High-Fidelity Election Simulation & Voter Journey

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5-blue?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-Passing-success?style=for-the-badge)](https://github.com/anikettagor2/Electra/actions)

> **Live Demo**: [electra-254006836219.us-central1.run.app](https://electra-254006836219.us-central1.run.app/)

![Electra Banner](./public/og-image.png)

## 🗳️ Project Overview

**Electra** is a comprehensive, AI-powered election simulation platform designed to educate users on the **Indian Electoral Process** and model complex political scenarios. Built for the **Virtual Prompt War 2026**, Electra bridges the gap between raw data and immersive storytelling.

The platform features a dual-core experience:
1.  **Immersive Voter Journey**: A 10-stage interactive walkthrough of the election lifecycle, from electoral roll preparation to the final declaration of results.
2.  **Predictive Simulation Engine**: Powered by **Google Gemini 1.5 Pro**, allowing strategists to model cause-and-effect outcomes based on budget, strategy, and demographics.

## 🌟 Key Features

### 1. The 10-Stage Election Journey
An immersive educational module detailing the Election Commission of India (ECI) workflow:
- **Interactive Voter Registration**: A simulator for verifying voter identity and biometrics.
- **Nomination & Scrutiny**: Visual guide to the candidate vetting process.
- **The Campaign**: Modeling the impact of digital vs. ground mobilization.
- **Interactive EVM Simulator**: A high-fidelity module with a functional VVPAT slip generator.

### 2. AI-Driven Simulation (Gemini 1.5 Pro)
- **Multi-Dimensional Modeling**: Analyze how decisions impact Urban, Rural, Youth, and Diaspora segments.
- **Dynamic Budgeting**: Real-time visualization of resource allocation impact.
- **Strategic Intelligence Reports**: Automated, deep-dive insights generated after each simulation using Gemini 1.5 Pro.

### 3. AI Assistant (Gemini 1.5 Flash)
- **Flash-Chat**: A low-latency chatbot powered by Gemini 1.5 Flash to answer questions about election laws, stages, and voter registration.

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1 (App Router), React 19
- **AI Models**: Google Gemini 1.5 Pro (Strategy), Gemini 1.5 Flash (Chat)
- **Infrastructure**: Google Cloud Run (Hosting), Cloud Build (CI/CD)
- **Animations**: Framer Motion, GSAP, Lenis (Smooth Scroll)
- **Visuals**: Recharts (Analytics), Three.js (3D Components)
- **Testing**: Vitest, React Testing Library

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Google Gemini API Key

### Installation
1.  `npm install`
2.  Create `.env.local` with `GEMINI_API_KEY`.
3.  `npm run dev`

### Testing
Run the comprehensive test suite:
```bash
npm test
```

## 📜 Compliance & Accessibility
- **WCAG 2.1 Compliant**: High contrast dark mode, ARIA labels, and semantic HTML.
- **Mobile First**: Fully responsive design for all screen sizes.

---
© 2026 Electra Simulation Engine | Virtual Prompt War Submission
