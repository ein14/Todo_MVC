var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}
// visibility filters
var filters = {
  all: function (todos) {
    return todos
  },
  active: function (todos) {
    return todos.filter(function (todo) {
      return !todo.completed
    })
  },
  completed: function (todos) {
    return todos.filter(function (todo) { //filter の使い方
      return todo.completed
    })
  }
}

// var Vue instance
var app = new Vue({
  data: {
    todos: todoStorage.fetch(),　// fetch の使い方
    newTodo: '',
    editedTodo: null,
    visibility: 'all'
  },

  // watch todos changge for localStorage persistence
  watch: {
    todos: {
      handler: function(todos) {
        todoStorage.save(todos)
      },
      deep: true  // deep watch とは？
    }
  }
})
