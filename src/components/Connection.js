import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';
import getEndingConnectionLocation from '../utils/getEndingConnectionLocation';
import SVGComponent from './SVGComponent';
import CurvedLine from './CurvedLine';
import shallowEqual from '../utils/shallowEqual';
const STROKE_COLOR = "#4A90E2";
const STROKE_WIDTH = 2;

function getCircleStyle (x, y, end) {
  const circleSize = end ? 10 : 4;
  const circleOffset = end ? 6 : 4;
  return {
    height: `${circleSize}px`,
    width: `${circleSize}px`,
    borderRadius: '50%',
    border: `${STROKE_WIDTH}px solid ${STROKE_COLOR}`,
    position: 'absolute',
    left: x - circleOffset,
    top: y - circleOffset,
    backgroundColor: STROKE_COLOR,
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

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }

  render() {
    const { startConnectionDragSource, endConnectionDragSource, connection, endingScene } = this.props;
    const { startX, startY } = connection;
    const endLocation = getEndingConnectionLocation(endingScene, startX < endingScene.x, this.props.endingVertOffset);
    const { x: endX, y: endY } = endLocation;

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
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
            strokeWidth={STROKE_WIDTH}
            strokeColor={STROKE_COLOR}
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
