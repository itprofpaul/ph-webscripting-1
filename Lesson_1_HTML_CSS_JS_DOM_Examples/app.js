// DOM Builder - app.js

// --- Grab elements ---
const body = document.body;

const pageTitle = document.querySelector("#pageTitle");
const statusEl = document.querySelector("#status");

const badge = document.querySelector("#badge");
const themeBtn = document.querySelector("#themeBtn");

const appArea = document.querySelector("#app");

const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#taskList");

const totalCountEl = document.querySelector("#totalCount");
const doneCountEl = document.querySelector("#doneCount");
const clearDoneBtn = document.querySelector("#clearDoneBtn");

// --- App state ---
let tasks = [];

// --- Helpers ---
function setStatus(msg) {
  statusEl.textContent = msg;
}

function updateCounts() {
  totalCountEl.textContent = String(tasks.length);

  let done = 0;
  for (const t of tasks) {
    if (t.done) done++;
  }
  doneCountEl.textContent = String(done);
}

function renderTasks() {
  list.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.classList.add("task");
    li.dataset.id = task.id;

    if (task.done) {
      li.classList.add("done");
    }

    const span = document.createElement("span");
    span.classList.add("text");
    span.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.classList.add("deleteBtn");
    delBtn.type = "button";
    delBtn.textContent = "Delete";

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  }

  updateCounts();
}

// --- Build a card in the App Area (DOM creation demo) ---
function buildProfileCard() {
  appArea.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("profileCard");

  const h3 = document.createElement("h3");
  h3.textContent = "Built by JavaScript";

  const p = document.createElement("p");
  p.classList.add("muted");
  p.textContent =
    "This card was created with createElement() and added with appendChild().";

  const ul = document.createElement("ul");
  ul.classList.add("miniList");

  const points = [
    "querySelector selects elements",
    "textContent updates text",
    "classList toggles styles",
    "events make it interactive"
  ];

  for (const pt of points) {
    const li = document.createElement("li");
    li.textContent = pt;
    ul.appendChild(li);
  }

  card.appendChild(h3);
  card.appendChild(p);
  card.appendChild(ul);

  appArea.appendChild(card);
}

// --- Theme toggle ---
themeBtn.addEventListener("click", () => {
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  badge.textContent = isDark ? "ON" : "OFF";

  setStatus(isDark ? "Dark mode enabled" : "Dark mode disabled");
});

// --- Add tasks (form submit) ---
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (text.length === 0) {
    setStatus("Type a task first.");
    return;
  }

  // Use crypto.randomUUID() if available; fallback if not
  const id =
    (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : String(Date.now()) + "_" + Math.floor(Math.random() * 100000);

  tasks.push({ id, text, done: false });

  input.value = "";
  input.focus();

  setStatus("Task added.");
  renderTasks();
});

// --- Event delegation for task list clicks ---
list.addEventListener("click", (e) => {
  const target = e.target;

  // Find the closest parent <li class="task">
  const taskItem = target.closest(".task");
  if (!taskItem) return;

  const id = taskItem.dataset.id;

  // Delete button clicked
  if (target.classList.contains("deleteBtn")) {
    tasks = tasks.filter((t) => t.id !== id);
    setStatus("Task deleted.");
    renderTasks();
    return;
  }

  // Text clicked (or anywhere else in the task item)
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.done = !task.done;
  setStatus(task.done ? "Marked complete." : "Marked active.");
  renderTasks();
});

// --- Clear completed ---
clearDoneBtn.addEventListener("click", () => {
  const before = tasks.length;
  tasks = tasks.filter((t) => !t.done);
  const after = tasks.length;

  if (before === after) {
    setStatus("No completed tasks to clear.");
  } else {
    setStatus("Cleared completed tasks.");
  }

  renderTasks();
});

// --- Init ---
console.log("JS connected");
pageTitle.textContent = "DOM Builder";
setStatus("Ready");
badge.textContent = body.classList.contains("dark") ? "ON" : "OFF";

buildProfileCard();
renderTasks();