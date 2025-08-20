// Week 3 JavaScript index.js
//

// Internal Todos for day 5

// app connect eventlistener to checkbox element
// // call toggleComplete

const todoApp = {
  "todos": [],
  "addTodo": function (todo) {
    // TODO: add data validation so can't add a blank todo
    console.log("This method will add a todo to our todoApp object.");
    // {complete: false, todoTitle: todo}
    this.todos.push({complete: false, title: todo});
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
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.complete;
      checkbox.setAttribute("data-index", i);
      checkbox.classList.add("complete-checkbox");
      console.log(checkbox);
      // create a span element to contain the tile
      const title = document.createElement("span");
      title.textContent = i + ": " + todo.title;
      const deleteBtn = document.createElement("button");
      
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      // li.textContent = (todo.complete) ? "[x]" + " " + i + ": " + todo.title : "[ ]" + " " + i + ": " + todo.title;
      li.appendChild(checkbox);
      li.appendChild(title);
      li.appendChild(deleteBtn);
      todoListElement.appendChild(li);
    });
  },
  "clearAllTodos": function() {
    this.todos = [];
    this.saveTodos();
  },
  "clearCompleteTodos": function() {
    this.todos = this.todos.filter( todo => !todo.complete);
    this.saveTodos();
  },
  "toggleComplete": function (index) { 
    (this.todos[index].complete) ? this.todos[index].complete = false : this.todos[index].complete = true;
    console.log(this.todos[index].complete);
    this.saveTodos();
    this.showTodos();
  }
}
// can we do all this in one function so we don't repeat showTodos()
function handleClearAllTodos() {
  todoApp.clearAllTodos();
  todoApp.showTodos();
}

function handleClearCompleteTodos() { 
  todoApp.clearCompleteTodos();
  todoApp.showTodos();
}

function handleAddTodo(todoText) {
  todoApp.addTodo(todoText);
  todoApp.showTodos();
}

// APP 
// TODO: if user hits enter should add todo
todoApp.retrieveTodos();
// connect event listeners to our new todoApp object
let todoListElement = document.querySelector("#todo-list");
let addTodoInput = document.querySelector("#todo-input");
let addTodoButton = document.querySelector("#todo-add-button");
let clearTodosButton = document.querySelector("#todo-clear-button");
let clearCompleteTodosButton = document.querySelector("#todo-clearComplete-button");

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

clearCompleteTodosButton.addEventListener("click", function() {
  handleClearCompleteTodos();
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
  } else if (event.target.classList.contains("complete-checkbox")) {
    console.log("complete-checkbox clicked");
    const itemCheckbox = parseInt(event.target.dataset.index);
    console.log("item checkbox index", itemCheckbox);
    if (itemCheckbox) {
      todoApp.toggleComplete(itemCheckbox);
    }
  }
  // then remove the nearest element with the todo-item 
})

