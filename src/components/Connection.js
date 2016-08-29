import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from '../constants/ItemTypes';
import ConnectionSVG from './ConnectionSVG';
import getConnectionLocation from '../utils/getConnectionLocation';

class ConnectionBase extends Component {

    static propTypes = {
        connectConnectionDragSource: PropTypes.func.isRequired,
        connection: PropTypes.object.isRequired,
        endingScene: PropTypes.object.isRequired,
    };

    render() {
        const { connectConnectionDragSource, connection, endingScene } = this.props;
        const endLocation = getConnectionLocation(endingScene);

        return (
            <ConnectionSVG
                startX={connection.startX}
                startY={connection.startY}
                endX={endLocation.x}
                endY={endLocation.y}
            />
        );
    }
}
// you're hooking up connection as a drag source so
// you can modify and delete existing connections

const connectionSource = {
  beginDrag(props) {
    console.log("we dragging", props.connection.id);
    return {...props.connection};
  },
  endDrag(props, monitor, component) {
    console.log("WTF");
    if (!monitor.didDrop()) {
      props.onTargetlessConnectionDrop(monitor.getItem().id);
    }
  },
};

const dragConnectionCollect = (connect, monitor) => ({
  connectConnectionDragPreview: connect.dragPreview(),
  connectConnectionDragSource: connect.dragSource(),
});

export default DragSource(
  ItemTypes.CONNECTION,
  connectionSource,
  dragConnectionCollect
)(ConnectionBase);
