import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';
import SVGComponent from './SVGComponent';
import Circle from './Circle';
import GElement from './GElement';
import Line from './Line';
import _ from 'lodash';

const CIRCLE_RADIUS = "3";
const STROKE_COLOR = "blue";
const STROKE_WIDTH = "2";

class ConnectionSVGBase extends Component {

    static propTypes = {
        startConnectionDragPreview: PropTypes.func.isRequired,
        startConnectionDragSource: PropTypes.func.isRequired,
        endConnectionDragPreview: PropTypes.func.isRequired,
        endConnectionDragSource: PropTypes.func.isRequired,
        startX: PropTypes.number.isRequired,
        startY: PropTypes.number.isRequired,
        endX: PropTypes.number.isRequired,
        endY: PropTypes.number.isRequired,
    };

    componentDidMount() {
        this.props.startConnectionDragPreview(getEmptyImage());
        this.props.endConnectionDragPreview(getEmptyImage());
    }

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
        const { startConnectionDragSource, endConnectionDragSource, startX, startY, endX, endY } = this.props;
        const lineOffset = parseInt(CIRCLE_RADIUS, 10);

        return (
            <SVGComponent>
                {startConnectionDragSource(
                    <div>
                        {this.renderConnectionHandle(startX, startY)}
                    </div>
                )}
                <Line
                    x1={startX + lineOffset}
                    y1={startY}
                    x2={endX - lineOffset}
                    y2={endY}
                    strokeWidth={STROKE_WIDTH}
                    stroke={STROKE_COLOR}
                />
                {endConnectionDragSource(
                    <div>
                        {this.renderConnectionHandle(endX, endY)}
                    </div>
                )}
            </SVGComponent>
        );
    }
}

const startConnectionSource = {
  beginDrag(props) {
    return {...props};
  },
};

const startConnectionCollect = (connect, monitor) => ({
  startConnectionDragPreview: connect.dragPreview(),
  startConnectionDragSource: connect.dragSource(),
});

const endConnectionSource = {
  beginDrag(props) {
    return {...props};
  },
};

const endConnectionCollect = (connect, monitor) => ({
  endConnectionDragPreview: connect.dragPreview(),
  endConnectionDragSource: connect.dragSource(),
});

export default _.flow(
    DragSource(
        ItemTypes.CONNECTION_START,
        startConnectionSource,
        startConnectionCollect
    ),
    DragSource(
        ItemTypes.CONNECTION_END,
        endConnectionSource,
        endConnectionCollect
    )
)(ConnectionSVGBase);
