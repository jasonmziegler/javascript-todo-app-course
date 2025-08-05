// console.log("Hello, world!");

// DATA

let todos = [];
let running = true; 

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
  for (let i = 0; i < todos.length; i++) {
    console.log(`${i+1}: ${todos[i]}`);
  }
}

// APP 

while (running) {
  let userInput = prompt("Todo App: type 'add', 'remove', 'show', or 'quit'");

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
}

console.log("Program Terminated.");
