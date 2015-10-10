import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';

import {DOM} from 'rx-dom';
const RxDOM = DOM;

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

function slideDeckView (slidePosition) {
  const currentSlide = slideViews[slidePosition];

  return (
    h('.slide-deck', [
      h('h3', 'Cycle.js'),
      h('.slide', [currentSlide]),
      slideNavigation(slidePosition, slideViews.length)
    ])
  );
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
  ).scan(limit(_.add, {min: 0, max: slideViews.length - 1}))
    .startWith(0);

  return {
    DOM: slidePosition$.map(slideDeckView)
  };
}
