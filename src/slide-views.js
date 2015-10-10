import {h} from '@cycle/dom';
import marked from 'marked';

export default [
`
Welcome to our live coding Cycle.js adventure!
---

What we're going to cover:

* What is Cycle.js?
* Why should you care?
* How does it compare to say, jQuery or React?
`,

`
Cycle.js is ...
---

* A tool for building javascript applications, written by Andre Staltz (@staltz)
* Akin to tools like React or Elm
* Very fun to build apps in
`,

`
> "Fool!" says the wizard. "Do you think I want to learn yet another ~~editor~~ framework?"

In this case, you actually might.
`,

`
  Why should you care?
  ---

  * Cycle is a way of building reactive apps using functional programming
`
].map(markdown => h('.markdown', {innerHTML: marked(markdown)}));
