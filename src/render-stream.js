const {h} = require('@cycle/dom');
const _ = require('lodash');

function renderFeatureValue (value) {
  if (!value) { return; }

  return value.map(val => (
    h('.subvalue', renderValue(val))
  ));
}

function renderValue (value) {
  return value;
}

function renderStreamValue (currentTime, feature, streamValue) {
  const left = streamValue.position;

  if (left < -100) {
    return null;
  }

  const valueRenderer = feature ? renderFeatureValue : renderValue;

  return (
    h('pre.stream-value',
      {style: {left: left + '%'}},
      valueRenderer(streamValue.value)
    )
  );

}

function renderStream (currentTime, streamValues, even) {
  let feature = '';

  if (streamValues.options && streamValues.options.feature) {
    feature = '.feature';
  }

  const streamMarker = currentTime ? h('.stream-marker', {style: {'margin-left': currentTime + '%'}}) : null;

  return (
    h(`.stream ${feature}`, [
      h('.stream-title', streamValues.label),
      ...streamValues.map(renderStreamValue.bind(null, currentTime, !!feature)),
      streamMarker
    ])
  );
}

function renderLabel (label) {
  function renderLabelMarker (value, index) {
    const labelOffset = 100 / (label.end - label.start);

    return h('.label-marker', {style: {'left': index * labelOffset + '%'}}, value.toString());
  }

  return (
    h('.stream.label', [
      _.range(label.start, label.end).map(renderLabelMarker),
      h('.label-marker.end', {style: {'right': '2px'}}, label.end.toString())
    ])
  );
}

function renderStreams (currentTime, streamValues, label) {
  const labelElement = label ? renderLabel(label) : null;

  return h('.streams', streamValues.map((streamValueSet, index) =>
    renderStream(currentTime, streamValueSet, index % 2 === 0)
  ).concat([labelElement]));
}

module.exports = renderStreams;
