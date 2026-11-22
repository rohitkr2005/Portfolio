# 🍎 Rohit Kumar Mandal - Portfolio & Ask Rohit's AI Assistant

A personal developer portfolio crafted in the authentic style of a **macOS Desktop**, featuring interactive draggable project folders, a floating macOS Dock, full window management with traffic lights (🔴 🟡 🟢), built-in apps (Finder, Preview, Terminal, Safari, Settings), and an integrated **Ask Rohit's AI Assistant** that streams real-time answers (`streaming=true`) grounded in Rohit's resumes, 29+ GitHub projects, hackathon victories, and NovaNectar internship.

## 🚀 Key Features

- **MacBook / macOS Desktop Experience:**
  - **Centered Desktop Title:** Clean *"Welcome To Rohit's Portfolio AI"* wallpaper watermark.
  - Dynamic Apple Menu Bar with live clock, Control Center, Spotlight search (`Cmd+K`), and battery indicator.
  - Interactive Desktop Folders & Shortcuts: Projects, AI & Computer Vision, BI & Analytics, ML Models, Resumes, and Ask Rohit's AI.
  - Authentic macOS Dock with smooth magnification and bounce effects.
  - Multi-window management: Drag, resize, minimize to dock, maximize, and close with classic macOS traffic lights (🔴 🟡 🟢).
  - Built-in macOS apps:
    - 📁 **Finder:** Explore all 29 project repositories, categories, and tags.
    - 📄 **Preview:** Interactive PDF/document viewer for both Data Science & Data Analytics resumes.
    - 💻 **Terminal:** Functional macOS terminal running commands (`help`, `whoami`, `skills`, `projects`, `exp`, `neofetch`, `ask <query>`, `ls`, `cat`).
    - 🧭 **Safari:** In-app browser highlighting Rohit's GitHub (@rohitkr2005) & LinkedIn profile.
    - ⚙️ **System Settings:** Customize desktop wallpapers and interface theme.
- **🤖 Ask Rohit's AI Assistant:**
  - Powered by real-time streaming (`streaming=true`) via Server-Sent Events (SSE).
  - Grounded in Rohit's resumes, 29 GitHub projects, awards (Tech Fest 2026 & 2025 winner), and NovaNectar internship.
  - Intelligent direct answering: Direct technical answers for Python, SQL, Computer Vision, etc., plus brain-powered HR synthesis for behavioral interview questions.
  - Integrates with OpenRouter (free tier models like `google/gemini-2.0-flash-exp:free`) or OpenAI.
  - Works 100% out of the box with the built-in grounded knowledge engine!

## 📦 Setup & Running (Using `uv`)

1. **Install dependencies with `uv`:**
   ```bash
   uv venv
   uv pip install -e .
   ```

2. **(Optional) Configure OpenRouter API Key:**
   You can enter your API key directly in the UI under **System Settings** or inside **Ask Rohit's AI Assistant (`⚙️ Key`)**, or set it in your environment:
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-...
   ```

3. **Run the server:**
   ```bash
   uv run python run.py
   ```
   Open your browser at: **http://localhost:8000**
