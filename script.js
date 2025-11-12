document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Seleccionar los elementos ---
  const taskInput = document.getElementById('taskInput');
  const importanceSelect = document.getElementById('importanceSelect'); 
  const addButton = document.getElementById('addTask');
  const list = document.getElementById('taskList');
  const clearCompleted = document.getElementById('clearCompleted');

  loadTasks();

  // --- 2. Añadir Tarea (con clic o Enter) ---
  addButton.addEventListener('click', () => {
    addTask(taskInput.value, importanceSelect.value); 
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask(taskInput.value, importanceSelect.value); 
    }
  });

  // --- 3. Función principal para crear la tarea ---
  
  // CAMBIO: El valor por defecto ahora es 'celeste'
  function addTask(taskText, importanceValue = 'celeste', isCompleted = false) {
    const text = taskText.trim();
    if (text === "") {
      alert("Por favor, escribe una tarea.");
      return;
    }

    const li = document.createElement("li");
    li.className = "task-item";
    li.classList.add(importanceValue); // Añade 'rojo', 'amarillo', o 'celeste'

    const span = document.createElement("span");
    span.innerText = text;
    if (isCompleted) {
      span.classList.add("completed");
    }
    
    span.addEventListener("click", () => {
      span.classList.toggle("completed");
      saveTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "✖";
    deleteBtn.className = "delete-btn";
    
    deleteBtn.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);

    taskInput.value = "";
    importanceSelect.value = "celeste"; // Resetea el select a 'celeste'
    saveTasks();
  }

  // --- 4. Limpiar completadas ---
  clearCompleted.addEventListener('click', () => {
    const allTasks = list.querySelectorAll("li");
    allTasks.forEach(li => {
      if (li.querySelector("span.completed")) {
        li.remove();
      }
    });
    saveTasks();
  });

  // --- 5. Guardar y Cargar Tareas (LocalStorage) ---
  function saveTasks() {
    const tasks = [];
    list.querySelectorAll("li").forEach(li => {
      const span = li.querySelector("span");
      
      // CAMBIO: Revisa los nuevos valores de clase
      let importance = "celeste"; // Default
      if (li.classList.contains("rojo")) importance = "rojo";
      if (li.classList.contains("amarillo")) importance = "amarillo";

      tasks.push({
        text: span.innerText,
        completed: span.classList.contains("completed"),
        importance: importance // Guarda el color correcto
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    
    tasks.forEach(task => {
      addTask(task.text, task.importance, task.completed); 
    });
  }
});