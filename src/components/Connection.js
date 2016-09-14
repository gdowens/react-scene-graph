import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';
import getEndingConnectionLocation from '../utils/getEndingConnectionLocation';
import PureLine from './PureLine';
import SVGComponent from './SVGComponent';
import CurvedLine from './CurvedLine';
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

class ConnectionBase extends Component {

  static propTypes = {
    connection: PropTypes.object.isRequired,
    endConnectionDragPreview: PropTypes.func.isRequired,
    endConnectionDragSource: PropTypes.func.isRequired,
    endingScene: PropTypes.object.isRequired,
    isEndConnectionDragging: PropTypes.bool.isRequired,
    isStartConnectionDragging: PropTypes.bool.isRequired,
    onConnectionDragChange: PropTypes.func.isRequired,
    onTargetlessConnectionDrop: PropTypes.func.isRequired,
    startConnectionDragPreview: PropTypes.func.isRequired,
    startConnectionDragSource: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.startConnectionDragPreview(getEmptyImage());
    this.props.endConnectionDragPreview(getEmptyImage());
  }

  componentWillReceiveProps(nextProps) {
    const {
      isEndConnectionDragging,
      isStartConnectionDragging,
      onConnectionDragChange,
      connection,
    } = this.props;

    if (!isStartConnectionDragging && nextProps.isStartConnectionDragging) {
      onConnectionDragChange(connection, true);
    } else if (!isEndConnectionDragging && nextProps.isEndConnectionDragging) {
      onConnectionDragChange(connection, true);
    }
  }

  render() {
    const { startConnectionDragSource, endConnectionDragSource, connection, endingScene } = this.props;
    const endLocation = getEndingConnectionLocation(endingScene);

    const { startX, startY } = connection;
    const { x: endX, y: endY } = endLocation;
    const lineOffset = CIRCLE_RADIUS / 2;

    // Can pass this to CurvedLine as reverseOrientation prop
    // to randomize the orientation of the bezier.
    const randomBoolFromConnId = parseInt(connection.id, 10) % 10 < 5;

    const svgContainerStyle = {
      position: 'absolute',
      pointerEvents: 'none',
    };

    return (
      <div>
        <div ref="startHandle">
          {startConnectionDragSource(
            <div style={getCircleStyle(startX, startY, false)}/>
          )}
        </div>
        <SVGComponent
          height={'100%'}
          width={'100%'}
          style={svgContainerStyle}
        >
          <CurvedLine
            startX={startX - lineOffset}
            startY={startY - lineOffset}
            endX={endX - lineOffset}
            endY={endY - lineOffset}
            strokeWidth={STROKE_WIDTH}
            strokeColor={START_STROKE_COLOR}
          />
        </SVGComponent>
        {endConnectionDragSource(
          <div style={getCircleStyle(endX, endY, true)}/>
        )}
      </div>
    );
  }
}

const connectionSource = {
  beginDrag(props) {
    return {...props.connection};
  },
  endDrag(props, monitor) {
    const { connection, onConnectionDragChange, onTargetlessConnectionDrop } = props;
    onConnectionDragChange(connection, false);
    if (!monitor.didDrop()) {
      onTargetlessConnectionDrop(connection.id);
    }
  }
};

const startConnectionCollect = (connect, monitor) => ({
  isStartConnectionDragging: monitor.isDragging(),
  startConnectionDragPreview: connect.dragPreview(),
  startConnectionDragSource: connect.dragSource(),
});

const endConnectionCollect = (connect, monitor) => ({
  isEndConnectionDragging: monitor.isDragging(),
  endConnectionDragPreview: connect.dragPreview(),
  endConnectionDragSource: connect.dragSource(),
});

export default _.flow(
  DragSource(
    ItemTypes.CONNECTION_START,
    connectionSource,
    startConnectionCollect
  ),
  DragSource(
    ItemTypes.CONNECTION_END,
    connectionSource,
    endConnectionCollect
  )
)(ConnectionBase);
