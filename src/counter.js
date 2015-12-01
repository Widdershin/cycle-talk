const {Observable} = require('rx');
const {h} = require('@cycle/dom');

const _ = require('lodash');

function Counter (DOM, name) {
  const add$ = DOM
    .select(`.counter-${name} .add`)
    .events('click')
    .map(event => +1);

  const count$ = add$
    .scan(_.add)
    .startWith(0);

  return {
    DOM: count$.map(count => (
      h('.counter .counter-' + name, [
        h('button.add', 'Add'),
        'Count: ' + count
      ])
    )),

    count$
  };
}

export default function CounterApp (DOM) {
  const counter = Counter(DOM, 0);
  const counter2 = Counter(DOM, 1);

  const sum$ = Observable.combineLatest(
    counter.count$,
    counter2.count$,
    _.add
  );

  return {
    DOM: Observable.combineLatest(counter.DOM, counter2.DOM, sum$, (counterDOM, counter2DOM, sum) => (
      h('.counters', [
        counterDOM,
        counter2DOM,
        sum.toString()
      ])
    ))
  };
}
