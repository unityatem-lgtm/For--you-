const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const formError = document.getElementById("form-error");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

let todos = [];
let currentFilter = "all";
let nextId = 1;
let editingId = null;

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;
  if (todo.completed) li.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "toggle";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => toggleTodo(todo.id));

  let taskContent;
  if (todo.id === editingId) {
    taskContent = document.createElement("input");
    taskContent.type = "text";
    taskContent.className = "edit";
    taskContent.value = todo.text;
    taskContent.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveEdit(todo.id, taskContent.value);
      if (e.key === "Escape") cancelEdit();
    });
    taskContent.addEventListener("blur", () => saveEdit(todo.id, taskContent.value));
    setTimeout(() => taskContent.focus(), 0);
  } else {
    taskContent = document.createElement("span");
    taskContent.className = "todo-text";
    taskContent.textContent = todo.text;
    taskContent.addEventListener("dblclick", () => startEdit(todo.id));
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "destroy";
  deleteBtn.textContent = "×";
  deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

  li.append(checkbox, taskContent, deleteBtn);
  return li;
}

function render() {
  todoList.innerHTML = "";
  const filtered = todos.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });
  filtered.forEach(todo => todoList.appendChild(createTodoElement(todo)));
  const activeCount = todos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${activeCount} items left`;
}

function addTodo(text) {
  if (!text.trim()) {
    formError.textContent = "Task cannot be empty";
    return;
  }
  formError.textContent = "";
  todos.push({ id: nextId++, text: text.trim(), completed: false });
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  render();
}

function startEdit(id) { editingId = id; render(); }
function cancelEdit() { editingId = null; render(); }
function saveEdit(id, newText) {
  if (!newText.trim()) { deleteTodo(id); return; }
  todos = todos.map(t => t.id === id ? { ...t, text: newText.trim() } : t);
  editingId = null;
  render();
}

// THIS IS THE IMPORTANT PART FOR ADDING
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
});

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.completed);
  render();
});

render();