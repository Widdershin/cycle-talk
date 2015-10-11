import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';

import {DOM} from 'rx-dom';
const RxDOM = DOM;

Rx.config.longStackSupport = true;

import slideViews from './slide-views';

function slideNavigation (slidePosition, totalSlides) {
  const showingFirstSlide = () => slidePosition === 0;
  const showingLastSlide = () => slidePosition === totalSlides - 1;

  return (
    h('.slide-navigation', [
      h('button.previous-slide', {disabled: showingFirstSlide()}, 'Previous'),
      h('.slide-position', `Slide #${slidePosition + 1}/${totalSlides}`),
      h('button.next-slide', {disabled: showingLastSlide()}, 'Next')
    ])
  );
}

function slideDeckView (slide, slidePosition) {
  return (
    h('.slide-deck', [
      h('.slide', [slide]),
      slideNavigation(slidePosition, slideViews.length)
    ])
  );
}

function limit (operator, {min, max}) {
  return (...args) => {
    const result = operator(...args);

    if (result < min) {
      return min;
    }

    if (result > max) {
      return max;
    }

    return result;
  };
}

function keyIs (...keys) {
  return (event) => {
    return _.include(keys, event.key) || _.include(keys, event.code);
  };
}

export default function slides ({DOM}) {
  const nextSlideButton$ = DOM.select('.next-slide').events('click');
  const previousSlideButton$ = DOM.select('.previous-slide').events('click');

  const nextSlideKey$ = RxDOM.fromEvent(document.body, 'keypress')
    .filter(keyIs('ArrowRight', 'Space'));

  const previousSlideKey$ = RxDOM.fromEvent(document.body, 'keypress')
    .filter(keyIs('ArrowLeft'));

  const slidePosition$ = Rx.Observable.merge(
    nextSlideButton$.merge(nextSlideKey$).map(_ => +1),
    previousSlideButton$.merge(previousSlideKey$).map(_ => -1)
  ).scan(limit(_.add, {min: 0, max: slideViews.length - 1}), 0)
    .startWith(0);

  const slide$$ = slidePosition$.map(position => slideViews[position]);

  return {
    DOM: slide$$.map(slide => slide(DOM))
      .switch()
      .withLatestFrom(slidePosition$, slideDeckView)
  };
}
