import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';
import getConnectionLocation from '../utils/getConnectionLocation';
import SVGComponent from './SVGComponent';
import Circle from './Circle';
import GElement from './GElement';
import Line from './Line';
import PureLine from './PureLine';
const CIRCLE_RADIUS = 3;
const STROKE_COLOR = "blue";
const STROKE_WIDTH = 2;

const fullSizedStyle = {
  height: '100%',
  width: '100%',
};

function getCircleStyle (x, y) {
  return {
    height: '5px',
    width: '5px',
    borderRadius: '50%',
    border: `${STROKE_WIDTH}px solid ${STROKE_COLOR}`,
    position: 'fixed',
    left: x - 4,
    top: y - 4,
  };
}

class ConnectionBase extends Component {

    static propTypes = {
        connection: PropTypes.object.isRequired,
        endingScene: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.startConnectionDragPreview(getEmptyImage());
        this.props.endConnectionDragPreview(getEmptyImage());
    }

    render() {
        const { startConnectionDragSource, endConnectionDragSource, connection, endingScene } = this.props;
        const endLocation = getConnectionLocation(endingScene);

        const { startX, startY } = connection;
        const { x: endX, y: endY } = endLocation;

        console.log(connection);

        return (
            <div>
              {startConnectionDragSource(
                <div style={getCircleStyle(startX, startY)}/>
              )}
              <PureLine
                from={{
                  x: startX + CIRCLE_RADIUS,
                  y: startY,
                }}
                to={{
                  x: endX - CIRCLE_RADIUS,
                  y: endY,
                }}
                borderBottom={`${STROKE_WIDTH}px solid ${STROKE_COLOR}`}
              />
              {endConnectionDragSource(
                <div style={getCircleStyle(endX, endY)}/>
              )}
            </div>
        );
    }
}

const startConnectionSource = {
  beginDrag(props) {
    console.log("dragging start on this bitch");
    return props;
  },
};

const startConnectionCollect = (connect, monitor) => ({
  startConnectionDragPreview: connect.dragPreview(),
  startConnectionDragSource: connect.dragSource(),
});

const endConnectionSource = {
  beginDrag(props) {
    console.log("dragging end on bubba");
    return props;
  },
};

const endConnectionCollect = (connect, monitor) => ({
  endConnectionDragPreview: connect.dragPreview(),
  endConnectionDragSource: connect.dragSource(),
});

// export default DragSource(
//   ItemTypes.CONNECTION_START,
//   startConnectionSource,
//   startConnectionCollect
// )(ConnectionBase);

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
)(ConnectionBase);
