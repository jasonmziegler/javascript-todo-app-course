// Week 2 JavaScript index.js

// DATA

let todos = [];
let todoListElement = document.querySelector("#todo-list");
let addTodoInput = document.querySelector("#todo-input");
let addTodoButton = document.querySelector("#todo-add-button");
console.log("Todo List Element", todoListElement);

// FUNCTIONS

function addTodo(todo) {
  // console.log("Add Todo");
  todos.push(todo);
}

function removeTodo(index) {
  // console.log("Remove Todo");
  return todos.splice(index, 1)[0];
}

function showTodos() {
  // console.log("Show Todos");  
  // for (let i = 0; i < todos.length; i++) {
  //   console.log(`${i+1}: ${todos[i]}`);
  // }
  todoListElement.innerHTML = "";
  todos.forEach(function(todo, i) {
    const li = document.createElement("li");
    li.textContent = i + ": " + todo;
    todoListElement.appendChild(li);
  })
}

function handleAddTodo(todoText) {
  addTodo(todoText);
  showTodos();
}

// APP 

showTodos();

addTodoButton.addEventListener("click", function() {
  handleAddTodo(addTodoInput.value);
  addTodoInput.value = "";
  console.log("Add Todo Clicked!");
})

// let running = true; 
// while (running) {
//   let userInput = prompt("Todo App: type 'add', 'remove', 'show', or 'quit'");

  if (userInput === "add") {    
    let newTodo = prompt("What do you need to do?");
    addTodo(newTodo);
  } else if (userInput === "remove") {
    let todoIndex = prompt("Which todo do you want to delete?") - 1;
    console.log("The follow todo has been removed: ", removeTodo(todoIndex));
  } else if (userInput === "show") { 
    showTodos();
  } else if (userInput === "quit") {
    running = false;
  } else {
    console.log("No comprende. Please try again.");
  }
// }

console.log("Program Terminated.");
