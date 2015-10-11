import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import marked from 'marked';
import renderStreams from './render-stream';

const md = (markdown) => Rx.Observable.just(h('.markdown', {innerHTML: marked(markdown)}));

const arrivals = [
  {position: 10, value: 'Jim'},
  {position: 40, value: 'Bill'},
  {position: 70, value: 'Sally'}
];

const arrivalsReduced = [
  {position: 10, value: ['Jim']},
  {position: 40, value: ['Jim', 'Bill']},
  {position: 70, value: ['Jim', 'Bill', 'Sally']}
];

function whatIsAnObservable () {
  const intro = md(`
What on earth is an observable?
---
Observables are a data structure. They're comparable to arrays.

If arrays are data expressed over space:

    var children = ['Sally', 'Jim', 'Bob'];
    // x axis:      < ---  position --- >

Observables are data expressed over time:
  `);

  const childrenOverTime = [
    {position: 22, value: 'Sally'},
    {position: 55, value: 'Jim'},
    {position: 66, value: 'Bob'}
  ];

  const childrenOverTimeStream = renderStreams(null, [childrenOverTime], {start: 1998, end: 2003});

  return Rx.Observable.just(
    h('div', [intro, childrenOverTimeStream])
  );
}

function observableDemo () {
  const stream = renderStreams(65, [arrivals]);
  const counter$ = Rx.Observable.just(5);

  const intro = md(`
Say we're having a party.
We want to invite some guests. This is a list, so we can express it as an array.

    var invitees = ['Jim', 'Bill', 'Sally'];

We can express their arrivals over time as an observable stream!

    var arrival$ = ...
`);

  return counter$.map((counter) => (
    h('.test', [intro, stream])
  ));
}

function observableDemoContinued () {
  const preamble = md(`
So, we have our \`arrivals$\`:
  `);

  const wantAList = md(`
Let's say we want a list of all the party people after each arrives.

    arrivals$.scan((partyPeople, arrival) => partyPeople.concat([arrival]), ())
  `);

  return Rx.Observable.just(
    [
      preamble,
      renderStreams(65, [arrivals]),
      wantAList,
      renderStreams(65, [arrivals])
    ]
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

  whatIsAnObservable(),

  observableDemo(),
  observableDemoContinued()
];
