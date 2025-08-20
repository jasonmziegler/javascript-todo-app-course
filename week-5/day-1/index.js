// Week 5 JavaScript index.js
//
// IDEAS for improvement
// Todo details with show details
// Edit todo title
// change todo order
// strikethrough completed todos
// Add Priority
// be able to edit the title

// Todo Items for Day 1
// rework the app as MVC
// Model View Controller
// Model - Data View - Screen / Output / Display Controller - Mediates between the two
// Split todoApp into three objects 
// todoModel
// // update the localStorage
// // add / remove / edit data
// todoView
// access the Model to Display data
// todoController
// // connect the event listeners 
// // take the inputs from the view
// // send the info to the Model 
// // tell the View to


// TODO OBJECT 
function TodoItem(title) { 
  this.title = title;
  this.complete = false;
}

// add toggle complete as a prototype method
TodoItem.prototype.toggleComplete = function() {
  (this.complete) ? this.complete = false : this.complete = true;
    console.log("TodoItem Method Toggle Complete: ", this.complete);
}

// add updateTitle as a prototype method
TodoItem.prototype.updateTitle = function(todoTitle) {
 let trimmed = todoTitle.trim();
 if (trimmed === "") {
  return;
 }
 this.title = trimmed;
}
// TODO MODEL 
const todoModel = {
  info: "This is the Todo Model Object.",
  todos: [],
  addTodo(todo) {
    // TODO: add data validation so can't add a blank todo
    console.log("This method will add a todo to our todoApp object.");
    // {complete: false, todoTitle: todo}
    // IMPORTANT: HAD TO CREATE FIRST AND THEN PASS OR ELSE LOSE THE PROTOTYPE METHODS
    let newTodoItem = new TodoItem(todo);
    this.todos.push(newTodoItem);
    console.dir(this.todos);
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
  "clearAllTodos": function() {
    this.todos = [];
    this.saveTodos();
  },
  "clearCompleteTodos": function() {
    this.todos = this.todos.filter( todo => !todo.complete);
    this.saveTodos();
  },
  "toggleComplete": function (index) { 
    this.todos[index].toggleComplete();
    // console.log(this.todos[index].complete);
    this.saveTodos();
    // this.showTodos();
  }
}
// TODO VIEW 
const todoView = { 
  todoListElement: document.querySelector("#todo-list"),
  "info": "This is the Todo View Object",
  showTodos(todos) {
    // todos = retrieveList();
    console.log("Show Todos todoListElement", this.todoListElement);
    const todoListElementView = this.todoListElement;
    todoListElementView.innerHTML = "";
    todos.forEach(function(todo, i) {
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
      console.log("For Each todoListElementView", todoListElementView);
      todoListElementView.appendChild(li);
    });
  },
}

// TODO CONTROLLER
const todoController = { 
  info: "This is the Todo Controller Object",
  model: todoModel,
  view: todoView,
  // TODO: can we do all this in one function so we don't repeat showTodos()
  handleClearAllTodos: function () {
    this.model.clearAllTodos();
    this.view.showTodos(this.model.todos);
  },
  handleClearCompleteTodos: function () { 
    this.model.clearCompleteTodos();
    this.view.showTodos(this.model.todos);
  },
  handleAddTodo: function (todoText) {
    this.model.addTodo(todoText);
    this.view.showTodos(this.model.todos);
  },
  init() {
    this.model.retrieveTodos();
    this.view.showTodos(this.model.todos);
    todoListElement = document.querySelector("#todo-list")
    const self = this;
    // Select UI Elements
    let addTodoInput = document.querySelector("#todo-input");
    let addTodoButton = document.querySelector("#todo-add-button");
    let clearTodosButton = document.querySelector("#todo-clear-button");
    let clearCompleteTodosButton = document.querySelector("#todo-clearComplete-button");

    addTodoButton.addEventListener("click", function() {
      console.log("Add Todo Clicked!");
      let trimmed = addTodoInput.value.trim();
      if (trimmed === "") {
        alert("Todo must not be blank");
        return;
      }
      self.handleAddTodo(trimmed);
      addTodoInput.value = "";
    })
    clearTodosButton.addEventListener("click", function() {
      self.handleClearAllTodos();
    })

    clearCompleteTodosButton.addEventListener("click", function() {
      self.handleClearCompleteTodos();
    })

    todoListElement.addEventListener("click", function(event) {
      // check the event target
      console.log(event);
      // if it is has a delete-btn class 
      if (event.target.classList.contains("delete-btn")) {
        console.log("Delete Button Clicked!");
        
        const listItem = event.target.closest('.todo-item')
        if (listItem) {
          self.model.deleteTodo(parseInt(listItem.dataset.id));
          // remove element from UI
          listItem.remove();
        }
      } else if (event.target.classList.contains("complete-checkbox")) {
        console.log("complete-checkbox clicked");
        const itemCheckbox = parseInt(event.target.dataset.index);
        console.log("item checkbox index", itemCheckbox);
        self.model.toggleComplete(itemCheckbox);
      }
    })
  },
}

// APP 
todoController.init();



