import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../constants/ItemTypes';

class SceneBase extends Component {
  static propTypes = {
    canDrag: PropTypes.bool.isRequired,
    connectConnectionDragPreview: PropTypes.func.isRequired,
    connectConnectionDragSource: PropTypes.func.isRequired,
    onTargetlessConnectionDrop: PropTypes.func.isRequired,
    renderScene: PropTypes.func.isRequired,
    scene: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.connectConnectionDragPreview(getEmptyImage());
  }

  render() {
    const { connectConnectionDragSource, renderScene, scene } = this.props;

    return connectConnectionDragSource(
      <div>
        {renderScene(scene)}
      </div>
    )
  }
}

const connectionSource = {
  beginDrag(props) {
    return {...props.scene};
  },
  canDrag(props) {
    return props.canDrag;
  },
  endDrag(props, monitor, component) {
    console.log("monitor", monitor.didDrop());
    console.log(monitor.getItem());
    console.log(monitor.getItemType());
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
)(SceneBase);
