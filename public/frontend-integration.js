// Add this helper near the top of script.js when connecting the frontend to the API.
// This file is an integration reference; it does not replace the existing UI rendering code.
const API_BASE = "http://localhost:4000/api";
let API_TOKEN = localStorage.getItem("eduspark_token") || localStorage.getItem("parakh_token") || "";

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "API request failed");
  return data;
}

async function apiRegister({ name, email, password, role, classLevel }) {
  const data = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role, classLevel })
  });
  API_TOKEN = data.token;
  localStorage.setItem("eduspark_token", API_TOKEN);
  localStorage.setItem("parakh_token", API_TOKEN);
  return data.user;
}

async function apiLogin(email, password) {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  API_TOKEN = data.token;
  localStorage.setItem("eduspark_token", API_TOKEN);
  localStorage.setItem("parakh_token", API_TOKEN);
  return data.user;
}

async function apiGetNextQuestion(conceptId = "") {
  const suffix = conceptId ? `?concept=${encodeURIComponent(conceptId)}` : "";
  return api(`/questions/next${suffix}`);
}

async function apiSaveAttempt({
  questionId, selectedAnswer, reasoningCorrect,
  answerMisconception = null, reasoningMisconception = null
}) {
  return api("/attempts", {
    method: "POST",
    body: JSON.stringify({
      questionId, selectedAnswer, reasoningCorrect,
      answerMisconception, reasoningMisconception
    })
  });
}

async function apiGetStudentDashboard() {
  return api("/student/dashboard");
}

async function apiGetTeacherOverview(classLevel) {
  return api(`/teacher/classes/${classLevel}/overview`);
}
