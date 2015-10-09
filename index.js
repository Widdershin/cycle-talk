import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import slides from './src/slides';

const drivers = {
  DOM: makeDOMDriver('.app')
}

Cycle.run(slides, drivers);
