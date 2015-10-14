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

<br>

If arrays are data expressed over space:

    var children = ['Sally', 'Jim', 'Bob', 'Jamie'];
    // x axis:      < ---  position --- >

<br>

Observables are streams, data expressed over time:
  `)();

  const childrenOverTime = [
    {position: 4, value: 'Sally'},
    {position: 27, value: 'Jim'},
    {position: 69, value: 'Bob'},
    {position: 91, value: 'Jamie'}
  ];

  const childrenOverTimeStream = renderStreams(null, [childrenOverTime], {start: 1995, end: 2003});

  const outtro = md(`
    // x axis:      < ---   time   --- >
  `)();

  return Rx.Observable.just(
    h('div', [intro, childrenOverTimeStream, outtro])
  );
}

function whatCanYouDoWithThem (DOM) {
  const introText = `
So we can represent data over time as an object. What does that give us?

Well, in Javascript it's a common pattern that you need to work with a stream of events.

Say we have a button.
`;
  const click$ = DOM.select('.click-me').events('click').map(_ => 'Click!');

  const timeTravel = TimeTravel(DOM, [
    {stream: click$, label: 'click$.map(_ => "Click")'}
  ]);

  return timeTravel.DOM.map(timeTravelBar =>
    h('.contents', [
      md(introText)(DOM),
      h('.example', [
        h('button.click-me', 'Click me!')
      ]),
      timeTravelBar
    ])
  );
}

function counterExample (DOM) {
  const click$ = DOM.select('.click-me').events('click').map(_ => 'Click!');
  const clickValue$ = click$.map(_ => +1);
  const counter$ = clickValue$.scan(_.add, 0).startWith(0);

  const introText = `
So we can express an event stream as an Observable.

How can we build applications from that? Well this is where the functional programming part comes in to play.
`;

  const clickValueKey = '  .map(ev => 1)';
  const counterKey = '  .scan(_.add, 0)';

  const timeTravel = TimeTravel(DOM, [
    {stream: click$, label: 'click$'},
    {stream: clickValue$, label: clickValueKey},
    {stream: counter$, label: counterKey}
  ]);

  return Rx.Observable.combineLatest(timeTravel.timeTravel[counterKey], timeTravel.DOM, (count, timeTravelBar) =>
    h('.contents', [
      md(introText)(),
      h('.example', [
        h('button.click-me', 'Click me!'),
        h('div', count.toString())
      ]),
      timeTravelBar
    ])
  );
}

function jsBin (url) {
  return (
    h('.jsbin', [
      h('iframe', {src: url})
    ])
  );
}

function todoJquery (DOM) {
  return Rx.Observable.just(jsBin('http://jsbin.com/jitucaq/edit?js,output'));
}

function introToCycle (DOM) {
  const introText = 'So what does a Cycle app actually look like?'

  return Rx.Observable.just(
    h('div', [md(introText)(DOM), jsBin('http://jsbin.com/duqemu/edit?js,output')])
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
* How do you build apps in Cycle.js?
  `),

  md(`
Cycle.js is ...
---

* A tool for building javascript applications, written by Andre Staltz (@staltz)
* Similar in nature to React or Elm
* Extremely fun to build apps with

![cycle logo](http://cycle.js.org/img/cyclejs_logo.svg)
  `),

  md(`
> "Fool!" says the wizard. "Do you think I want to learn yet another framework?"

![grumpy cat](/images/grumpy-wizard-cat.jpg)

I think in this case, you actually might.
  `),

  md(`
Why should you care?
---

* Cycle is a way of building reactive apps using functional programming
* It's a fundamentally different way of thinking about building UIs
* Cycle is built around observables
  `),

  whatIsAnObservable,

  whatCanYouDoWithThem,

  counterExample,

  introToCycle,

  todoJquery
];
