import React, { Component, PropTypes } from 'react';
import SVGComponent from '../SVGComponent';
import Line from '../Line';

const CIRCLE_RADIUS = 3;
const START_STROKE_COLOR = "blue";
const END_STROKE_COLOR = "red";
const STROKE_WIDTH = 2;

function getCircleStyle (x, y, end) {
  const strokeColor = end ? END_STROKE_COLOR : START_STROKE_COLOR;
  const circleSize = 5;
  return {
    height: `${circleSize}px`,
    width: `${circleSize}px`,
    borderRadius: '50%',
    border: `${STROKE_WIDTH}px solid ${strokeColor}`,
    position: 'fixed',
    left: x - circleSize - CIRCLE_RADIUS,
    top: y - circleSize - CIRCLE_RADIUS,
    backgroundColor: 'white',
  };
}

export default class DumbConnection extends Component {

    static propTypes = {
        startX: PropTypes.number.isRequired,
        startY: PropTypes.number.isRequired,
        endX: PropTypes.number.isRequired,
        endY: PropTypes.number.isRequired,
    };

    render() {
        const { startX, startY, endX, endY } = this.props;

        const svgContainerStyle = {
          position: 'absolute',
          pointerEvents: 'none',
        };

        return (
          <div>
            <div style={getCircleStyle(startX, startY, false)}/>
            <SVGComponent
              height={'100%'}
              width={'100%'}
              style={svgContainerStyle}
            >
              <Line
                x1={startX}
                y1={startY - CIRCLE_RADIUS}
                x2={endX}
                y2={endY - CIRCLE_RADIUS}
                strokeWidth={STROKE_WIDTH}
                stroke={START_STROKE_COLOR}
              />
            </SVGComponent>
            <div style={getCircleStyle(endX, endY, true)}/>
          </div>
        );
    }
}
