import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import marked from 'marked';
import renderStreams from './render-stream';

import TimeTravel from 'cycle-time-travel';

const _ = require('lodash');

const md = (markdown) => (DOM) => Rx.Observable.just(h('.markdown', {innerHTML: marked(markdown)}));


function whatIsAnObservable (DOM) {
  const intro = md(`
What on earth is an observable?
---
Observables are a data structure. They're comparable to arrays.

If arrays are data expressed over space:

    var children = ['Sally', 'Jim', 'Bob', 'Jamie'];
    // x axis:      < ---  position --- >

Observables are streams, data expressed over time:
  `)();

  const childrenOverTime = [
    {position: 27, value: 'Sally'},
    {position: 4, value: 'Jim'},
    {position: 69, value: 'Bob'}
  ];

  const childrenOverTimeStream = renderStreams(null, [childrenOverTime], {start: 1998, end: 2003});

  const outtro = md(`
    // x axis:      < ---   time   --- >
  `)();

  return Rx.Observable.just(
    h('div', [intro, childrenOverTimeStream, outtro])
  );
}

function whatCanYouDoWithThem (DOM) {
  const click$ = DOM.select('.click-me').events('click').map(_ => 'Click!');
  const clickValue$ = click$.map(_ => +1);
  const counter$ = clickValue$.scan(_.add, 0).startWith(0);

  const timeTravel = TimeTravel(DOM, [
    {stream: click$, label: 'click$'},
    {stream: clickValue$, label: 'clickValue$'},
    {stream: counter$, label: 'counter$'}
  ]);

  return Rx.Observable.combineLatest(timeTravel.timeTravel.counter$, timeTravel.DOM, (count, timeTravelBar) =>
    h('div', [
      h('div', count.toString()),
      h('button.click-me', 'Click me'),
      timeTravelBar
    ])
  );
}

export default [
  md(`
Welcome to our live coding Cycle.js adventure!
---

What we're going to cover:

* What is Cycle.js?
* Why should you care?
* How does it compare to say, jQuery or React?
  `),

  md(`
Cycle.js is ...
---

* A tool for building javascript applications, written by Andre Staltz (@staltz)
* Akin to tools like React or Elm
* Very fun to build apps in
  `),

  md(`
Another framework?
---
> "Fool!" says the wizard. "Do you think I want to learn yet another framework?"

I think in this case, you actually might.
  `),

  md(`
Why should you care?
---

* Cycle is a way of building reactive apps using functional programming
* It's a fundamentally different way of thinking about building apps
* Cycle is built around observables
  `),

  whatIsAnObservable,

  whatCanYouDoWithThem
];
