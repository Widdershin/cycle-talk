import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import slides from './src/slides';

const drivers = {
  DOM: makeDOMDriver('.app')
};

if (module.hot) module.hot.accept();

Cycle.run(slides, drivers);
