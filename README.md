# EduSpark ⚡
### AI-Powered Adaptive Learning Platform (NCERT Syllabus, Classes 1 to 10)

EduSpark is an intelligent, full-stack adaptive learning platform designed for Indian school education. Instead of only checking whether a student got an answer right or wrong, EduSpark analyzes the student's **underlying reasoning** to detect specific conceptual misconceptions and constructs tailored, adaptive learning pathways.

---

## 🌟 Key Features

- **Concept Mastery Engine:** Full NCERT Mathematics coverage for Classes 1 to 10 with prerequisite tracking and Spaced Repetition (SuperMemo SM-2 inspired).
- **Two-Stage Misconception Diagnosis:** Asks for both an answer choice and the reasoning behind it to catch right-answer-lucky-guess gaps.
- **Dedicated Teacher Dashboard:**
  - View real-time student mastery heatmaps and progress analytics.
  - Class-by-class roll list, live student tracking, and diagnostic histories.
  - **Class Schedule & Timetable management** with weekly navigation and scheduling controls.
  - **Quiz Bank Question Management:** Teachers can add custom questions (with sound & flawed reasoning options) and remove questions directly from the dashboard.
- **Interactive Concept Maps:** Dynamic SVG prerequisite flowcharts with adaptive visual node fitting.
- **Unified Full-Stack Architecture:** Single Express + Node.js backend with SQLite, JWT authentication, and static asset delivery on port `5500` (with port `4000` fallback).

---


### NCERT-Aligned Syllabus Flowcharts (Classes 1–10)
The backend provides a structured hierarchical syllabus outline for Classes 1 to 10 across Mathematics, Science, Social Science, English, Hindi, and EVS:
- `GET /api/syllabus/:classLevel/flowchart` — Retrieves the complete chapter and topic tree for all subjects in that class.
- `GET /api/syllabus/:classLevel/flowchart?subject=Mathematics` — Filter specifically by subject name or id.
- Integrated frontend helpers in `frontend-integration.js`:
  - `apiGetSyllabusFlowchart(classLevel, subject)`
  - `renderSyllabusFlowchart(container, syllabusData)`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/avishrey-beep/Eduspark.git
   cd Eduspark
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

4. Start the application:
   ```bash
   npm start
   ```
   *(Or double-click `start.bat` on Windows)*

5. Open your browser and navigate to:
   - **http://localhost:5500**

---

## 📂 Project Structure

```
├── public/                 # Client assets (HTML, CSS, modern JavaScript)
│   ├── index.html          # Application entry point
│   ├── script.js           # Core client application & adaptive engine
│   ├── style.css           # Responsive styling & themes
│   └── frontend-integration.js # API reference helper
├── server.js               # Unified Express API & static file server
├── package.json            # Project dependencies and npm scripts
├── start.bat               # Windows one-click start script
└── README.md               # Documentation
```

---

## 🔒 License
MIT License
