const {Observable} = require('rx');
const {h, div} = require('@cycle/dom');

export default function CounterApp (DOM) {
  return {
    DOM: Observable.just(div('.hello', 'Hello world'))
  };
}
