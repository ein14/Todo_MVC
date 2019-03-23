var STORAGE_KEY = 'todos-vuejs-2.0'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}


// visibility filters
var filters = {
  all: function(todos) {
    return todos
  },
  active: function(todos) {
    return todos.filter(function(todo) {
      return !todo.completed
    })
  },
  completed: function(todos) {
    return todos.filter(function(todo) { //filter の使い方
      return todo.completed
    })
  }
}

// var Vue instance
var app = new Vue({
  data: {
    todos: todoStorage.fetch(), // fetch の使い方
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
      deep: true // ネストまで監視　watchは処理速度が遅くなる
    }
  },
  // computed properties
  computed: {
    filterdTodos: function() {
      return filters[this.visibility](this.todos)
    },
    remaining: function() {
      return filters.active(this.todos).length
    },
    allDone: {
      get: function() {
        return this.remaining === 0
      },
      set: function(value) {
        this.todos.forEach(function(todo){
          todo.completed = value
        })
    }
  }
},
filters: {
  pluralize: function(n) {
    return n === 1 ? 'item' : 'items'
  }
},

methods: {
  addTodo: function() {
    var value = this.newTodo && this.newTodo.trim()
    if (!value) {
      return
    }
    this.todos.push({
      id: todoStorage.uid++, // TODO
      title: value,
      completed: false
    })
    this.newTodo = ''
  },

  removeTodo: function(todo) {
    this.todos.splice(this.todos.indexof(todo), 1)
  },
  editTodo: function(todo) {
    this.beforeEditCache = todo.title
    this.editedTodo = todo
  },
  doneEdit: function(todo) {
    if (!this.editedTodo) {
      return
    }
    this.editedTodo = null
    todo.title = todo.title.trim()
    if (!todo.title) {
      this.removeTodo(todo)
    }
  },
  cancelEdit: function(todo) {
    this.editedTodo = null
    todo.title = this.beforeEditCache
  },

  removeCompleted: function() {
    this.todos = filters.active(this.todos)
  }
},
// 内部と構成　カスタムディレクティブ参照
directives: {
  'todo-focus': function(el, binding) {
    if (binding.value) {
      el.focus()
    }
  }
}
})

// handle routing
function onHashChange() {
  var visibility = window.location.hash.replace(/#\/?/, '')
  if (filters[visibility]){
    app.visibility = visibility
} else {
  window.location.hash = ''
  app.visibility = 'all'
}
}

window.addEventListener('hashchange', onHashChange)
onHashChange()

// mount
app.$mount('.todoapp')
