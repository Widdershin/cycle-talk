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
      h('.slide-position', `Slide #${slidePosition}/${totalSlides - 1}`),
      h('button.next-slide', {disabled: showingLastSlide()}, 'Next')
    ])
  );
}

function slideDeckView (slide, slidePosition) {
  return (
    h('.slide-deck' + `.slide-${slidePosition}`, [
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

  const nextSlideKey$ = RxDOM.fromEvent(document, 'keydown')
    .filter(keyIs('ArrowRight', 'Space'));

  const previousSlideKey$ = RxDOM.fromEvent(document, 'keydown')
    .filter(keyIs('ArrowLeft'));

  const startingSlide = parseInt(location.hash.slice(1), 10) || 0;

  const slidePosition$ = Rx.Observable.merge(
    nextSlideButton$.merge(nextSlideKey$).map(_ => +1),
    previousSlideButton$.merge(previousSlideKey$).map(_ => -1)
  ).scan(limit(_.add, {min: 0, max: slideViews.length - 1}), startingSlide)
    .startWith(startingSlide)
    .distinctUntilChanged();

  slidePosition$.forEach(position =>
    history.pushState({position}, position.toString(), `#${position}`)
  );

  const slideViewsMapped = slideViews.map(slide => slide(DOM));

  const slide$$ = slidePosition$.map(position => slideViewsMapped[position]);

  return {
    DOM: slide$$
      .switch()
      .withLatestFrom(slidePosition$, slideDeckView)
  };
}
