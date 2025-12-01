const STORAGE_KEY = "todo_simple_v1";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingID = null;

// DOM
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const taskList = document.getElementById("taskList");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");
const filterStatus = document.getElementById("filterStatus");
const editMsg = document.getElementById("editMessage");
const cancelEditBtn = document.getElementById("cancelEditBtn");

// Add or Update Task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return alert("Enter a task");

  if (editingID) {
    tasks = tasks.map(t =>
      t.id === editingID
        ? { ...t, text, category: categorySelect.value, priority: prioritySelect.value }
        : t
    );
    editingID = null;
    cancelEditBtn.classList.add("hidden");
    editMsg.classList.add("hidden");
  } else {
    tasks.push({
      id: Date.now(),
      text,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false,
    });
  }

  save();
  render();
  taskForm.reset();
});

// Render UI
function render() {
  taskList.innerHTML = "";

  let filtered = tasks.filter(t => {
    const catCheck = filterCategory.value === "All" || t.category === filterCategory.value;
    const prCheck = filterPriority.value === "All" || t.priority === filterPriority.value;
    const stCheck =
      filterStatus.value === "All" ||
      (filterStatus.value === "Active" && !t.completed) ||
      (filterStatus.value === "Completed" && t.completed);
    return catCheck && prCheck && stCheck;
  });

  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (t.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${t.completed ? "checked" : ""} onclick="toggle(${t.id})" />
        <div>
          <div class="task-text">${t.text}</div>
          <div class="meta">
            <span class="badge category">${t.category}</span>
            <span class="badge ${t.priority.toLowerCase()}">${t.priority}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button onclick="startEdit(${t.id})">Edit</button>
        <button onclick="removeTask(${t.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Toggle Status
function toggle(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  save(); render();
}

// Remove
function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

// Edit Task
function startEdit(id) {
  const t = tasks.find(t => t.id === id);
  editingID = id;
  taskInput.value = t.text;
  categorySelect.value = t.category;
  prioritySelect.value = t.priority;
  editMsg.classList.remove("hidden");
  cancelEditBtn.classList.remove("hidden");
}

// Cancel Edit
cancelEditBtn.addEventListener("click", () => {
  editingID = null;
  taskForm.reset();
  editMsg.classList.add("hidden");
  cancelEditBtn.classList.add("hidden");
});

// Save to LocalStorage
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Filter behavior
[filterCategory, filterPriority, filterStatus].forEach(f =>
  f.addEventListener("change", render)
);

// Extra Buttons
document.getElementById("clearCompleted").addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  save(); render();
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (!confirm("Delete all tasks?")) return;
  tasks = [];
  save(); render();
});

render();
