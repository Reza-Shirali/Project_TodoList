const taskInput = document.getElementById("task__input");
const dateInput = document.getElementById("date__input");
const addBtn = document.getElementById("add__btn");
const editBtn = document.querySelector(".add__btn-edit");
const alertMessage = document.querySelector(".alert__message");
const todosBody = document.querySelector(".table__body");
const todoDeleteAll = document.querySelector(".delete__all-btn");
const filterTodos = document.querySelectorAll(".filter__todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const generateId = () => {
  const id = Math.round(
    Math.random() * Math.random() * Math.pow(10, 12)
  ).toString();
  return id;
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerHTML = message;
  alert.classList.add("alert");
  alert.classList.add(`alert__${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data ? data : todos;
  todosBody.innerHTML = "";
  if (todoList.length === 0) {
    todosBody.innerHTML =
      "<tr class='table-body__row'><td colspan='4' class='table-body__td'>No Task Found!</td></tr>";
    return;
  }

  todoList.forEach((todo) => {
    todosBody.innerHTML += `
      <tr class='table-body__row'>
        <td class='table-body__td'>${todo.task}</td>
        <td class='table-body__td'>${
          todo.date.length === 0 ? "No Date!" : todo.date
        }</td>
        <td class='table-body__td'>${
          todo.completed === false ? "Pending" : "Completed"
        }</td>
        <td class='table-body__td'>
          <button class='table-body__td-button' onclick="editHandler('${
            todo.id
          }')">Edit</button>
          <button class='table-body__td-button' onclick="toggleHandler('${
            todo.id
          }')">${todo.completed === false ? "Do" : "Undo"}</button>
          <button class='table-body__td-button' onclick="deleteHandler('${
            todo.id
          }')">Delete</button>
        </td>
      </tr>
    `;
  });
};

const deleteAllHandler = () => {
  if (todos.length > 0) {
    todos.splice(0, todos.length);
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos deleted successfully", "success");
  } else {
    showAlert("No todos to delete!", "error");
  }
};
const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = { id: generateId(), task: task, date: date, completed: false };
  if (task !== "") {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully", "success");
  } else {
    showAlert("please enter a todo!", "error");
  }
};

const deleteHandler = (id) => {
  const newTodo = todos.filter((todo) => todo.id !== id);
  todos = newTodo;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully", "success");
};

const toggleHandler = (id) => {
  const newTodos = todos.map((todo) => {
    if (todo.id === id) {
      return {
        id: todo.id,
        task: todo.task,
        date: todo.date,
        completed: !todo.completed,
      };
    } else {
      return todo;
    }
  });
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo updated successfully", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addBtn.style.display = "none";
  editBtn.style.display = "inline-block";
  editBtn.dataset.id = id;
};

const editHandlerBtn = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  editBtn.style.display = "none";
  addBtn.style.display = "inline-block";
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo updated successfully", "success");
};

const filterTodosHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  if (filter === "pending") {
    filteredTodos = todos.filter((todo) => todo.completed === false);
  } else if (filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed === true);
  } else {
    filteredTodos = todos;
  }
  displayTodos(filteredTodos);
};

window.addEventListener("load", () => displayTodos());
addBtn.addEventListener("click", addHandler);
todoDeleteAll.addEventListener("click", deleteAllHandler);
editBtn.addEventListener("click", editHandlerBtn);
filterTodos.forEach((button) => {
  button.addEventListener("click", filterTodosHandler);
});
