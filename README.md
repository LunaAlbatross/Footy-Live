<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h1 align="center">FootyLive Telemetry Dashboard</h1>

  <p align="center">
    A high-fidelity, real-time football match control room built with Next.js & Framer Motion.
    <br />
    <br />
    <a href="#features">Features</a>
    ·
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#getting-started">Getting Started</a>
  </p>

  <!-- Badges -->
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

<br />

## 🌟 Overview

**FootyLive** is not your standard live scores app. Inspired by F1 data centers and premium sports broadcast graphics, this project is a **highly dense, scroll-free telemetry dashboard** designed to visualize an entire football match on a single 1080p screen.

It ingests live match data and translates it into interactive visualizations like a dynamic tactical pitch, real-time momentum charts, and customized event logs—all wrapped in a bespoke, glassmorphism dark-mode UI.


## 🚀 Key Features

- 🏟️ **Dynamic Tactical Pitch:** Automatically plots 22 players on the pitch based on live formation data (e.g., 4-3-3 vs 4-2-3-1). Uses Framer Motion for buttery-smooth layout scaling and micro-animations.
- 📈 **Match Momentum Graph:** A real-time data visualization showing which team is applying pressure minute-by-minute.
- ⚡ **The "Control Room" Layout:** A strict CSS grid architecture that condenses Event Logs, Possession Donuts, and Team Stats into a perfectly framed, non-scrolling UI.
- 🎭 **Presentation Demo Mode:** Run the app with `?demo=true` on any match URL to inject a high-fidelity mock dataset (El Clasico: Barcelona vs Real Madrid) to bypass API limitations for portfolio recordings and presentations.
- 🔮 **Live Predictions Engine:** A dynamic question pool that generates real-time prompts based on match context ("Will there be a red card?", "Next goal scorer?").

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom `#050505` backgrounds, neon accents, and custom scrollbars)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Source:** [football-data.org](https://www.football-data.org/) (Augmented with a robust local data proxy)

---

## 💻 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/footy-live.git
   cd footy-live
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   FOOTBALL_DATA_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **View the Dashboard**
   - Open `http://localhost:3000` to see the hub.
   - For the **high-fidelity presentation mode**, navigate directly to: `http://localhost:3000/match/1?demo=true`

---

## 🏗️ Architecture & Design Philosophy

Building UI that handles live, unpredictable data is a unique challenge. FootyLive follows a strict **"Data Density over Scrolling"** philosophy. 

Instead of stacking components vertically, the architecture utilizes a constrained Flex/Grid system bound to `100vh`. Data feeds (like the Event Log and Team Stats) are given internal `overflow-y-auto` properties with custom sleek scrollbars, ensuring the overarching "broadcast overlay" aesthetic is never broken by page scrolling.

---

## 🗺️ Roadmap

- [ ] Complete migration to Sportmonks API for advanced live telemetry (xG, Shot Maps).
- [ ] Connect the Predictions Engine to a Supabase backend for persistent user scoring.
- [ ] Implement WebSockets for true real-time event pushing instead of polling.
- [ ] Multi-match "RedZone" view for tracking concurrent Champions League games.

---

<div align="center">
  <b>Built with passion by <a href="https://github.com/LunaAlbatross">LunaAlbatross</a></b>
</div>
