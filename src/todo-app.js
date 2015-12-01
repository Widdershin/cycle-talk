const {Observable} = require('rx');
const {h} = require('@cycle/dom');

function todoView ({todo, done}, index) {
  const style = {
    'text-decoration': done ? 'line-through' : 'normal'
  };

  return (
    h('.todo', {key: todo + index, style}, todo)
  );
}

function view ({todos}) {
  return (
    h('.todo-app', [
      h('input.new-todo'),
      h('button.create-todo', 'Add todo'),
      h('.todos', todos.map(todoView))
    ])
  );
}

const actions = {
  addTodo (_, newTodoText) {
    const newTodo = {todo: newTodoText, done: false};

    return (state) => ({todos: state.todos.concat([newTodo])})
  }
};

export default function TodoApp (DOM) {
  const initialState = {
    todos: [
      {todo: 'display todos', done: true},
      {todo: 'add todos', done: true},
      {todo: 'complete todos', done: false}
    ]
  };

  const newTodoText$ = DOM
    .select('.new-todo')
    .events('input')
    .map(event => event.target.value)
    .startWith('');

  const addTodoPress$ = DOM
    .select('.create-todo')
    .events('click')
    .withLatestFrom(newTodoText$, actions.addTodo);

  const action$ = addTodoPress$;

  const state$ = action$
    .scan((state, action) => action(state), initialState)
    .startWith(initialState);

  return {
    DOM: state$.map(view)
  };
}
