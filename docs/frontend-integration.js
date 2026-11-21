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

// Flowchart syllabus helpers. Fetches the hierarchical syllabus API and renders
// expandable branches into a container element (pass the container, not a selector).
async function apiGetSyllabusFlowchart(classLevel, subject = "") {
  const suffix = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return api(`/syllabus/${classLevel}/flowchart${suffix}`);
}

function renderSyllabusFlowchart(container, syllabusData) {
  container.replaceChildren();
  const makeNode = (node, depth = 0) => {
    const wrapper = document.createElement("section");
    wrapper.className = `syllabus-node syllabus-depth-${depth}`;
    const heading = document.createElement(node.children?.length ? "details" : "div");
    if (heading.tagName === "DETAILS") {
      heading.open = depth < 2;
      const summary = document.createElement("summary");
      summary.textContent = node.title || node.name;
      heading.append(summary);
    } else {
      heading.className = "syllabus-leaf";
      heading.textContent = node.title || node.name;
    }
    wrapper.append(heading);
    const children = node.children || [];
    if (children.length) {
      const branch = document.createElement("div");
      branch.className = "syllabus-branch";
      children.forEach(child => branch.append(makeNode(child, depth + 1)));
      heading.append(branch);
    }
    return wrapper;
  };
  const title = document.createElement("h2");
  title.textContent = `Class ${syllabusData.classLevel} — ${syllabusData.board || "Syllabus"}`;
  container.append(title);
  (syllabusData.subjects || []).forEach(subject => {
    const section = document.createElement("section");
    section.className = "syllabus-subject";
    const heading = document.createElement("h3");
    heading.textContent = subject.name;
    section.append(heading);
    (subject.children || []).forEach(node => section.append(makeNode(node, 1)));
    container.append(section);
  });
}
