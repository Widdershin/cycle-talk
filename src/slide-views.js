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

function counterFullExample (DOM) {
  return Rx.Observable.just(
    jsBin('http://jsbin.com/balohe/edit?js,output')
  );
}

const reactComparison = `
  How does Cycle.js compare to React?
  ----

  React and Cycle have similar goals.

  * Unidirectional data flow
  * Avoid side effects
  * Virtual DOM

  In fact, there is an [implementation of Cycle in React](https://github.com/pH200/cycle-react).
`;

const fluxVsRx = `
  So what's the difference?
  ----

  React doesn't come with a pure solution for reactive data flow.

  Cycle does: Rx Observables.

  However, React has Flux.

  Flux is slightly controversial. It solves the problem of unidirectional data flow, but some people still don't like the taste.
`;

const jQueryComparison = `
  How does Cycle.js compare to jQuery?
  ----

  This isn't really a fair comparison, but there are a lot of small apps in the world written primarily with jQuery.

  So, I figured I would make a simple application in jQuery and then rewrite it in Cycle.js.
`;

function todoCycle (DOM) {
  return Rx.Observable.just(md('Livecoding Fun Time!\n---')(DOM));;
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
From jQuery to Cycle.js
===

Live Coding Extravaganza
---


Presented by Nick Johnstone
  `),

  md(`
What we're going to cover
---

* What is Cycle.js?
* Why should you care?
* How does it compare to say, jQuery or React?
* How do you build apps in Cycle.js?
  `),

  md(`Feel free to yell out questions\n---`),

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

* Cycle is a way of building reactive apps using functional programming
* It's a fundamentally different way of thinking about building UIs
* Cycle is built around observables and pure functions
* It's really fun
  `),

  whatIsAnObservable,

  whatCanYouDoWithThem,

  counterExample,

  introToCycle,

  counterFullExample,

  md(reactComparison),

  md(fluxVsRx),

  md(jQueryComparison),

  todoJquery,

  todoCycle,

  conclusion,

  whoAmI,

  questions
];
