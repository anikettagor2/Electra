# Electra: Predictive Election Simulation Engine

## Overview

**Electra** is a high-fidelity, interactive election simulation dashboard designed to model and predict electoral outcomes using advanced AI and cause-effect logic. Built with **Next.js 16.1.3**, **React 19.2.3**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**, Electra provides a production-grade UI for policy-makers, candidates, and analysts to explore complex political scenarios.

The engine leverages **Google Gemini 1.5 Pro** to process multi-dimensional variables—including budget allocations, demographic turnout, and strategic decisions—to generate realistic voter behavior models and election results.

## Key Features

- **Dynamic Parameter Configuration**: Adjust budget splits (Digital vs. Ground vs. Traditional), turnout percentages, and key policy decisions.
- **Cause-Effect Simulation**: Real-time modeling of how specific decisions impact different voter segments (Urban, Rural, Youth, Diaspora).
- **India-Specific Modeling**: Specialized logic for caste arithmetic, OBC mobilization, and incumbency factors.
- **Interactive Dashboards**: Premium data visualizations showing vote share, swing factors, and public reaction.
- **AI-Driven Insights**: Deep-dive analysis from Gemini 1.5 Pro on "What If" scenarios and strategic impact reports.

## Tech Stack

- **Frontend**: Next.js 16.1.3 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (Animations), GSAP
- **State Management**: Zustand
- **AI Engine**: Google Gemini 1.5 Pro (via `@google/generative-ai`)
- **Backend**: Firebase Cloud Functions (v2), Firestore
- **Deployment**: Vercel (Frontend), Firebase (Backend)

## Architecture

1. **Input Phase**: Users select country, election type, and define strategy parameters.
2. **Processing Phase**: Parameters are sent to a secure Firebase Function (`/api/simulate`).
3. **Simulation Phase**: Gemini 1.5 Pro processes the inputs against realistic voter segments and historical trends.
4. **Visualization Phase**: Results are streamed back and rendered into interactive charts and reaction modules.

## Getting Started

### Prerequisites

- Node.js 20+
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/electra.git
   cd electra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to start the simulation.

## License

© 2026 Electra Simulation Engine. All rights reserved.
