// Week 2 JavaScript index.js

// Create a todoApp object

// use the saved data with our object

const todoApp = {
  "todos": [],
  "addTodo": function (todo) {
    console.log("This method will add a todo to our todoApp object.");
    this.todos.push(todo);
    this.saveTodos(this.todos);
  },
  "deleteTodo": function (index) { 
    console.log("This method will remove a todo from our todoApp object.");
    const removedTodo = this.todos.splice(index, 1)[0];
    this.saveTodos(this.todos);
    return removedTodo;
  },
  "saveTodos": function() {
    localStorage.setItem("todoData", JSON.stringify(this.todos));
  },
  "retrieveTodos": function() {
    let savedData = localStorage.getItem("todoData");
    this.todos = (savedData) ? JSON.parse(savedData) : [];
  },
  "showTodos": function() {
    // todos = retrieveList();
    todoListElement.innerHTML = "";
    this.todos.forEach(function(todo, i) {
      const li = document.createElement("li");
      //TODO: Replace with an id `` string interpolation, template literals. todo-item-1
      li.classList.add("todo-item");
      li.setAttribute("data-id", i);
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      // deleteBtn.addEventListener("click", function() {
      //   todos.splice(i, 1);
      //   showTodos();
      // });
      li.textContent = i + ": " + todo;
      li.appendChild(deleteBtn);
      todoListElement.appendChild(li);
    });
  },
  "clearAllTodos": function() {
    this.todos = [];
    this.saveTodos();
  }
}


// Attach an event listener to the button

// DATA

// retrieve list and if (list) then save in variable todos
// else set todos to an empty array
// let savedData = localStorage.getItem("todoData");
// let todos = (savedData) ? JSON.parse(savedData) : [];
// localStorage.setItem("userName","Jason");
// console.log("User Name: ", localStorage.getItem('userName'));

// DATA FUNCTIONS
// function saveList need to be passed todos
// function saveList(todos){
//   localStorage.setItem("todoData", JSON.stringify(todos));
//   console.log("List Saved.");
// }
// retrieveList return the list
// function retrieveList(){
//   console.log("List Retrieved.");
//   return JSON.parse(localStorage.getItem("todoData"));
// }

// clearAllTodos function

// function clearAllTodos(todos) {
//   console.log("Todos Cleared.");
//   // // save the todos
//   todos = [];
//   saveList(todos);
// }

// handle clear all todos function to combine the 
// // clearAllTodos ()
// // show the todos
function handleClearAllTodos() {
  todoApp.clearAllTodos();
  todoApp.showTodos();
}
// APP FUNCTIONS

// function addTodo(todo) {
//   // console.log("Add Todo");
//   todos.push(todo);
//   saveList(todos);
// }

// function removeTodo(index) {
//   // console.log("Remove Todo");
//   const removedTodo = todos.splice(index, 1)[0];
//   saveList(todos);
//   return removedTodo;

// }

// function showTodos() {
//   todos = retrieveList();
//   todoListElement.innerHTML = "";
//   todos.forEach(function(todo, i) {
//     const li = document.createElement("li");
//     //TODO: Replace with an id `` string interpolation, template literals. todo-item-1
//     li.classList.add("todo-item");
//     li.setAttribute("data-id", i);
//     const deleteBtn = document.createElement("button");
//     deleteBtn.textContent = "Delete";
//     deleteBtn.classList.add("delete-btn");
//     // deleteBtn.addEventListener("click", function() {
//     //   todos.splice(i, 1);
//     //   showTodos();
//     // });
//     li.textContent = i + ": " + todo;
//     li.appendChild(deleteBtn);
//     todoListElement.appendChild(li);

//   })
// }

function handleAddTodo(todoText) {
  todoApp.addTodo(todoText);
  todoApp.showTodos();
}

// APP 
todoApp.retrieveTodos();
// connect event listeners to our new todoApp object
let todoListElement = document.querySelector("#todo-list");
let addTodoInput = document.querySelector("#todo-input");
let addTodoButton = document.querySelector("#todo-add-button");
let clearTodosButton = document.querySelector("#todo-clear-button");
console.log("Todo List Element", todoListElement);
todoApp.showTodos();

addTodoButton.addEventListener("click", function() {
  handleAddTodo(addTodoInput.value);
  addTodoInput.value = "";
  console.log("Add Todo Clicked!");
})

clearTodosButton.addEventListener("click", function() {
  handleClearAllTodos();
})

todoListElement.addEventListener("click", function(event) {
  // check the event target
  console.log(event);
  // if it is has a delete-btn class 
  if (event.target.classList.contains("delete-btn")) {
    console.log("Delete Button Clicked!");
    
    const listItem = event.target.closest('.todo-item')
    if (listItem) {

    todoApp.deleteTodo(parseInt(listItem.dataset.id));
    // remove element from UI
    listItem.remove();
    }
  }
  // then remove the nearest element with the todo-item 
})

// let running = true; 
// while (running) {
//   let userInput = prompt("Todo App: type 'add', 'remove', 'show', or 'quit'");

  // if (userInput === "add") {    
  //   let newTodo = prompt("What do you need to do?");
  //   addTodo(newTodo);
  // } else if (userInput === "remove") {
  //   let todoIndex = prompt("Which todo do you want to delete?") - 1;
  //   console.log("The follow todo has been removed: ", removeTodo(todoIndex));
  // } else if (userInput === "show") { 
  //   showTodos();
  // } else if (userInput === "quit") {
  //   running = false;
  // } else {
  //   console.log("No comprende. Please try again.");
  // }
// }

// console.log("Program Terminated.");
