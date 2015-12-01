const {Observable} = require('rx');
const {h} = require('@cycle/dom');

export default function CounterApp (DOM) {
  return {
    DOM: Observable.just(h('.hello', 'Hello world'))
  };
}
