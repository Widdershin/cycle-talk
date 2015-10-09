import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';

export default function slides ({DOM}) {
  return {
    DOM: Rx.Observable.just('Bar!')
      .map(message => h('.message', message))
  };
}
