# Parakh backend (Node.js + Express + SQLite)

This is a local REST API for the Parakh frontend you uploaded.

## 1. Install Node.js
Install the current Node.js LTS release from https://nodejs.org/.

## 2. Start the backend
Open a terminal inside this `parakh_backend` folder and run:

```bash
npm install
```

Copy `.env.example` to `.env`, then change `JWT_SECRET` to a long random value.

```bash
npm run dev
```

The API runs at `http://localhost:4000`. Check it at `http://localhost:4000/api/health`.

The SQLite database file `parakh.sqlite` is created automatically.

## 3. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a student or teacher |
| POST | `/api/auth/login` | Log in |
| GET | `/api/me` | Current account |
| GET | `/api/syllabus/:classLevel` | Concepts and prerequisites |
| GET | `/api/questions/next` | Generate adaptive question for student |
| POST | `/api/attempts` | Save answer + reasoning and update mastery |
| GET | `/api/student/dashboard` | Student progress and revision information |
| GET | `/api/teacher/classes/:classLevel/overview` | Real class-wide learning gaps |
| GET/POST | `/api/calendar` | Read/add calendar events |
| DELETE | `/api/calendar/:id` | Delete teacher's own event |
| GET/POST | `/api/assignments` | Read/create class assignments |

All endpoints except `/api/health`, `/api/auth/register`, and `/api/auth/login` require:
`Authorization: Bearer YOUR_TOKEN`

## 4. Register request examples

Student:
```json
{
  "name": "Aarav",
  "email": "aarav@example.com",
  "password": "password123",
  "role": "student",
  "classLevel": 6
}
```

Teacher:
```json
{
  "name": "Teacher",
  "email": "teacher@example.com",
  "password": "password123",
  "role": "teacher"
}
```

## 5. Save an attempt

First call `GET /api/questions/next` with the student's token. It returns a `questionId`.
After the student answers, send:

```json
{
  "questionId": "ID_FROM_QUESTION_RESPONSE",
  "selectedAnswer": "5/6",
  "reasoningCorrect": true,
  "answerMisconception": null,
  "reasoningMisconception": null
}
```

For a wrong answer or flawed reasoning, pass the relevant misconception code:
`slip`, `op`, `fadd`, `sign`, `pct`, `move`, `dist`, or `sqs`.

## Important integration note

Your uploaded `script.js` currently performs most learning calculations in the browser. It also creates a simulated teacher class of 24 students, and its login form does not authenticate against a server. This backend provides real API endpoints and persistence, but it will **not automatically replace those frontend behaviours** just by starting the server.

The next integration step is to update `script.js` so:
- login/register call `/api/auth/register` and `/api/auth/login`;
- diagnostic and practice screens fetch `/api/questions/next`;
- answer submission calls `/api/attempts`;
- dashboard and teacher screens render data from their API endpoints;
- calendar uses `/api/calendar` instead of the `claude.use('db')` preview integration.

Do not deploy with the sample JWT secret. Add HTTPS, rate limiting, validation, account recovery, and teacher/student classroom authorization before production use.

## NCERT-aligned syllabus flowcharts (Classes 1–10)

The backend now exposes a hierarchical syllabus outline for the flowchart UI:

- `GET /api/syllabus/:classLevel/flowchart` — all subjects for a class
- `GET /api/syllabus/:classLevel/flowchart?subject=Mathematics` — one subject (subject name or id)

Both endpoints require the same Bearer token as the other student endpoints. The response shape is `classLevel -> subjects -> children (chapters) -> children (topics)`. Topic nodes are ready to be extended with subtopics. `frontend-integration.js` includes `apiGetSyllabusFlowchart()` and `renderSyllabusFlowchart(container, data)` for expandable branches.

**Editorial note:** This repository is backend-only; it does not include the Parakh website/app UI. The included content is an NCERT-aligned outline, not a verified exhaustive chapter-by-chapter transcription. NCERT editions and rationalised syllabi change, so confirm the applicable academic-year books before presenting it as the official complete syllabus. The existing `/api/syllabus/:classLevel` learning-concept endpoint remains unchanged.
