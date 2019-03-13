// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function() {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
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

var app = new Vue({
  el: '#app',
  data: {
    todos: [],
    current: -1,
    options: [
    { value: -1, label: 'すべて' },
    { value: 0,  label: '作業中' },
    { value: 1,  label: '完了' }
  ]
  // 選択している options の value を記憶するためのデータ
  // 初期値を「-1」つまり「すべて」にする

},

  computed:{

    computedTodos: function () {
      // データ current が -1 ならすべて
      // それ以外なら current と state が一致するものだけに絞り込む
      return this.todos.filter(function (el){
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },

    labels() {
    return this.options.reduce(function(a, b) {
      return Object.assign(a, { [b.value]: b.label })
    }, {})
    // キーから見つけやすいように、次のように加工したデータを作成
    // {0: '作業中', 1: '完了', -1: 'すべて'}
    }
  },

    watch: {
      todos: {
        //引数はウォッチしているプロパティの変更後の値
        handler: function (todos){
          todoStorage.save(todos)
        },
        // deep オプションでネストしているデータも監視できる
        deep: true
      }
    },

    created() { //ライフサイクルフック
      // インスタンス作成時に自動的にfetch()する
      this.todos = todoStorage.fetch()
    },

  methods: { //メソッドイベントハンドラ
    // Todo追加の処理
    doAdd: function(event, value) {
      // ref で名前をつけておいた要素を参照
      var comment = this.$refs.comment
      // 入力がなければ何もしないでreturn
      if (!comment.value.length){
        return
      }
      // { 新しいID, コメント, 作業状態 }
      // というオブジェクトを現在の todos リストへ push
      // 作業状態「state」はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++, //uidの意味
        comment: comment.value,
        state: 0
      })
      // フォーム要素を空にする
      comment.value =''
    },
    // 状態変更の処理
    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0
    },
    // 削除の処理
    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }

  }
})
