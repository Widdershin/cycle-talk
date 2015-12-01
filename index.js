import Cycle from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';

import slides from './src/slides';

const drivers = {
  DOM: makeDOMDriver('.app')
};

const {sinks, sources} = Cycle.run(slides, drivers);

if (module.hot) {
  module.hot.accept();

  module.hot.dispose(() => {
    sinks.dispose();
    sources.dispose();
  });
}

