import {h} from '@cycle/dom';
import marked from 'marked';

export default [
`
  Hello world
  ----

  Sweet now I have bullet points and text

  * much better than writing html
  * and still instant reloads
`,

`
  Test
`
].map(markdown => h('.markdown', {innerHTML: marked(markdown)}));
