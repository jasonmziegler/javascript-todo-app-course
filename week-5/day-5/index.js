// Week 5 JavaScript index.js

// IDEAS for improvement
// Todo details with show details
// change todo order
// strikethrough completed todos
// Add Priority

// Todo Items for Day 5
// Add a check or uncheck all todos checkbox
// // HTML add a checkbox for Select or unselect todos
// // View - add a selector for the checkbox
// //  Controller - add event listener to checkbox element
// //  if the checkbox is checked then forEach todo
// // if not checked then toggleComplete
// // skip if checked
// // if checkbox is unchecked
// // if checked then toggle 
// // skipe if unchecked
// // save data
// // rerender

// TODO OBJECT 
function TodoItem(title, complete = false) { 
  console.log("New Item Created");
  this.title = title;
  this.complete = complete;
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
  addTodo(todo, todoComplete = false) {
    const todos = this.todos;
    console.log("Todo Model Todos: ", todos);
    // TODO: add data validation so can't add a blank todo
    console.log("This method will add a todo to our todoApp object.");
    console.log("Todo", todo);
    console.dir("Todo Dir", todo);
    let newTodoItem = new TodoItem(todo, todoComplete);
    console.dir("New Todo Item: ",newTodoItem);
    console.log("Todos: ", this.todos);
    todos.push(newTodoItem);
    console.dir(todos);
    this.saveTodos(todos);
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
    console.log("This retrieve todo method: ", this);
    let savedData = localStorage.getItem("todoData");
    // when todos are recreated the aren't generated as new TodoItems so they lose
    // their prototype methods.
    //const newTodoArray = [];
    // doing this I lose the context of this
    const addTodo = this.addTodo.bind(this);
    const todos = this.todos;
    if (savedData) {
      const tempData = JSON.parse(savedData);
      tempData.forEach(function(todo) {
        // TODO: change complete to isComplete
        addTodo(todo.title, todo.complete);
      }); 
    } else {
      todos = [];
    }
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
    this.saveTodos();
  },
  updateTitle(index, newTitle) {
    const todoToEdit = this.todos[index];
    console.dir(todoToEdit);
    todoToEdit.updateTitle(newTitle);
    this.saveTodos();
  },
}
// TODO VIEW 
const todoView = { 
  "info": "This is the Todo View Object",
  todoListElement: document.querySelector("#todo-list"),
  addTodoInputElement: document.querySelector("#todo-input"),
  addTodoButtonElement: document.querySelector("#todo-add-button"),
  clearTodosButtonElement: document.querySelector("#todo-clear-button"),
  clearCompleteTodosButtonElement: document.querySelector("#todo-clearComplete-button"),
  toggleAllTodosCheckboxElement: document.querySelector("#toggle-all-todos"),
  showTodos(todos) {
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
      
      const title = document.createElement("span");
      title.textContent = todo.title;
      
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");

      li.appendChild(checkbox);
      li.appendChild(title);
      li.appendChild(deleteBtn);
      // console.log("For Each todoListElementView", todoListElementView);
      todoListElementView.appendChild(li);
    });
  },
}

// TODO CONTROLLER
const todoController = { 
  info: "This is the Todo Controller Object",
  model: todoModel,
  view: todoView,
  // TODO: can we do all this in one function so we don't repeat showTodos()?
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
    todoListElement = this.view.todoListElement;
    const self = this;
    // Select UI DOM Elements
    let addTodoInput = this.view.addTodoInputElement;
    let addTodoButton = this.view.addTodoButtonElement;
    let clearTodosButton = this.view.clearTodosButtonElement;
    let clearCompleteTodosButton = this.view.clearCompleteTodosButtonElement;
    let toggleAllTodosCheckbox = this.view.toggleAllTodosCheckboxElement;

    addTodoButton.addEventListener("click", function() {
      console.log("Add Todo Clicked!");
      let trimmed = addTodoInput.value.trim();
      if (trimmed === "") {
        alert("Todo must not be blank");
        return;
      }
      self.handleAddTodo(trimmed);
      addTodoInput.value = "";
    });

    clearTodosButton.addEventListener("click", function() {
      self.handleClearAllTodos();
    });

    clearCompleteTodosButton.addEventListener("click", function() {
      self.handleClearCompleteTodos();
    });

    // add an event listener to the title
      // on dblclick 
    todoListElement.addEventListener("dblclick", function (event) {
      const titleSpan = event.target.closest('span');
      const todoIndex = parseInt(titleSpan.parentNode.dataset.id);
      console.log(todoIndex);
      const titleToEdit = titleSpan.textContent;
      const titleInput = document.createElement("input");
      titleInput.value = titleToEdit;
      if (titleSpan) {
        // Edit todo title - be able to edit the title
          titleSpan.replaceWith(titleInput);
          // focus on the input
          titleInput.focus();
        // add an event listener to the input and listen for keydown esc or enter
        titleInput.addEventListener("keydown", function(event) {
          // USED to Check event.key and event.code
          // console.log('Key pressed (event.key):', event.key);
          //  console.log('Key code (event.code):', event.code);
         
          if (event.key === "Enter") { 
            console.log("Enter pressed");
            // // update the title in our model for the todoItem
            self.model.updateTitle(todoIndex, titleInput.value);
            // // render the new list
            self.view.showTodos(self.model.todos);
          } else if (event.key === "Escape") { 
             console.log("Escape pressed");
             // // else render the list
             self.view.showTodos(self.model.todos);
          }
        })
      }
    });

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

    // //  Controller - add event listener to checkbox element
    toggleAllTodosCheckbox.addEventListener("change", function(event) {
      console.log("ToggleAll Triggered");
      // //  if the checkbox is checked then forEach todo
      if (event.target.checked) {
        self.model.todos.forEach(function(todo,index) {
          // // if not checked then toggleComplete
          if (!todo.complete) {
            self.model.toggleComplete(index);
          }
          // // skip if checked
        })
      } else {
        self.model.todos.forEach(function(todo,index) {
          // // if checked then toggleComplete
          if (todo.complete) {
            self.model.toggleComplete(index);
          }
          // // skip if checked
        })
      }
      // // rerender
      self.view.showTodos(self.model.todos);
    })
  },
}

// APP 
todoController.init();



