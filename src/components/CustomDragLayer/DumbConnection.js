import React, { Component, PropTypes } from 'react';
import SVGComponent from '../SVGComponent';
import CurvedLine from '../CurvedLine';

const CIRCLE_RADIUS = 3;
const START_STROKE_COLOR = "#4A90E2";
const END_STROKE_COLOR = "#E15947";
const STROKE_WIDTH = 2;

function getCircleStyle (x, y, end) {
  const strokeColor = START_STROKE_COLOR;
  const circleSize = 5;
  return {
    height: `${end ? circleSize * 2 : circleSize}px`,
    width: `${end ? circleSize * 2 : circleSize}px`,
    borderRadius: '50%',
    border: `${STROKE_WIDTH}px solid ${strokeColor}`,
    position: 'absolute',
    left: x,
    top: y,
    backgroundColor: strokeColor,
    zIndex: 2,
  };
}

export default class DumbConnection extends Component {

    static propTypes = {
        startX: PropTypes.number.isRequired,
        startY: PropTypes.number.isRequired,
        endX: PropTypes.number.isRequired,
        endY: PropTypes.number.isRequired,
        adjustLine: PropTypes.bool,
    };

    static defaultProps = {
      adjustLine: false,
    };

    render() {
        const { adjustLine, startX, startY, endX, endY } = this.props;
        const svgContainerStyle = {
          position: 'absolute',
          pointerEvents: 'none',
        };
        const normalOffset = CIRCLE_RADIUS;
        const adjustedOffset = -1 * CIRCLE_RADIUS - STROKE_WIDTH;
        const startOffset = adjustLine ? adjustedOffset : normalOffset;
        const endOffset = adjustLine ? adjustedOffset : normalOffset;

        return (
          <div>
            <div style={getCircleStyle(startX, startY, false)}/>
            <SVGComponent
              height={'100%'}
              width={'100%'}
              style={svgContainerStyle}
            >
              <CurvedLine
                startX={startX - startOffset}
                startY={startY - startOffset}
                endX={endX - endOffset}
                endY={endY - endOffset}
                strokeWidth={STROKE_WIDTH}
                strokeColor={START_STROKE_COLOR}
              />
            </SVGComponent>
            <div style={getCircleStyle(endX, endY, true)}/>
          </div>
        );
    }
}
