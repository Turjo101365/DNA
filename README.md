# 🧬 DNA & Human Anatomy 3D Bio-Simulator

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-black.svg)](https://threejs.org/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Vision-teal.svg)](https://developers.google.com/mediapipe)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC.svg)](https://tailwindcss.com/)
[![Ollama AI](https://img.shields.io/badge/Ollama-LLM-orange.svg)](https://ollama.ai/)

An advanced, interactive 3D WebGL bio-simulation platform that allows users to explore the **human genomic structure (DNA double helix)** and **vital human organs** in real time using **webcam-based computer vision hand gesture tracking**, with full **bilingual localization (Bangla & English)** and a local **Ollama AI Medical Assistant Chatbot**.

---

## 🌟 Key Features

### 1. 🧬 Interactive 3D DNA Double Helix
- Procedural & GLTF-based 3D double helix model with real-time base pair rendering (Adenine, Thymine, Guanine, Cytosine).
- Smooth physics camera controls: 3D orbital rotation, continuous zoom, panning, and unwinding.

### 2. 🫀 Human Anatomy & Vital Organs 3D Simulation
- **❤️ Cardiovascular Heart**: 4 chambers, realistic pulsating cardiac cycle, and ventricular blood flow particles.
- **🧠 Neural Brain**: Detailed cerebral lobes, synaptic discharge effects, and EEG rhythms.
- **🫁 Respiratory Lungs**: Bronchial tree arborization with continuous breathing expansion and gas exchange visualization.
- **🫄 Visceral Organs**: Multi-organ digestive tract simulation including Liver, Gallbladder, Stomach, and Intestines.
- **💀 Human Skeletal System**: Articulated procedural 3D skeleton model.

### 3. ✋ AI Hand Tracking & Gesture Controls
- Powered by **Google MediaPipe Vision Tasks** running on WebAssembly (WASM).
- Detects hand landmarks in real time via webcam feed with zero cloud dependencies:
  - **Pinch / Two Hands**: Dynamic Zoom In / Zoom Out.
  - **Open Palm / Pointing**: 3D Orbital Rotation.
  - **Closed Fist**: Translation / Panning.
  - **Continuous Telemetry**: Real-time HUD displaying active gestures, confidence score, and anatomical details.

### 4. 🌐 Full Bilingual Localization (English & বাংলা)
- Native support for both **English** and **Bengali (বাংলা)**.
- Full dictionary covering medical and anatomical terminology, telemetry data, and user interface controls.

### 5. 🌓 Dual Theme Mode (Dark & Light)
- Clean, glassmorphic sci-fi dark theme (`#070b14`) and high-contrast clinical light theme.
- Persistent user preference with seamless CSS transitions.

### 6. 🤖 Local Ollama AI Medical Assistant
- Integrated slide-out AI assistant powered by local Ollama models (`llama3`, `mistral`, `gemma`, etc.).
- Real-time Markdown streaming responses to queries about human anatomy, physiology, and pathology in English, Bangla, and Banglish.
- Built-in quick question suggestions for each organ.

---

## 🌿 Branch Structure & Development Milestones

Each stage of the project was developed iteratively and pushed to dedicated feature branches:

| Branch | Milestone / Feature | Description |
| :--- | :--- | :--- |
| [`main`](https://github.com/Turjo101365/DNA/tree/main) | **Production Release** | Fully integrated system with all features, AI Chatbot, dual theming, and documentation. |
| [`feature/01-dna-hand-tracking`](https://github.com/Turjo101365/DNA/tree/feature/01-dna-hand-tracking) | **Task 1: DNA & Hand Tracking** | Initial Three.js 3D DNA model, MediaPipe hand landmarker, and gesture controls. |
| [`feature/02-anatomy-organs-simulation`](https://github.com/Turjo101365/DNA/tree/feature/02-anatomy-organs-simulation) | **Task 2: Anatomy & Vital Organs** | Added procedural 3D models for Skeleton, Brain, Heart, Lungs, and Visceral organs. |
| [`feature/03-gesture-telemetry`](https://github.com/Turjo101365/DNA/tree/feature/03-gesture-telemetry) | **Task 3: Gesture Telemetry HUD** | Real-time dynamic telemetry and anatomical descriptions during active hand gestures. |
| [`feature/04-bilingual-theme-mode`](https://github.com/Turjo101365/DNA/tree/feature/04-bilingual-theme-mode) | **Task 4: Bilingual & Theme Mode** | Bengali/English localization and glassmorphic Dark/Light theme switching. |
| [`feature/05-ollama-ai-chatbot`](https://github.com/Turjo101365/DNA/tree/feature/05-ollama-ai-chatbot) | **Task 5: Ollama AI Chatbot** | Integrated local Ollama LLM assistant with streaming Markdown support. |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- Optional: [Ollama](https://ollama.ai/) for running the local AI Medical Assistant

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Turjo101365/DNA.git
   cd DNA
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **(Optional) Enable AI Chatbot via Ollama:**
   - Install Ollama from [ollama.ai](https://ollama.ai).
   - Start Ollama and pull your preferred model:
     ```bash
     ollama run llama3
     ```
   - The Vite development server automatically proxies requests from `/api/ollama` to `http://127.0.0.1:11434`.

---

## 🛠️ Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **3D Graphics & Shaders**: Three.js
- **Computer Vision & Hand Tracking**: Google MediaPipe (`@mediapipe/tasks-vision`)
- **Styling**: TailwindCSS & PostCSS
- **Icons**: Lucide React
- **Local AI Provider**: Ollama REST API

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
