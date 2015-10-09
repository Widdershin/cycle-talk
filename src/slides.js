import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import _ from 'lodash';

import slideViews from './slide-views';

function slideNavigation (slidePosition, totalSlides) {
  const showingFirstSlide = () => slidePosition === 0;
  const showingLastSlide = () => slidePosition === totalSlides - 1;

  return (
    h('.slide-navigation', [
      h('.button-container', [
        h('button.previous-slide', {disabled: showingFirstSlide()}, 'Previous'),
        h('.slide-position', `Slide #${slidePosition + 1}/${totalSlides}`),
        h('button.next-slide', {disabled: showingLastSlide()}, 'Next')
      ])
    ])
  );
}

function slideDeckView (slidePosition) {
  const currentSlide = slideViews[slidePosition];

  return (
    h('.slide-deck', [
      h('.slide', [currentSlide]),
      slideNavigation(slidePosition, slideViews.length)
    ])
  );
}

export default function slides ({DOM}) {
  const nextSlide$ = DOM.select('.next-slide').events('click');
  const previousSlide$ = DOM.select('.previous-slide').events('click');

  const slidePosition$ = Rx.Observable.merge(
    nextSlide$.map(_ => +1),
    previousSlide$.map(_ => -1)
  ).scan(_.add).startWith(0);

  return {
    DOM: slidePosition$
      .map(slidePosition => slideDeckView(slidePosition))
  };
}
