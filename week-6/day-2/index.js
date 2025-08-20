// Week 6 JavaScript index.js

// IDEAS for improvement
// Todo details with show details
// change todo order
// strikethrough completed todos
// Add Priority

// Todo Items for Day 1
// Add Filter Functionality
// when a user clicks a filter button only the selected type of todos will be displayed in the list
// all todos (default)
// incomplete todos
// completed todos
// add button dom elements to HTML 
// in the view target the dom elements
// in the controller add event listeners
// in the model create a filter method
// set filter state
// save the filter state to local storage
// should return a list of todos
// our showTodos currently takes an array
// in the model we need a list state to know what type of todo is currently selected
// // selectedTodoType? filter: all complete incomplete
// 

// TODO OBJECT 
function TodoItem(title, complete = false) { 
  this.title = title;
  this.complete = complete;
}

// add toggle complete as a prototype method
TodoItem.prototype.toggleComplete = function() {
  (this.complete) ? this.complete = false : this.complete = true;
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
  filter: "none",
  addTodo(todo, todoComplete = false) {
    const todos = this.todos;
    // TODO: add data validation so can't add a blank todo
    let newTodoItem = new TodoItem(todo, todoComplete);
    todos.push(newTodoItem);
    this.saveTodos(todos);
  },
  "deleteTodo": function (index) { 
    const removedTodo = this.todos.splice(index, 1)[0];
    this.saveTodos(this.todos);
    return removedTodo;
  },
  "saveTodos": function() {
    localStorage.setItem("todoData", JSON.stringify(this.todos));
  },
  "retrieveTodos": function() {
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
    todoToEdit.updateTitle(newTitle);
    this.saveTodos();
  },
  saveFilterState(filterState) {
    console.log("Filter State Saved: ", filterState);
    localStorage.setItem("filterState", filterState);
  }, 
  retrieveFilterState() {
    this.filter = localStorage.getItem("filterState");
    console.log("Filter State retrieved: ", this.filter);
  },
  filterTodos(todos) {
    console.log("filterTodos Method: ", this.filter);
    let filterMethod = this.filter;
    let filteredTodos = todos.filter(function(todo) {
      console.log("Filter Todos - todo: ", todo);
      console.log("Todo item complete: ", todo.complete);
      console.log("Filter Todos inside: ", filterMethod);
      console.log("Complete logic test: ", (filterMethod == "complete"));
      console.log("Incomplete logic test: ", ((!todo.complete) && (filterMethod === "incomplete")));
      if ((filterMethod == "complete") && todo.complete) {
        console.log('Filter Method: Complete');
        return todo;
      } else if ((filterMethod == "incomplete") && !todo.complete) {
        console.log('Filter Method: inComplete');
        return todo;
      } else if (filterMethod === "none") {
        console.log('Filter Method: none');
        return todo;
      } else {
        return;
      }
    });
    console.log("Todos Filtered: ", this.filter);
    return filteredTodos;
  }
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
  showAllFilterElement: document.querySelector("#show-all-filter-button"),
  showIncompleteFilterElement: document.querySelector("#show-incomplete-filter-button"),
  showCompleteFilterElement: document.querySelector("#show-complete-filter-button"),
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
      
      const title = document.createElement("span");
      title.textContent = todo.title;
      
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");

      li.appendChild(checkbox);
      li.appendChild(title);
      li.appendChild(deleteBtn);

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
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
    this.view.showTodos(this.model.todos);
  },
  handleClearCompleteTodos: function () { 
    this.model.clearCompleteTodos();
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
    this.view.showTodos(this.model.todos);
  },
  handleAddTodo: function (todoText) {
    this.model.addTodo(todoText);
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
  },
  handleFilter: function(filterType) {
    this.model.filter = filterType;
    this.model.saveFilterState(filterType);
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
  },
  init() {
    this.model.retrieveTodos();
    this.model.retrieveFilterState();
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
    todoListElement = this.view.todoListElement;
    const self = this;
    // Select UI DOM Elements
    // TODO: these can be Const?
    let addTodoInput = this.view.addTodoInputElement;
    let addTodoButton = this.view.addTodoButtonElement;
    let clearTodosButton = this.view.clearTodosButtonElement;
    let clearCompleteTodosButton = this.view.clearCompleteTodosButtonElement;
    let toggleAllTodosCheckbox = this.view.toggleAllTodosCheckboxElement;
    const showAllFilterButton = this.view.showAllFilterElement;
    const showIncompleteFilterButton = this.view.showIncompleteFilterElement;
    const showCompleteFilterButton = this.view.showCompleteFilterElement;

    addTodoButton.addEventListener("click", function() {
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
             self.view.showTodos(self.model.filterTodos(self.model.todos));
          }
        })
      }
    });

    todoListElement.addEventListener("click", function(event) {
      // check the event target
      console.log(event);
      // if it is has a delete-btn class 
      if (event.target.classList.contains("delete-btn")) {
        const listItem = event.target.closest('.todo-item')
        if (listItem) {
          self.model.deleteTodo(parseInt(listItem.dataset.id));
          // remove element from UI
          listItem.remove();
        }
      } else if (event.target.classList.contains("complete-checkbox")) {
        const itemCheckbox = parseInt(event.target.dataset.index);
        self.model.toggleComplete(itemCheckbox);
        self.view.showTodos(self.model.filterTodos(self.model.todos));
      }
    })

    // //  Controller - add event listener to checkbox element
    toggleAllTodosCheckbox.addEventListener("change", function(event) {
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

      self.view.showTodos(self.model.filterTodos(self.model.todos));
    });
  
  // show All Filter Button
  showAllFilterButton.addEventListener("click", function(event) {
    console.log("Show All Filter Button Clicked: ", event.target);
     // call handle filter function
    self.handleFilter("none");
  });
  // show Incomplete Filter Button
  showIncompleteFilterButton.addEventListener("click", function(event) {
    console.log("Show Incomplete Filter Button Clicked: ", event.target);
    self.handleFilter("incomplete");
  });
  // show Complete Filter Button
  showCompleteFilterButton.addEventListener("click", function(event) {
    console.log("Show Complete Filter Button Clicked: ", event.target);
    self.handleFilter("complete");
  });
  }, // INIT END
}

// APP 
todoController.init();
