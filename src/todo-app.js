const {Observable} = require('rx');
const {h} = require('@cycle/dom');

function todoView ({todo, done}) {
  const style = {
    'text-decoration': done ? 'line-through' : 'normal'
  };

  return (
    h('.todo', {key: todo, style}, todo)
  );
}

function view ({todos}) {
  return (
    h('.todos', todos.map(todoView))
  );
}

export default function TodoApp (DOM) {
  const initialState = {
    todos: [
      {todo: 'display todos', done: true},
      {todo: 'add todos', done: false}
    ]
  };

  const state$ = Observable.just(initialState);

  return {
    DOM: state$.map(view)
  };
}
