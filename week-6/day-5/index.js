// Week 6 JavaScript index.js

// IDEAS for improvement
// Todo details with show details
// change todo order
// strikethrough completed todos
// Add Priority

// BUG LIST
// data-id tied to array index and loop counter
// unstable complete todo behavior when filtering 

// Todo Items for Day 5
// fix data-id issue
// should an item be able to self generate an id?

// TODO OBJECT 
function TodoItem(title, complete = false, id) { 
  // if no Id passed we will need to create an id - lookup how to generate a unique id
  if (id) {
    this.id = id;
  } else {
    return "Needs Id.";
  }
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
  // Create a lastId so that we don't give a TodoItem the same id
  lastIdCount: 1000,
  filter: "none",
  addTodo(todo, todoComplete = false, todoId) {
    const todos = this.todos;
    // TODO: add data validation so can't add a blank todo
    // here we account for if this is a retreived todo or a newTodo
    let newTodoId;
    if (todoId) { 
      newTodoId = todoId;
    } else {
      newTodoId = ++this.lastIdCount;
    }

    let newTodoItem = new TodoItem(todo, todoComplete, newTodoId);
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
    //const todos = this.todos;
    let lastTodoId;
    if (savedData) {
      const tempData = JSON.parse(savedData);
      tempData.forEach(function(todo) {
        // TODO: change complete to isComplete
        lastTodoId = todo.id;
        addTodo(todo.title, todo.complete, todo.id);

      }); 
    } 
    if (lastTodoId) {
      this.lastIdCount = lastTodoId;
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
    let filterMethod = this.filter;
    let filteredTodos = todos.filter(function(todo) {
      if ((filterMethod == "complete") && todo.complete) {
        return todo;
      } else if ((filterMethod == "incomplete") && !todo.complete) {
        return todo;
      } else if (filterMethod === "none") {
        return todo;
      } else {
        return;
      }
    });
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
  todoSearchInputElement: document.querySelector("#todo-search-input"),
  showTodos(todos) {
    console.log("Show Todos todoListElement", this.todoListElement);
    const todoListElementView = this.todoListElement;
    todoListElementView.innerHTML = "";
    console.log("View Todos Length: ", todos.length);
    if (todos.length === 0) {
      const li = document.createElement("li");
      const content = document.createElement("span");
      content.textContent = "No todos found.";
      li.appendChild(content);
      todoListElementView.appendChild(li);
    } else {
      todos.forEach(function(todo, i) {
        const li = document.createElement("li");
        //TODO: Replace with an id `` string interpolation, template literals. todo-item-1
        li.classList.add("todo-item");
        // TODO: this needs to be set to todo.id
        li.setAttribute("data-id", todo.id);
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;
        // TODO: this needs to be set to todo.id
        checkbox.setAttribute("data-index", todo.id);
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
    }
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
    // need to trim here 
    let trimmed = todoText.trim();
      if (trimmed === "") {
        alert("Todo must not be blank");
        return;
      }
    this.model.addTodo(trimmed);
    let filteredTodos = this.model.filterTodos(this.model.todos);
    // focus on addTodoInput 
    this.view.addTodoInputElement.value = "";
    this.view.showTodos(filteredTodos);
  },
  handleFilter: function(filterType) {
    this.model.filter = filterType;
    this.model.saveFilterState(filterType);
    let filteredTodos = this.model.filterTodos(this.model.todos);
    this.view.showTodos(filteredTodos);
  },
  handleSearch: function(searchTerm) {
    // search term has been trimmed and toLowerCase before being sent
    console.log("Search Handled");
    // Handle the Search - create search function 
    let filteredTodos = this.model.filterTodos(this.model.todos);
    let searchTodos = filteredTodos.filter(function(todo) {
      if (todo.title.toLowerCase().includes(searchTerm)) { 
        console.log("Search Todo: ", todo);
        return todo;
      } else {
        return;
      }
    });
    // // what string methods can we use?
    // // lower case both search and title to make match easier
    // // contains? 
    // // includes() (JavaScript): This method returns true if the string contains the specified substring, and false otherwise. It is case-sensitive by default.
    this.view.showTodos(searchTodos);
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
    const todoSearchInput = this.view.todoSearchInputElement;

    addTodoInput.addEventListener("keydown", function(event) {
       if (event.key === "Enter") {
        self.handleAddTodo(addTodoInput.value);
       }
    })
    addTodoButton.addEventListener("click", function() {
      self.handleAddTodo(addTodoInput.value);
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
          // here we are deleting the do at "index" of dataset.id
          // TODO:Get the index of the todo with the dataset.id we want to delete.
          // we need a function to return the index of a todo with the id of x
          const deleteItemIndex = self.model.todos.findIndex(function(todo) {
            return todo.id === parseInt(listItem.dataset.id);
          });

          if (deleteItemIndex !== -1) {
            self.model.deleteTodo(deleteItemIndex);
          // remove element from UI
          listItem.remove();
          } else {
            console.error("Delete Item: Id not found.")
          }
        }
      } else if (event.target.classList.contains("complete-checkbox")) {
        const itemCheckboxIndex = self.model.todos.findIndex(function(todo) {
          return todo.id === parseInt(event.target.dataset.index);
        })

        // here we are toggling  the todo at "index" of dataset.id
          // TODO:Get the index of the todo with the dataset.id we want to toggle.
        if (itemCheckboxIndex !== -1) {
          self.model.toggleComplete(itemCheckboxIndex);
        } else {
          console.error("Todo not found.")
        }
        
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
  // search event listener
  todoSearchInput.addEventListener("input", function(event) {
    let searchTerm = event.target.value.trim().toLowerCase();
    console.log("Search Term: ", searchTerm);
    self.handleSearch(searchTerm);
  })
  }, // INIT END
}

// APP 
todoController.init();
