import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import marked from 'marked';
import renderStreams from './render-stream';

import TimeTravel from 'cycle-time-travel';

const _ = require('lodash');

const md = (markdown) => (DOM) => Rx.Observable.just(h('.markdown', {innerHTML: marked(markdown)}));

const main = require('./counter');


function whatIsAnObservable (DOM) {
  const intro = md(`
What on earth is an observable?
---
Observables are a data structure. They're comparable to arrays.

If arrays are data expressed over space:

    var children = ['Rosa', 'Sylvia', 'Hugo', 'Jamie'];
    // x axis:      < ---  position --- >
<br>
Observables are streams, data expressed over time:
  `)();

  const childrenOverTime = [
    {position: 4, value: 'Rosa'},
    {position: 27, value: 'Sylvia'},
    {position: 69, value: 'Hugo'},
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
  const counterKey = '  .scan((total, change) => total + change, 0)';

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

const rxStuff = `
  So where do these Observables come from?
  ----

  A library named RxJS.

  Part of the Reactive Extensions technology family. RxJS does the heavy lifting and Cycle is a very small abstraction on top.

  RxJS is mature, and an exciting new version is in active development.
`;

const fluxVsRx = `
  So what's the difference?
  ----

  React doesn't come with a pure solution for reactive data flow.

  Cycle does: Rx Observables.

  However, React has Flux.

  Flux is slightly controversial. It solves the problem of unidirectional data flow, but some people still don't like the taste.
`;

function counterLiveCodingTime (DOM) {
  return main(DOM).DOM;
}

function otherCoolThings () {
  return md(`
Some of the things I've built
---

* [Ghostwriter](http://widdersh.in/ghostwriter)
* [tricycle](http://widdersh.in/tricycle)
* [cycle-time-travel](http://cycle.js.org/cycle-time-travel)
* [rx-undoable](http://widdersh.in/rx-undoable/)
* Powerpeople
  `)();
}

const conclusion = md(`
  In conclusion
  ----

  * Cycle.js is fun and not that scary
  * Observables are coming, and that's a good thing
  * Try out reactive programming! Be it React, Cycle, Elm or anything else
`);

const questions = md(`
  Questions?
  ====
`);

const whoAmI = md(`
  Thanks for watching
  ----
  Presented by Nick Johnstone

  I work for [Powershop](http://powershop.com/) during the day, and [make strange contraptions](http://helix-pi.net) with Javascript at night.

  * Twitter: [@widdnz](https://twitter.com/widdnz)
  * Github: [Widdershin](https://github.com/Widdershin)
  * Blog: [widdersh.in](http://widdersh.in/)

  If you want to check out these slides, they're live at [widdersh.in/cycle-talk](http://widdersh.in/cycle-talk)
`);

export default [
  md(`
What is Cycle.js?
===

Live Coding Extravaganza
---

Presented by Nick Johnstone
  `),

  md(`Note to self: start recording`),

  md(`
What we're going to cover
---

* What is Cycle.js?
* Why should you care?
* How does it compare to say, jQuery or React?
* How do you build apps in Cycle.js?
  `),

  md(`
But first, a question...
---

Why is React cool?
  `),

  md(`
State is the enemy
---

What is state?

State is the data in your application that changes.

React is cool because it helps us reason about how the view updates in response to state.

So where does Cycle.js come in?
  `),

  md(`
Cycle.js is ...
---

* A tool for building javascript applications, written by Andre Staltz (@staltz)
* Similar in nature to React or Elm
* Extremely fun to build apps with
* More of an architecture pattern than a framework

![cycle logo](images/cyclejs_logo.svg)
  `),

  md(`
> "Fool!" says the wizard. "Do you think I want to learn yet another framework?"

![grumpy cat](images/grumpy-wizard-cat.jpg)

I think in this case, you actually might.
  `),

  md(`
Why should you care?
---

* Cycle helps you reason about the flow of data in your application
* It's easy to test
* It's a bit of a brain bender to start with, but that's a good thing
* The community is nice and welcoming
  `),

  whatIsAnObservable,

  whatCanYouDoWithThem,

  counterExample,

  introToCycle,

  md(rxStuff),

  md(fluxVsRx),

  counterLiveCodingTime,

  otherCoolThings,

  conclusion,

  whoAmI,

  questions
];
