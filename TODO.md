
# Electra Simulation Engine Implementation Plan & TODOs

## 🚀 Current Progress
- **Infrastructure**: Next.js 15, Tailwind v4, Firebase Configured.
- **Brand Identity**: Fully rebranded from EditoHub to Electra. High-fidelity dark mode UI implemented.
- **Core Engine**: Gemini 1.5 Pro integration for electoral simulation.
- **Data Models**: Refactored schema.ts to support Simulations, Iterations, and strategic Data Nodes.
- **Landing Page**: Futuristic Hero, Impact Gallery (Portfolio), and CTAs fully aligned with Electra.

## 📝 TODO List for Production

### 1. Simulation Engine Refinement
- [ ] **Advanced Prompt Engineering**: Fine-tune the Gemini system prompt for deeper demographic analysis (Rural vs Urban weights).
- [ ] **Data Integration**: Connect the simulation to real-time public polling APIs or CSV datasets.
- [ ] **Deterministic Mode**: Implement a "Seed" system to allow repeatable simulations for baseline testing.

### 2. Dashboard & Visualization
- [x] **Result Dashboard**: Rebranded and integrated Recharts for voter distribution.
- [ ] **Heatmaps**: Implement an SVG-based map of India/States to show seat-by-seat projections.
- [ ] **Iteration Comparison**: Allow users to compare two different simulation runs side-by-side.

### 3. User Experience
- [x] **Simulation Panel**: Multi-step configuration flow (Setup -> Budget -> Strategy).
- [ ] **Export Reports**: Add PDF generation for the AI Strategic Intelligence Report.
- [ ] **Collaborative Mode**: Allow strategists to share simulation links with restricted "View Only" access.

### 4. Backend & Security
- [x] **Security Rules**: Enforce RBAC for Simulations and Iterations in Firestore.
- [ ] **Rate Limiting**: Implement strict API rate limiting for Gemini calls per user to control costs.
- [ ] **Simulation Queue**: If traffic spikes, implement a queueing system for long-running AI inferences.

### 5. Deployment
- [x] Set up Vercel Environment Variables (GEMINI_API_KEY).
- [ ] Deploy finalized Firebase Security Rules.
- [ ] Conduct load testing for high-concurrency simulation runs.

---
© 2026 Electra Simulation Engine.
