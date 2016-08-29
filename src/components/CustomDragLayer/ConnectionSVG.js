import React, { Component, PropTypes } from 'react';
import SVGComponent from '../SVGComponent';
import Circle from '../Circle';
import GElement from '../GElement';
import Line from '../Line';

const CIRCLE_RADIUS = "3";
const STROKE_COLOR = "blue";
const STROKE_WIDTH = "2";

export default class ConnectionSVG extends Component {

    static propTypes = {
        startX: PropTypes.number.isRequired,
        startY: PropTypes.number.isRequired,
        endX: PropTypes.number.isRequired,
        endY: PropTypes.number.isRequired,
    };

    renderConnectionHandle = (x, y) => {
        return (
            <GElement>
                {/* Large circle for click area */}
                <Circle
                    cx={x}
                    cy={y}
                    cursor="pointer"
                    r="10"
                    stroke="none"
                    fill="rgba(255,255,255,0)"
                />
                {/* Small circle for visual handle */}
                <Circle
                    cx={x}
                    cy={y}
                    cursor="pointer"
                    r={CIRCLE_RADIUS}
                    stroke={STROKE_COLOR}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />
            </GElement>
        );
    }

    render() {
        const { startX, startY, endX, endY } = this.props;
        const lineOffset = parseInt(CIRCLE_RADIUS, 10);

        return (
            <SVGComponent>
                { this.renderConnectionHandle(startX, startY) }
                <Line
                    x1={startX + lineOffset}
                    y1={startY}
                    x2={endX - lineOffset}
                    y2={endY}
                    strokeWidth={STROKE_WIDTH}
                    stroke={STROKE_COLOR}
                />
                { this.renderConnectionHandle(endX, endY) }
            </SVGComponent>
        );
    }
}
