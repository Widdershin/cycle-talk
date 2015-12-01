const {Observable} = require('rx');
const {h} = require('@cycle/dom');

export default function TodoApp (DOM) {
  return {
    DOM: Observable.just(h('.hello', 'Hello world'))
  };
}
